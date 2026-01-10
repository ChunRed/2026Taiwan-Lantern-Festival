<template>
  <div class="w-full">
    <!-- 控制列：8 個 Toggle（在互動視窗外） -->
    <div class="mb-3 flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <div class="text-sm text-white">
          球數：<span class="font-medium text-white">{{ ballCount }}</span> / {{ MAX_BALLS }}
        </div>

        <button
          type="button"
          class="text-black px-3 py-1.5 text-sm rounded-lg border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.99]
                 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="resetAll"
          :disabled="ballCount === 0 || !ready"
        >
          重置歸零
        </button>
      </div>

      <!-- 8 個 Toggle -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          v-for="i in MAX_BALLS"
          :key="i"
          type="button"
          @click="toggleBall(i - 1)"
          :disabled="!ready"
          class="relative flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition
                 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="toggles[i-1]
            ? 'bg-white text-black border-white/50'
            : 'bg-black text-white border-white/20 hover:border-white/40'"
        >
          <span class="font-medium">Toggle {{ i }}</span>

          <!-- 右側小指示燈 -->
          <span
            class="ml-3 inline-flex items-center gap-2"
          >
            <span
              class="h-2.5 w-2.5 rounded-full"
              :class="toggles[i-1] ? 'bg-emerald-400' : 'bg-white/30'"
            />
            <span class="text-xs opacity-80">{{ toggles[i-1] ? 'ON' : 'OFF' }}</span>
          </span>
        </button>
      </div>
    </div>

    <!-- 互動視窗 -->
    <div class="relative w-full h-[200px] rounded-xl border border-white/30 bg-black overflow-hidden">
      <div ref="sceneEl" class="w-full h-full"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import * as Matter from "matter-js";

const MAX_BALLS = 8;

/** 每顆球半徑（index 0~7 對應 Toggle 1~8） */
const ballRadii = [26, 30, 22, 34, 48, 20, 10, 35];

/** 每顆球貼圖（index 0~7 對應 Toggle 1~8） */
const tex1 = new URL("../assets/構樹.png", import.meta.url).href;
const tex2 = new URL("../assets/月桃.png", import.meta.url).href;
const tex3 = new URL("../assets/青剛櫟.png", import.meta.url).href;
const tex4 = new URL("../assets/小葉桑.png", import.meta.url).href;
const tex5 = new URL("../assets/五節芒.png", import.meta.url).href;
const tex6 = new URL("../assets/赤榕.png", import.meta.url).href;
const tex7 = new URL("../assets/穀穗.png", import.meta.url).href;
const tex8 = new URL("../assets/金草蘭.png", import.meta.url).href;

const ballTextures = [tex1, tex2, tex3, tex4, tex5, tex6, tex7, tex8];

/** 你的圖片邊長（你提供的 icon 是 512 左右） */
const textureBaseSize = 512;

const sceneEl = ref(null);
const ready = ref(false);
const ballCount = ref(0);

/** 8 個 toggle 狀態 */
const toggles = ref(Array.from({ length: MAX_BALLS }, () => false));

/**
 * 用 map 記錄「每個 index 對應的 Matter body」
 * - key: 0~7
 * - value: Body
 */
const ballByIndex = new Map();

let engine, render, runner;
let walls = [];
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

  // Walls
  const t = 60;
  const wallOpts = { isStatic: true, render: { visible: false } };
  walls = [
    Bodies.rectangle(w / 2, -t / 2, w + t * 2, t, wallOpts),
    Bodies.rectangle(w / 2, h + t / 2, w + t * 2, t, wallOpts),
    Bodies.rectangle(-t / 2, h / 2, t, h + t * 2, wallOpts),
    Bodies.rectangle(w + t / 2, h / 2, t, h + t * 2, wallOpts),
  ];
  World.add(engine.world, walls);

  // Mouse drag
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
  mouseConstraint = null;

  // 清球狀態
  ballByIndex.clear();
  toggles.value = Array.from({ length: MAX_BALLS }, () => false);
  ballCount.value = 0;
}

function updateBallCount() {
  ballCount.value = ballByIndex.size;
}

/** 找不重疊位置：會避開目前所有存在的球 */
function findNonOverlappingPosition(newR) {
  const w = sceneEl.value.clientWidth;
  const h = sceneEl.value.clientHeight;

  const margin = newR + 10;
  const gap = 8;
  const tries = 120;

  // 目前存在的球 bodies
  const existingBodies = Array.from(ballByIndex.values());

  for (let k = 0; k < tries; k++) {
    const x = margin + Math.random() * (w - margin * 2);
    const y = margin + Math.random() * (h - margin * 2);

    let ok = true;
    for (const b of existingBodies) {
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

function createBallByIndex(idx) {
  const { Bodies, Body, World } = Matter;

  const r = ballRadii[idx] ?? 28;
  const pos = findNonOverlappingPosition(r);
  if (!pos) {
    console.warn(`No space to spawn ball #${idx + 1} (non-overlapping).`);
    return null;
  }

  const scale = (2 * r) / textureBaseSize;

  const ball = Bodies.circle(pos.x, pos.y, r, {
    restitution: 0.95,
    friction: 0.02,
    frictionAir: 0.002,
    density: 0.002,
    render: {
      sprite: {
        texture: ballTextures[idx],
        xScale: scale,
        yScale: scale,
      },
    },
  });

  World.add(engine.world, ball);

  // 初速度，讓它有生命感
  const vx = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 3);
  const vy = (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 2);
  Body.setVelocity(ball, { x: vx, y: vy });

  return ball;
}

function removeBallByIndex(idx) {
  const { World } = Matter;
  const body = ballByIndex.get(idx);
  if (!body) return;

  World.remove(engine.world, body);
  ballByIndex.delete(idx);
}

function toggleBall(idx) {
  if (!ready.value) return;

  const next = !toggles.value[idx];

  if (next) {
    // ON：若尚未存在就建立
    if (!ballByIndex.has(idx)) {
      const ball = createBallByIndex(idx);
      if (!ball) return; // 找不到空位就不切 ON
      ballByIndex.set(idx, ball);
    }
    toggles.value[idx] = true;
  } else {
    // OFF：移除
    removeBallByIndex(idx);
    toggles.value[idx] = false;
  }

  updateBallCount();
}

function resetAll() {
  if (!ready.value) return;

  // 全部 OFF + 移除所有球
  for (let i = 0; i < MAX_BALLS; i++) {
    removeBallByIndex(i);
  }
  ballByIndex.clear();
  toggles.value = Array.from({ length: MAX_BALLS }, () => false);
  updateBallCount();
}

onMounted(() => {
  buildWorld();
});

onBeforeUnmount(() => {
  teardown();
});
</script>
