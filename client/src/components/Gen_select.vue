<template>
  <div class="w-full flex justify-center items-center py-4">
    <!-- Circular Interactive Window -->
    <div class="relative w-[340px] h-[340px] rounded-full bg-black overflow-hidden shadow-[0_0_50px_rgba(81,122,218,0.2)] border border-[#517ADA]/30">
      
      <!-- Shader Background -->
      <canvas ref="bgCanvas" class="absolute inset-0 w-full h-full z-0 block"></canvas>

      <!-- Matter.js Scene (z-10 to stay on top) -->
      <div ref="sceneEl" class="relative w-full h-full z-10"></div>

      <!-- Bottom Button Overlay -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <RouterLink
          to="/gen-show"
          class="flex h-12 w-12 items-center justify-center rounded-full border border-[#517ADA] bg-black/60 pointer-events-auto backdrop-blur-sm hover:bg-[#517ADA]/20 transition-colors"
        >
          <span class="text-3xl leading-none text-[#517ADA] pb-1"> › </span>
        </RouterLink>
      </div>
      
      <!-- Optional: Gradient overlay for depth at bottom -->
      <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none z-10"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watchEffect } from "vue";
import * as Matter from "matter-js";
import "matter-js/build/matter.js";
import plantData from "@/data/plantData.json";

// --- Shader Configuration ---
const CONFIG = {
  dotDensity: 20.0,    // 圓點密度 (Grid Size) - 越大越密
  sizeVariance: 10,     // 大小差異程度 (0.0 - 1.0)
  avoidRadius: 0.1,    // 避開元素的半徑 (0.0 - 0.5, 相對於畫布寬度)
  maxDiameter: 0.3    // 最大圓點直徑 (0.01 - 0.2)
};
// ----------------------------

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
const ballRadii = [26, 30, 22, 34, 48, 20, 10, 35];

const tex1 = new URL("../assets/赤榕.png", import.meta.url).href;
const tex2 = new URL("../assets/金草蘭.png", import.meta.url).href;
const tex3 = new URL("../assets/構樹.png", import.meta.url).href;
const tex4 = new URL("../assets/月桃.png", import.meta.url).href;
const tex5 = new URL("../assets/青剛櫟.png", import.meta.url).href;
const tex6 = new URL("../assets/小葉桑.png", import.meta.url).href;
const tex7 = new URL("../assets/五節芒.png", import.meta.url).href;
const tex8 = new URL("../assets/穀穗.png", import.meta.url).href;
const ballTextures = [tex1, tex2, tex3, tex4, tex5, tex6, tex7, tex8];
const textureBaseSize = 512;

const sceneEl = ref(null);
const bgCanvas = ref(null);
const ready = ref(false);
const ballCount = ref(0);
const toggles = ref(Array.from({ length: MAX_BALLS }, () => false));
const ballByIndex = new Map();

let engine, render, runner;
let walls = [];
let mouseConstraint = null;

// --- Shader Logic ---
let gl, program, rafId, startTime;

const vertexShaderSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  
  // Config Uniforms
  uniform float u_density;
  uniform float u_sizeVariance;
  uniform float u_maxDiameter;
  
  // Obstacles (Ball positions)
  // x, y = UV coordinates (0-1), z = radius (UV space)
  uniform vec3 u_obstacles[8]; 
  uniform int u_obstacleCount;

  // Hash function for randomness
  vec3 hash3(vec2 p) {
      vec3 q = vec3( dot(p,vec2(127.1,311.7)), 
                    dot(p,vec2(269.5,183.3)), 
                    dot(p,vec2(419.2,371.9)) );
      return fract(sin(q)*43758.5453);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.y;
    // Correction for aspect ratio if needed, but here canvas is square so resolution.y is fine.
    // However, obstacles are passed in 0-1 range relative to canvas dimensions.
    vec2 normUV = gl_FragCoord.xy / u_resolution.xy;
    
    // Grid system
    float zoom = u_density;
    vec2 st = uv * zoom;
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    vec3 color = vec3(0.0);

    // 3x3 Neighbor Loop
    for(int y = -1; y <= 1; y++) {
        for(int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 cellID = i_st + neighbor;
            
            // Randoms: x,y for offset, z for size/brightness
            vec3 rnd = hash3(cellID);
            
            // Animate point
            vec2 point = neighbor + 0.5 + 0.4 * sin(u_time * (1.0 + rnd.x * 2.0) + rnd.xy * 6.28);
            
            // Vector from pixel to point
            vec2 diff = point - f_st;
            float dist = length(diff);
            
            // Calculate Point Position in Normalized UV Space for collision check
            // Logic: 
            // point position relative to canvas = (i_st + point) / zoom * resolution.y / resolution.xy
            // because uv = gl_FragCoord / res.y, so st = gl_FragCoord / res.y * zoom
            // pos_in_st = i_st + point
            // pos_in_uv_y_norm = pos_in_st / zoom
            // pos_norm = pos_in_uv_y_norm * (res.y / res.xy)
            vec2 pointPos = (i_st + point) / zoom;
            // Since canvas is square (w=h=340), res.y == res.x, so uv == normUV roughly
            // Careful with coordinate flipping. Fragment shader 0,0 is usually bottom-left.
            // Obstacles passed in are top-left based (flipped Y manually in JS).
            // So if we compare pointPos checks obstacles properly.
            
            // Scale Variance
            // Base size factor
            float sizeBase = u_maxDiameter;
            float randomSize = 1.0 - (u_sizeVariance * rnd.z * 0.8);
            float currentSizeFactor = sizeBase * randomSize;
            
            // Glow calculation: 1/dist
            // Intensity formula modified by size
            float intensity = currentSizeFactor / (dist * dist + 0.01);
            
            // Mask intensity to make them distinct dots
            intensity = smoothstep(0.01, 1.0, intensity * 0.2); 
            
            // Obstacle Avoidance
            // Check distance from pointPos to all obstacles
            float obsMask = 1.0;
            // WebGL 1 loop must be constant unrolled or fixed size
            for (int i = 0; i < 8; ++i) {
                // If index >= count, we effectively skip by not modifying mask, but we can't break easily in all drivers
                // So we zero out effect. Or just check radius > 0
                vec3 obs = u_obstacles[i];
                if (obs.z > 0.0) {
                     float dToObs = distance(pointPos, obs.xy);
                     // Smooth fade out if closer than radius + margin
                     // obs.z is radius (e.g. 0.1)
                     // If distance < radius, alpha = 0
                     obsMask *= smoothstep(obs.z * 0.8, obs.z * 1.2, dToObs);
                }
            }
            
            intensity *= obsMask;

            // Color tint (Cyan/Blue-ish)
            vec3 tint = vec3(0.3, 0.48, 0.85); 
            tint += vec3(rnd.x * 0.2, rnd.y * 0.1, 0.0);
            
            // Accumulate
            color += tint * intensity;
        }
    }
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

function initShader() {
  const canvas = bgCanvas.value;
  if (!canvas) return;

  gl = canvas.getContext("webgl");
  if (!gl) return;

  // Compile Shaders
  const vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, vertexShaderSource);
  gl.compileShader(vs);
  if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(vs)); return; }

  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, fragmentShaderSource);
  gl.compileShader(fs);
  if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(fs)); return; }

  program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  // Buffers
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 1, -1, -1, 1, 1, 1
  ]), gl.STATIC_DRAW);

  const posLoc = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  // Start Loop
  startTime = performance.now();
  resizeShader();
  window.addEventListener('resize', resizeShader);
  renderShader();
}

function resizeShader() {
  if (!bgCanvas.value || !gl) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = bgCanvas.value.getBoundingClientRect();
  bgCanvas.value.width = rect.width * dpr;
  bgCanvas.value.height = rect.height * dpr;
  gl.viewport(0, 0, bgCanvas.value.width, bgCanvas.value.height);
}

function renderShader() {
  if (!gl || !program) return;
  
  const t = (performance.now() - startTime) * 0.001;
  gl.useProgram(program);
  
  const uRes = gl.getUniformLocation(program, "u_resolution");
  const uTime = gl.getUniformLocation(program, "u_time");
  const uDensity = gl.getUniformLocation(program, "u_density");
  const uSizeVariance = gl.getUniformLocation(program, "u_sizeVariance");
  const uMaxDiameter = gl.getUniformLocation(program, "u_maxDiameter");
  const uObstacles = gl.getUniformLocation(program, "u_obstacles");
  
  gl.uniform2f(uRes, bgCanvas.value.width, bgCanvas.value.height);
  gl.uniform1f(uTime, t);
  gl.uniform1f(uDensity, CONFIG.dotDensity);
  gl.uniform1f(uSizeVariance, CONFIG.sizeVariance);
  gl.uniform1f(uMaxDiameter, CONFIG.maxDiameter);
  
  // Calculate Obstacles Positions
  // Need to gather all active balls and convert physics coordinates (px) to UV (0-1)
  // WebGL 0,0 is usually bottom-left. 
  // Matter.js 0,0 is top-left.
  // HTML Canvas 0,0 is top-left.
  // We need to pass UVs that match the fragment shader logic.
  // GlFragCoord is bottom-left (0,0).
  const obstaclesData = new Float32Array(8 * 3); // 8 vec3s
  let idx = 0;
  
  if (sceneEl.value) {
    const w = sceneEl.value.clientWidth;
    const h = sceneEl.value.clientHeight;
    
    for (const ball of ballByIndex.values()) {
        if (idx >= 8) break;
        
        const bx = ball.position.x;
        const by = ball.position.y;
        
        // Convert to UV (0-1)
        // Physics Y is top-down. GL FragCoord Y is bottom-up.
        const uvX = bx / w;
        const uvY = 1.0 - (by / h); // Flip Y
        
        // Radius in UV space (approximate using width)
        // Add some padding from CONFIG
        const uvRadius = (ball.circleRadius / w) + CONFIG.avoidRadius * 0.2; 
        
        obstaclesData[idx * 3 + 0] = uvX;
        obstaclesData[idx * 3 + 1] = uvY;
        obstaclesData[idx * 3 + 2] = uvRadius;
        
        idx++;
    }
  }
  
  gl.uniform3fv(uObstacles, obstaclesData);
  
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  rafId = requestAnimationFrame(renderShader);
}
// -------------------

function buildWorld() {
  const { Engine, Render, Runner, World, Bodies, Body, Mouse, MouseConstraint, Events } = Matter;

  engine = Engine.create();
  engine.gravity.y = 0; 

  const el = sceneEl.value;
  const w = el.clientWidth;
  const h = el.clientHeight;

  if (!w || !h) return;

  render = Render.create({
    element: el,
    engine,
    options: {
      width: w,
      height: h,
      wireframes: false,
      background: "transparent", 
      pixelRatio: window.devicePixelRatio || 1,
    },
  });

  // Glow Effect for Top 2 Active Items (Blinking)
  Events.on(render, 'beforeRender', () => {
    const ctx = render.context;
    
    // Identify top 2 indices AMONG ACTIVE BALLS
    const activeItems = [];
    for (const idx of ballByIndex.keys()) {
        activeItems.push({ idx, val: props.Scale[idx] });
    }
    
    // Sort descending by scale
    activeItems.sort((a, b) => b.val - a.val);
    
    // Top 2 indices
    const top2Ids = activeItems.slice(0, 2).map(item => item.idx);
    
    // Blink/Pulse Factor calculation
    const time = performance.now();
    // Oscillation between 0.3 and 0.8
    const alphaBase = 0.3;
    const alphaVar = 0.5 * (Math.sin(time * 0.005) * 0.5 + 0.5);
    const currentAlpha = alphaBase + alphaVar;

    ctx.save();
    
    for (const [idx, body] of ballByIndex) {
      if (top2Ids.includes(idx)) {
        const color = plantData[idx].themeColor;
        
        ctx.beginPath();
        const r = body.circleRadius + 15; // Glow radius padding
        ctx.arc(body.position.x, body.position.y, r, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        
        // Apply blinking alpha
        ctx.globalAlpha = currentAlpha;
        
        ctx.shadowColor = color;
        ctx.shadowBlur = 40 + 20 * (Math.sin(time * 0.005) * 0.5 + 0.5); // Also pulse blur size
        ctx.fill();
        
        // Inner ring for emphasis (also pulse slightly)
        ctx.globalAlpha = Math.min(1.0, currentAlpha + 0.2); 
        ctx.shadowBlur = 10;
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.stroke();
      }
    }
    
    ctx.restore();
  });

  // Circular Walls
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) / 2;
  const wallCount = 32;
  const wallThickness = 50;
  
  walls = [];
  for (let i = 0; i < wallCount; i++) {
    const angle = (i / wallCount) * Math.PI * 2;
    const dist = radius + wallThickness / 2; 
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;
    const segmentWidth = (2 * Math.PI * radius) / wallCount * 1.1; 
    
    const wall = Bodies.rectangle(x, y, wallThickness, segmentWidth, {
      isStatic: true,
      angle: angle + Math.PI / 2, 
      render: { visible: false }
    });
    walls.push(wall);
  }
  World.add(engine.world, walls);

  // Mouse
  const mouse = Mouse.create(render.canvas);
  mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: { stiffness: 0.05, render: { visible: false } },
  });
  World.add(engine.world, mouseConstraint);
  render.mouse = mouse;

  // Center Gravity
  Events.on(engine, "beforeUpdate", () => {
    for (const ball of ballByIndex.values()) {
      const dx = cx - ball.position.x;
      const dy = cy - ball.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 5) {
        const forceMagnitude = 0.0003 * ball.mass;
        Body.applyForce(ball, ball.position, {
          x: (dx / dist) * forceMagnitude,
          y: (dy / dist) * forceMagnitude,
        });
      }

      const r = ball.circleRadius;
      const maxDist = radius - r; 
      
      if (dist > maxDist) {
        const angleFromCenter = Math.atan2(ball.position.y - cy, ball.position.x - cx);
        const newX = cx + Math.cos(angleFromCenter) * maxDist;
        const newY = cy + Math.sin(angleFromCenter) * maxDist;
        Body.setPosition(ball, { x: newX, y: newY });
        const normalX = Math.cos(angleFromCenter);
        const normalY = Math.sin(angleFromCenter);
        const dot = ball.velocity.x * normalX + ball.velocity.y * normalY;
        Body.setVelocity(ball, {
            x: (ball.velocity.x - 2 * dot * normalX) * 0.5,
            y: (ball.velocity.y - 2 * dot * normalY) * 0.5
        });
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
  if (render?.canvas?.parentNode) render.canvas.parentNode.removeChild(render.canvas);
  engine = render = runner = null;
  walls = [];
  mouseConstraint = null;
  ballByIndex.clear();
  toggles.value = Array.from({ length: MAX_BALLS }, () => false);
  ballCount.value = 0;
}

function updateBallCount() {
  ballCount.value = ballByIndex.size;
}

function findNonOverlappingPosition(newR) {
  const w = sceneEl.value.clientWidth;
  const h = sceneEl.value.clientHeight;
  const cx = w / 2;
  const cy = h / 2;
  const containerRadius = Math.min(w, h) / 2;
  const existingBodies = Array.from(ballByIndex.values());

  for (let k = 0; k < 120; k++) {
    const maxR = Math.max(0, containerRadius - newR - 10);
    const a = Math.random() * 2 * Math.PI;
    const r = Math.sqrt(Math.random()) * maxR;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);

    let ok = true;
    for (const b of existingBodies) {
      if (!b) continue;
      const rb = b.circleRadius || newR;
      const dist2 = (x - b.position.x)**2 + (y - b.position.y)**2;
      if (dist2 < (newR + rb + 8)**2) { ok = false; break; }
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
  const padding = 5;
  const collisionRadius = r + padding;

  let pos = findNonOverlappingPosition(collisionRadius);
  if (!pos) {
    const w = sceneEl.value.clientWidth;
    const h = sceneEl.value.clientHeight;
    pos = { x: w / 2 + (Math.random() - 0.5) * 50, y: h / 2 + (Math.random() - 0.5) * 50 };
  }

  const scale = (2 * r) / textureBaseSize;
  const ball = Bodies.circle(pos.x, pos.y, collisionRadius, {
    restitution: 0.5,
    friction: 0.1,
    frictionAir: 0.05,
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
  const vx = (Math.random() - 0.5) * 2;
  const vy = (Math.random() - 0.5) * 2;
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
  const next = props.Index[idx];
  if (next) {
    if (!ballByIndex.has(idx)) {
      const ball = createBallByIndex(idx);
      if (ball) ballByIndex.set(idx, ball);
    }
    toggles.value[idx] = true;
  } else {
    removeBallByIndex(idx);
    toggles.value[idx] = false;
  }
  updateBallCount();
}

onMounted(() => {
  initShader(); // Start BG Shader
  buildWorld(); // Start Physics
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeShader);
  if (rafId) cancelAnimationFrame(rafId);
  teardown();
});

watchEffect(() => {
  if (typeof props.Value === 'number' && props.Value >= 0 && props.Value < MAX_BALLS) {
     toggleBall(props.Value);
  }
});
</script>
