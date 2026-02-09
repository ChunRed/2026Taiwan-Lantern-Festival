<template>
  <div class="w-full">
    <!-- 互動視窗 -->
    <div class="relative w-[110%] h-[250px] -ml-5 bg-black overflow-hidden">
      <div ref="sceneEl" class="] ml-5 h-full"></div>
      <div
        class="absolute w-[110%] h-24 bottom-0 -ml-5 mt-1 z-20 bg-gradient-to-t from-[#517ADA] to-black-500"
      >
        <!-- Button -->
        <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex-none z-10">
          <RouterLink
            to="/gen-show"
            class="flex h-12 w-12 items-center justify-center rounded-full border border-[#517ADA] bg-black/60"
          >
            <span class="text-3xl leading-none text-[#517ADA]"> › </span>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>

  <!-- Divider -->
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watchEffect } from "vue";
import * as Matter from "matter-js";
import "matter-js/build/matter.js";

const props = defineProps({
  Index: {
    type: Array,
    required: true,
    default: () => [],
  },

  Scale: {
    type: Array,
    required: true,
    default: () => [10, 10, 10, 10, 10, 10, 10, 10],
  },

  Value: {
    type: Number,
    required: true,
    default: 0,
  },
});

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
  const {
    Engine,
    Render,
    Runner,
    World,
    Bodies,
    Body,
    Mouse,
    MouseConstraint,
    Events,
  } = Matter;

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
  const t = 2000;
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
    constraint: { stiffness: 0.05, render: { visible: false } },
  });
  World.add(engine.world, mouseConstraint);
  render.mouse = mouse;

  // Add center gravity
  Events.on(engine, "beforeUpdate", () => {
    const cx = w / 2;
    const cy = h / 2;
    for (const ball of ballByIndex.values()) {
      // Calculate vector to center
      const dx = cx - ball.position.x;
      const dy = cy - ball.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Apply force if not too close to center
      if (dist > 5) {
        const forceMagnitude = 0.0003 * ball.mass;
        Body.applyForce(ball, ball.position, {
          x: (dx / dist) * forceMagnitude,
          y: (dy / dist) * forceMagnitude,
        });
      }

      // Keep within bounds (Safety Net)
      const r = ball.circleRadius; // approximate
      let clamped = false;
      let newX = ball.position.x;
      let newY = ball.position.y;

      if (newX < r) {
        newX = r;
        clamped = true;
      } else if (newX > w - r) {
        newX = w - r;
        clamped = true;
      }

      if (newY < r) {
        newY = r;
        clamped = true;
      } else if (newY > h - r) {
        newY = h - r;
        clamped = true;
      }

      if (clamped) {
        Body.setPosition(ball, { x: newX, y: newY });
        Body.setVelocity(ball, {
          x: ball.velocity.x * -0.5,
          y: ball.velocity.y * -0.5,
        }); // Bounce back slightly
      }
    }
  });

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

  if (render?.canvas?.parentNode)
    render.canvas.parentNode.removeChild(render.canvas);

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

  const table = [10, 20, 30, 40, 50];
  const idx2 = Math.min(Math.floor(props.Scale[idx] / 20), table.length - 1);
  const r = table[idx2];

  // Gap adjustment: increase physics body size
  // Visual radius = r
  // Physics radius = r + padding
  const padding = 5;
  const collisionRadius = r + padding;

  let pos = findNonOverlappingPosition(collisionRadius);
  if (!pos) {
    // Fallback: Random position (ignoring overlap)
    console.warn(`No space to spawn ball #${idx + 1}, forcing spawn.`);
    const w = sceneEl.value.clientWidth;
    const h = sceneEl.value.clientHeight;
    // Ensure we don't spawn inside walls too much
    const margin = collisionRadius + 10;
    pos = {
      x: margin + Math.random() * (w - margin * 2),
      y: margin + Math.random() * (h - margin * 2),
    };
  }

  // Scale based on original visual radius 'r'
  const scale = (2 * r) / textureBaseSize;

  const ball = Bodies.circle(pos.x, pos.y, collisionRadius, {
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

  //const next = !toggles.value[idx];
  const next = props.Index[idx];

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

onMounted(() => {
  buildWorld();
});

onBeforeUnmount(() => {
  teardown();
});

watchEffect(() => {
  toggleBall(props.Value);
});
</script>
