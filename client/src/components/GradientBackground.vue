<template>
  <canvas ref="canvas" class="fixed inset-0 w-full h-full pointer-events-none"></canvas>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  colors: {
    type: Array,
    default: () => ['#000000', '#517ADA', '#000000']
  },
  brightness: {
    type: Number,
    default: 1.0
  },
  speed: {
    type: Number,
    default: 0.5
  }
});

const canvas = ref(null);
let gl = null;
let program = null;
let animationFrameId = null;
let startTime = 0;

// Utility to convert hex to rgb array [0-1]
const hexToRgb = (hex) => {
  const bigint = parseInt(hex.replace('#', ''), 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;
  return [r, g, b];
};

const vertexShaderSource = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uBrightness;

  // Simple pseudo-random noise
  float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  // 2D Noise
  float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermite Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
  }

  void main() {
    // Slow down time
    float t = uTime * 0.2;

    // Create moving coordinates for noise
    // Reduced scale from 3.0 to 0.8 to make the color blobs larger and more uniform
    vec2 st = vUv * 1.0;
    
    // Generate noise values for mixing
    float n1 = noise(st + vec2(t * 0.5, t * 0.3));
    float n2 = noise(st + vec2(-t * 0.2, t * 0.8));
    float n3 = noise(st + vec2(t * 0.1, -t * 0.4));

    // Warping/Fluid effect
    vec2 q = vec2(0.);
    q.x = noise(st + 0.00 * t);
    q.y = noise(st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = noise(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t);
    r.y = noise(st + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t);

    float f = noise(st + r);

    // Mix colors based on noise
    // We mix between the three colors using the fluid noise value 'f'
    // and sine waves to oscillate the dominance of each color
    
    vec3 color = mix(uColor1, uColor2, smoothstep(0.0, 0.6, f));
    color = mix(color, uColor3, smoothstep(0.4, 1.0, f));

    // Add some extra soft glow/vignette if desired, but for now keep it simple fluid

    // Apply brightness
    gl_FragColor = vec4(color * uBrightness, 1.0);
  }
`;

const initWebGL = () => {
  gl = canvas.value.getContext('webgl');
  if (!gl) return;

  // Create Program
  const vs = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  program = createProgram(gl, vs, fs);
  gl.useProgram(program);

  // Buffer Setup (Full screen quad)
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1,
      1, -1,
      -1,  1,
      -1,  1,
      1, -1,
      1,  1,
    ]),
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
  if (!canvas.value) return;
  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
};

const currentRgbColors = ref([
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
]);

const lerp = (start, end, t) => {
  return start + (end - start) * t;
};

const lerpColor = (current, target, t) => {
  return [
    lerp(current[0], target[0], t),
    lerp(current[1], target[1], t),
    lerp(current[2], target[2], t)
  ];
};

const render = (time) => {
  if (!gl || !program) return;

  const elapsedTime = (time - startTime) * 0.001 * props.speed;

  gl.uniform1f(gl.getUniformLocation(program, "uTime"), elapsedTime);
  gl.uniform1f(gl.getUniformLocation(program, "uBrightness"), props.brightness);
  
  const targetC1 = hexToRgb(props.colors[0]);
  const targetC2 = hexToRgb(props.colors[1]);
  const targetC3 = hexToRgb(props.colors[2]);

  // Smoothly interpolate current colors towards target colors
  // Factor 0.02 provides a slow, smooth transition
  currentRgbColors.value[0] = lerpColor(currentRgbColors.value[0], targetC1, 0.02);
  currentRgbColors.value[1] = lerpColor(currentRgbColors.value[1], targetC2, 0.02);
  currentRgbColors.value[2] = lerpColor(currentRgbColors.value[2], targetC3, 0.02);

  gl.uniform3fv(gl.getUniformLocation(program, "uColor1"), currentRgbColors.value[0]);
  gl.uniform3fv(gl.getUniformLocation(program, "uColor2"), currentRgbColors.value[1]);
  gl.uniform3fv(gl.getUniformLocation(program, "uColor3"), currentRgbColors.value[2]);

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
