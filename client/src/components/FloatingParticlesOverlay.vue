<template>
  <canvas 
    ref="canvas" 
    class="fixed inset-0 w-full h-full pointer-events-none floating-particles-overlay"
  ></canvas>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useGenStore } from "@/stores/Gen";

const genStore = useGenStore();

/* --- 參數設定 (Configuration) --- */
const CONFIG = {
  // 增加大小以確保可見
  baseSize: 0.1,     // 粒子核心大小
  glowSize: 0.15,    // 光暈範圍 (Bokeh效果)
  speed: -0.02,       // 向上移動速度
  color: [0.5,0.5,0.5], // 純白光點，最容易看見
  density: 0.6,      // 密度 (越高越密)
  wobbleSpeed: 0.6,
  wobbleAmount: 0.08
};



const canvas = ref(null);
let gl = null;
let program = null;
let animationFrameId = null;
let startTime = 0;

const vertexShaderSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColor;
  uniform float uSpeed;
  uniform float uBaseSize;
  uniform float uGlowSize;
  uniform float uWobbleSpeed;
  uniform float uWobbleAmount;
  uniform float uDensity;

  // Pseudo-random noise
  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float getLayer(vec2 uv, float layerIdx) {
    // Parallax speed
    float layerSpeed = uSpeed * (0.6 + layerIdx * 0.3); 
    
    // Movement
    vec2 pUV = uv;
    pUV.y += uTime * layerSpeed;
    
    // Wobble X
    pUV.x += sin(uTime * uWobbleSpeed + layerIdx * 10.0 + uv.y * 2.0) * uWobbleAmount;
    
    // Grid Scale (Density)
    // Decreased scale number to make cells bigger -> fewer but easier to find particles if density low
    // Or increased scale -> smaller cells -> more particles
    float scale = (8.0 + layerIdx * 5.0) * uDensity; 
    
    vec2 gridUV = pUV * scale;
    vec2 id = floor(gridUV);
    vec2 st = fract(gridUV) - 0.5;
    
    // Random offset
    float n = hash21(id);
    
    // Life/Twinkle
    float life = sin(uTime * 2.0 + n * 10.0) * 0.5 + 0.5;
    
    // Spawn chance
    if (n < 0.5) return 0.0; // 50% chance per cell
    
    vec2 pos = vec2(sin(n*123.0), cos(n*324.0)) * 0.3;
    float dist = length(st - pos);
    
    // Size & Glow
    // Use blurrier falloff for Bokeh
    // smoothstep(radius, radius-blur, dist)
    
    float radius = uBaseSize * 0.3 * (0.5 + 0.5 * n); // Random radius
    float glowRadius = uGlowSize; 
    
    // Core
    float core = smoothstep(radius, radius - 0.01, dist);
    
    // Glow/Bokeh halo
    float glow = smoothstep(glowRadius, 0.0, dist) * 0.5;
    
    return (core + glow) * life;
  }

  void main() {
    // Aspect corrected UV
    vec2 uv = gl_FragCoord.xy / uResolution.y;
    uv.x -= (uResolution.x / uResolution.y) * 0.5; // Center X
    
    float m = 0.0;
    
    // 3 Layers
    m += getLayer(uv, 0.0);       // Back
    m += getLayer(uv + 5.2, 1.0); // Mid
    m += getLayer(uv - 3.4, 2.0); // Front
    
    // Tone mapping to prevent burnout
    vec3 col = uColor * m;
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

const initWebGL = () => {
  gl = canvas.value.getContext('webgl', { alpha: true });
  if (!gl) return;

  const vs = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  program = createProgram(gl, vs, fs);
  gl.useProgram(program);

  // Buffer
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );

  const positionAttributeLocation = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  resize();
  window.addEventListener('resize', resize);
  startTime = performance.now();
  render(performance.now());
};

const createShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

const createProgram = (gl, vs, fs) => {
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
};

const resize = () => {
  if (!canvas.value || !gl) return;
  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
};

const props = defineProps({
  themeColor: {
    type: String,
    default: null
  }
});

const currentColor = ref([...CONFIG.color]);
const targetColor = ref([...CONFIG.color]);

function hexToRgbNormalized(hex) {
  if (!hex) return null;
  const h = hex.replace(/^#/, '');
  const bigint = parseInt(h, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;
  return [r, g, b];
}

watch([() => genStore.isTriggerActive, () => props.themeColor], ([active, color]) => {
  if (active) {
    targetColor.value = [0.25, 0.25, 0.25]; // Dimmer
  } else if (color) {
    const rgb = hexToRgbNormalized(color);
    if (rgb) targetColor.value = rgb;
    else targetColor.value = [0.5, 0.5, 0.5];
  } else {
    targetColor.value = [0.5, 0.5, 0.5]; // Default
  }
}, { immediate: true });


function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

const render = (time) => {
  if (!gl || !program) return;
  const elapsedTime = (time - startTime) * 0.001;

  // Smoothly interpolate color
  currentColor.value[0] = lerp(currentColor.value[0], targetColor.value[0], 0.05);
  currentColor.value[1] = lerp(currentColor.value[1], targetColor.value[1], 0.05);
  currentColor.value[2] = lerp(currentColor.value[2], targetColor.value[2], 0.05);

  gl.uniform1f(gl.getUniformLocation(program, "uTime"), elapsedTime);
  gl.uniform2f(gl.getUniformLocation(program, "uResolution"), canvas.value.width, canvas.value.height);
  
  gl.uniform3f(gl.getUniformLocation(program, "uColor"), currentColor.value[0], currentColor.value[1], currentColor.value[2]);
  gl.uniform1f(gl.getUniformLocation(program, "uSpeed"), CONFIG.speed);
  gl.uniform1f(gl.getUniformLocation(program, "uBaseSize"), CONFIG.baseSize);
  gl.uniform1f(gl.getUniformLocation(program, "uGlowSize"), CONFIG.glowSize);
  gl.uniform1f(gl.getUniformLocation(program, "uWobbleSpeed"), CONFIG.wobbleSpeed);
  gl.uniform1f(gl.getUniformLocation(program, "uWobbleAmount"), CONFIG.wobbleAmount);
  gl.uniform1f(gl.getUniformLocation(program, "uDensity"), CONFIG.density);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
  animationFrameId = requestAnimationFrame(render);
};

onMounted(() => {
  initWebGL();
});

onBeforeUnmount(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', resize);
});
</script>

<style scoped>
.floating-particles-overlay {
  /* Using screen to make it glow on dark backgrounds */
  mix-blend-mode: screen; 
  z-index: 10; /* Ensure on top of background */
  opacity: 1.0; 
}
</style>
