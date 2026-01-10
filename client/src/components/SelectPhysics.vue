<template>
  <div class="w-full">
    <!-- 控制列：在白色互動視窗外 -->
    <div class="mb-3 flex items-center justify-between">
      <div class="text-sm text-white">
        球數：<span class="font-medium text-white">{{ ballCount }}</span> / {{ MAX_BALLS }}
      </div>

      <div class="flex gap-2">
        <button
          type="button"
          class="px-3 py-1.5 text-sm rounded-lg border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.99]
                 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="limitPulse ? 'animate-[limitShake_.35s_ease-in-out]' : ''"
          @click="handleAddBall"
          :disabled="!ready"
        >
          <span v-if="ballCount < MAX_BALLS " class="text-black">新增球</span>
          <span v-else class="text-black inline-flex items-center gap-2">
            已達上限
          </span>
        </button>

        <button
          type="button"
          class="text-black px-3 py-1.5 text-sm rounded-lg border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.99]
                 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="resetAll"
          :disabled="ballCount === 0 || !ready"
        >
          重置
        </button>
      </div>
    </div>

    <!-- 白色互動視窗：只放物理場景 -->
    <div class="relative w-full h-[200px] rounded-xl border border-white border-slate-200 bg-black overflow-hidden">
      <div ref="sceneEl" class="w-full h-full"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import * as Matter from "matter-js";

/** ✅ 你要的上限 */
const MAX_BALLS = 5;

/** ✅ 每顆球的「半徑」用 array 記錄（可自行調整） */
const ballRadii = [26, 40, 22, 34, 58]; // 0~4 對應第 1~5 顆球

/**
 * ✅ 球的貼圖（你提供的兩張圖）
 * 請把檔案放在：src/assets/青剛櫟.png、src/assets/月桃.png
 * 若你放不同資料夾/不同檔名，改這裡即可
 */
const tex1 = new URL("../assets/青剛櫟.png", import.meta.url).href;
const tex2 = new URL("../assets/月桃.png", import.meta.url).href;
const tex3 = new URL("../assets/五節芒.png", import.meta.url).href;
const tex4 = new URL("../assets/赤榕.png", import.meta.url).href;
const tex5 = new URL("../assets/金草蘭.png", import.meta.url).href;

/** ✅ 你只有兩張圖，所以我用 pattern 重複到 5 顆 */
const ballTextures = [
  tex1,
  tex2,
  tex3,
  tex4,
  tex5
];

/** 你的圖片邊長（你給的圖是 512；其中一張是 512x511 也可當 512） */
const textureBaseSize = 512;

const sceneEl = ref(null);
const ballCount = ref(0);
const ready = ref(false);
const limitPulse = ref(false);

let engine, render, runner;
let walls = [];
let balls = [];
let mouseConstraint = null;

function buildWorld() {
  const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint } = Matter;

  engine = Engine.create();
  engine.gravity.y = 0;

  const el = sceneEl.value;
  const w = el.clientWidth;
  const h = el.clientHeight;

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
      background: "#000000",
      pixelRatio: window.devicePixelRatio || 1,
    },
  });

  // Walls（避免球飛出去）
  const t = 60;
  const wallOpts = { isStatic: true, render: { visible: false } };
  walls = [
    Bodies.rectangle(w / 2, -t / 2, w + t * 2, t, wallOpts),
    Bodies.rectangle(w / 2, h + t / 2, w + t * 2, t, wallOpts),
    Bodies.rectangle(-t / 2, h / 2, t, h + t * 2, wallOpts),
    Bodies.rectangle(w + t / 2, h / 2, t, h + t * 2, wallOpts),
  ];
  World.add(engine.world, walls);

  // 滑鼠拖曳
  const mouse = Mouse.create(render.canvas);
  mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: { stiffness: 0.12, render: { visible: false } },
  });
  World.add(engine.world, mouseConstraint);
  render.mouse = mouse;

  Render.run(render);
  runner = Runner.create();
  Runner.run(runner, engine);

  ready.value = true;
}

function teardown() {
  if (!engine) return;

  const { Render, Runner, World, Engine } = Matter;

  ready.value = false;

  if (runner) Runner.stop(runner);
  if (render) Render.stop(render);

  World.clear(engine.world, false);
  Engine.clear(engine);

  if (render?.canvas?.parentNode) render.canvas.parentNode.removeChild(render.canvas);

  engine = render = runner = null;
  walls = [];
  balls = [];
  mouseConstraint = null;

  ballCount.value = 0;
}

/** ✅ 找不重疊生成位置（會考慮新球半徑 + 既有球半徑） */
function findNonOverlappingPosition(newR) {
  const w = sceneEl.value.clientWidth;
  const h = sceneEl.value.clientHeight;

  const margin = newR + 10; // 離牆的安全距離
  const gap = 8;            // 球與球的最小間隙
  const tries = 80;         // 嘗試次數

  for (let k = 0; k < tries; k++) {
    const x = margin + Math.random() * (w - margin * 2);
    const y = margin + Math.random() * (h - margin * 2);

    let ok = true;
    for (const b of balls) {
      const rb = b.circleRadius || newR;
      const dx = x - b.position.x;
      const dy = y - b.position.y;
      const dist2 = dx * dx + dy * dy;
      const minDist = newR + rb + gap;
      if (dist2 < minDist * minDist) {
        ok = false;
        break;
      }
    }

    if (ok) return { x, y };
  }

  return null;
}

function handleAddBall() {
  if (!ready.value) return;

  if (ballCount.value >= MAX_BALLS) {
    // ✅ 上限提示動畫
    limitPulse.value = false;
    requestAnimationFrame(() => {
      limitPulse.value = true;
      setTimeout(() => (limitPulse.value = false), 380);
    });
    return;
  }

  addBall();
}

function addBall() {
  const { Bodies, Body, World } = Matter;

  const idx = ballCount.value; // 0~4
  const r = ballRadii[idx] ?? 28;

  const pos = findNonOverlappingPosition(r);
  if (!pos) {
    console.warn("No space to spawn a new ball (non-overlapping).");
    return;
  }

  // ✅ 讓 sprite 貼圖大小 = 球直徑
  const scale = (2 * r) / textureBaseSize;

  const ball = Bodies.circle(pos.x, pos.y, r, {
    restitution: 0.95,
    friction: 0.02,
    frictionAir: 0.002,
    density: 0.002,
    render: {
      sprite: {
        texture: ballTextures[idx] || texOak,
        xScale: scale,
        yScale: scale,
      },
    },
  });

  World.add(engine.world, ball);
  balls.push(ball);
  ballCount.value = balls.length;

  // ✅ 給初速度（避免完全靜止）
  const vx = (Math.random() > 0.5 ? 1 : -1) * (4 + Math.random() * 3);
  const vy = (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 2);
  Body.setVelocity(ball, { x: vx, y: vy });
}

function resetAll() {
  if (!ready.value) return;

  const { World } = Matter;

  for (const b of balls) World.remove(engine.world, b);
  balls = [];
  ballCount.value = 0;
}

onMounted(() => {
  buildWorld();
});

onBeforeUnmount(() => {
  teardown();
});
</script>

<style>
@keyframes limitShake {
  0%   { transform: translateX(0); }
  25%  { transform: translateX(-4px); }
  50%  { transform: translateX(4px); }
  75%  { transform: translateX(-3px); }
  100% { transform: translateX(0); }
}
</style>
