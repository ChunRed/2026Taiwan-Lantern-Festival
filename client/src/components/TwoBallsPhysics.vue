<template>
  <div
    class="relative w-full h-[420px] rounded-xl border border-slate-200 bg-white overflow-hidden"
  >
    <!-- Matter.js 會把 canvas 掛在這個容器 -->
    <div ref="sceneEl" class="w-full h-full"></div>

    <div class="absolute top-3 right-3 flex gap-2">
      <button
        type="button"
        class="px-3 py-1.5 text-sm rounded-lg border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.99]"
        @click="reset"
      >
        重置
      </button>

      <button
        type="button"
        class="px-3 py-1.5 text-sm rounded-lg border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.99]"
        @click="kick"
      >
        推一下
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import * as Matter from "matter-js"; // ✅ Vite/ESM 建議用這個

const sceneEl = ref(null);

let engine, render, runner;
let ballA, ballB;

function buildWorld() {
  const { Engine, Render, Runner, World, Bodies, Body, Mouse, MouseConstraint } = Matter;

  engine = Engine.create();
  engine.gravity.y = 0;

  const el = sceneEl.value;
  const w = el.clientWidth;
  const h = el.clientHeight;

  // ✅ 若尺寸為 0，直接中止（避免「正常跑但看不到」）
  if (!w || !h) {
    console.warn("Scene size is 0. Check Tailwind height/width.", { w, h });
    return;
  }

  render = Render.create({
    element: el,
    engine,
    options: {
      width: w,
      height: h,
      wireframes: false,
      background: "#ffffff",
      pixelRatio: window.devicePixelRatio || 1,
    },
  });

  // 牆（避免球飛出去）
  const t = 60;
  const wallOpts = { isStatic: true, render: { visible: false } };
  const walls = [
    Bodies.rectangle(w / 2, -t / 2, w + t * 2, t, wallOpts),
    Bodies.rectangle(w / 2, h + t / 2, w + t * 2, t, wallOpts),
    Bodies.rectangle(-t / 2, h / 2, t, h + t * 2, wallOpts),
    Bodies.rectangle(w + t / 2, h / 2, t, h + t * 2, wallOpts),
  ];

  const r = 34;
  const common = {
    restitution: 0.95,
    friction: 0.02,
    frictionAir: 0.002,
    density: 0.002,
  };

  ballA = Bodies.circle(w * 0.35, h * 0.5, r, {
    ...common,
    render: { fillStyle: "#111827" },
  });

  ballB = Bodies.circle(w * 0.65, h * 0.5, r, {
    ...common,
    render: { fillStyle: "#0ea5e9" },
  });

  World.add(engine.world, [...walls, ballA, ballB]);

  // 滑鼠拖曳
  const mouse = Mouse.create(render.canvas);
  const mc = MouseConstraint.create(engine, {
    mouse,
    constraint: { stiffness: 0.12, render: { visible: false } },
  });
  World.add(engine.world, mc);
  render.mouse = mouse;

  Render.run(render);
  runner = Runner.create();
  Runner.run(runner, engine);

  // 一開始推一下
  Body.setVelocity(ballA, { x: 6, y: 0.5 });
  Body.setVelocity(ballB, { x: -6, y: -0.5 });
}

function teardown() {
  if (!engine) return;

  const { Render, Runner, World, Engine } = Matter;

  if (runner) Runner.stop(runner);
  if (render) Render.stop(render);

  World.clear(engine.world, false);
  Engine.clear(engine);

  // 移除 canvas
  if (render?.canvas?.parentNode) render.canvas.parentNode.removeChild(render.canvas);

  engine = render = runner = null;
  ballA = ballB = null;
}

function reset() {
  if (!ballA || !ballB) return;
  const { Body } = Matter;

  const w = sceneEl.value.clientWidth;
  const h = sceneEl.value.clientHeight;

  Body.setPosition(ballA, { x: w * 0.35, y: h * 0.5 });
  Body.setPosition(ballB, { x: w * 0.65, y: h * 0.5 });

  Body.setVelocity(ballA, { x: 0, y: 0 });
  Body.setVelocity(ballB, { x: 0, y: 0 });
  Body.setAngularVelocity(ballA, 0);
  Body.setAngularVelocity(ballB, 0);
}

function kick() {
  if (!ballA || !ballB) return;
  const { Body } = Matter;
  Body.setVelocity(ballA, { x: 6, y: 0.5 });
  Body.setVelocity(ballB, { x: -6, y: -0.5 });
}

onMounted(() => {
  buildWorld();
});

onBeforeUnmount(() => {
  teardown();
});
</script>
