<template>
  <div class="absolute inset-0 z-[20] pointer-events-none overflow-hidden">
    <canvas ref="canvas" class="w-full h-full block"></canvas>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

// --- User Configuration ---
const CONFIG = {
  maxDiameter: 0.6,   // 最大圓點/十字直徑 (0.1 - 1.0)
  gridSize: 30.0,     // 數量密度 (Grid Size, 越大越多)
  density: 0.05,      // 出現機率 (0.0 - 1.0)
  driftAmount: 0.5,   // 飄動幅度 (0.0 - 0.5)
  sizeVariance: 1   // 大小差異程度 (0.0 - 1.0) -> 0:全部一樣大, 1:大小隨機變化劇烈
};
// --------------------------

const canvas = ref(null);
let gl;
let program;
let animationId;
let startTime;

const colors = [
  '#FF9696',
  '#FFCC98',
  '#F5B7FF',
  '#C8AAFF', 
  '#517ADA',
  '#01B9FF', 
  '#6FC8D7', 
  '#FFF2A6',
  
];

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r / 255, g / 255, b / 255];
}

const colorUniforms = new Float32Array(colors.flatMap(hexToRgb));

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
  uniform vec3 u_colors[8];
  
  // Custom Uniforms
  uniform float u_maxRadius;
  uniform float u_gridSize;
  uniform float u_density;
  uniform float u_driftAmount;
  uniform float u_sizeVariance;

  // Random Hash
  vec2 hash2(vec2 p) {
    p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
    return fract(sin(p)*43758.5453);
  }
  
  float hash1(vec2 p) {
    return fract(sin(dot(p,vec2(12.9898,78.233))) * 43758.5453);
  }
  
  // Rotation Matrix
  mat2 rotate2d(float angle) {
      return mat2(cos(angle), -sin(angle),
                  sin(angle),  cos(angle));
  }

  // Color Palette
  vec3 getColor(float t) {
      int idx = int(floor(t * 8.0));
      if (idx == 0) return u_colors[0];
      if (idx == 1) return u_colors[1];
      if (idx == 2) return u_colors[2];
      if (idx == 3) return u_colors[3];
      if (idx == 4) return u_colors[4];
      if (idx == 5) return u_colors[5];
      if (idx == 6) return u_colors[6];
      return u_colors[7];
  }

  void main() {
    float aspect = u_resolution.x / u_resolution.y;
    vec2 uv = gl_FragCoord.xy / u_resolution.y;
    
    float gridSize = u_gridSize; 
    vec2 st = uv * gridSize;
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    vec4 finalColor = vec4(0.0);
    
    // Neighbor loop (3x3)
    for(int y = -1; y <= 1; y++) {
        for(int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 cellID = i_st + neighbor;
            
            // Randoms
            vec2 rnd = hash2(cellID);
            float rndType = hash1(cellID + vec2(10.0));
            float rndColor = hash1(cellID + vec2(20.0));
            float rndSpeed = hash1(cellID + vec2(30.0));
            float rndAngle = hash1(cellID + vec2(40.0));
            float rndDrift = hash1(cellID + vec2(50.0));
            float rndSize = hash1(cellID + vec2(60.0));
            
            // Subtle Floating/Drift Animation
            // Randomized sine drift
            float driftSpeed = 0.5 + rndDrift * 0.5;
            vec2 drift = vec2(
                sin(u_time * driftSpeed + rnd.x * 6.28), 
                cos(u_time * driftSpeed * 0.8 + rnd.y * 6.28)
            ) * u_driftAmount; 
            
            // Jitter position + Drift
            vec2 center = neighbor + rnd * 0.6 + drift; 
            
            // Animation
            float loopDur = 2.0 + rndSpeed * 4.0;
            float timeOffset = rnd.x * 10.0;
            float t = (u_time + timeOffset) / loopDur;
            float life = fract(t);
            
            // Scale Animation
            float scale = smoothstep(0.0, 0.2, life) * (1.0 - smoothstep(0.8, 1.0, life));
            
            // Random visibility mask based on user Density
            if (rnd.y > u_density) scale = 0.0; 
            
            // --- Size Variance ---
            // randomFactor = 1.0 (max size) down to (1.0 - u_sizeVariance)
            // e.g., if variance is 0.8, size can be between 0.2*max and 1.0*max
            // We clamp multiplier to min 0.1 to avoid invisible dots
            float varianceMultiplier = 1.0 - (u_sizeVariance * rndSize * 0.9); 
            float currentMaxRadius = u_maxRadius * varianceMultiplier;
            
            // Calculate shape
            vec2 localUV = f_st - center;
            
            // Base size based on animation and variance
            float size = currentMaxRadius * scale; 
            float thickness = size * 0.1;
            
            float alpha = 0.0;
            
            // Apply Random Rotation to BOTH shapes (Sparkle & Cross)
            float angle = rndAngle * 6.28; 
            vec2 rotatedUV = rotate2d(angle) * localUV;
            
            // 30% Sparkles, 70% Crosses
            if (rndType > 0.70) {
               // Sparkle / Diamond Star
               // Use rotatedUV
               vec2 aUV = abs(rotatedUV);
               float starDist = pow(aUV.x, 0.6) + pow(aUV.y, 0.6);
               
               // Using power curve as distance approximation
               float trigger = pow(size, 0.6); 
               alpha = 1.0 - smoothstep(trigger, trigger + 0.05, starDist);
               
            } else {
               // Cross
               // Use rotatedUV
               vec2 p = abs(rotatedUV);
               vec2 b1 = vec2(size, thickness);
               vec2 d1v = abs(rotatedUV) - b1;
               float d1 = length(max(d1v,0.0)) + min(max(d1v.x,d1v.y),0.0);
               
               vec2 b2 = vec2(thickness, size);
               vec2 d2v = abs(rotatedUV) - b2;
               float d2 = length(max(d2v,0.0)) + min(max(d2v.x,d2v.y),0.0);
               
               float d = min(d1, d2);
               alpha = 1.0 - smoothstep(0.0, 0.01, d);
            }
            
            vec3 col = getColor(rndColor);
            vec4 src = vec4(col, alpha);
            
            if (src.a > finalColor.a) {
                finalColor = src;
            }
        }
    }
    
    gl_FragColor = finalColor;
  }
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function resizeCanvas() {
  if (!canvas.value) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.value.getBoundingClientRect();
  canvas.value.width = rect.width * dpr;
  canvas.value.height = rect.height * dpr;
  gl.viewport(0, 0, canvas.value.width, canvas.value.height);
}

function render(time) {
  if (!gl || !program) return;
  
  const t = (time - startTime) * 0.001;
  
  gl.useProgram(program);
  
  const uResolution = gl.getUniformLocation(program, "u_resolution");
  const uTime = gl.getUniformLocation(program, "u_time");
  const uColors = gl.getUniformLocation(program, "u_colors");
  const uMaxRadius = gl.getUniformLocation(program, "u_maxRadius");
  const uGridSize = gl.getUniformLocation(program, "u_gridSize");
  const uDensity = gl.getUniformLocation(program, "u_density");
  const uDriftAmount = gl.getUniformLocation(program, "u_driftAmount");
  const uSizeVariance = gl.getUniformLocation(program, "u_sizeVariance");
  
  gl.uniform2f(uResolution, canvas.value.width, canvas.value.height);
  gl.uniform1f(uTime, t);
  gl.uniform3fv(uColors, colorUniforms);
  
  // Pass config uniforms
  gl.uniform1f(uMaxRadius, CONFIG.maxDiameter / 2.0);
  gl.uniform1f(uGridSize, CONFIG.gridSize);
  gl.uniform1f(uDensity, CONFIG.density);
  gl.uniform1f(uDriftAmount, CONFIG.driftAmount);
  gl.uniform1f(uSizeVariance, CONFIG.sizeVariance);
  
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  
  animationId = requestAnimationFrame(render);
}

onMounted(() => {
  if (!canvas.value) return;
  
  gl = canvas.value.getContext("webgl", { alpha: true, antialias: true });
  if (!gl) {
    console.error("WebGL not supported");
    return;
  }
  
  const vs = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  program = createProgram(gl, vs, fs);
  
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = [
    -1, -1,
     1, -1,
    -1,  1,
     1,  1,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
  const positionAttributeLocation = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  startTime = performance.now();
  render(startTime);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas);
  cancelAnimationFrame(animationId);
  if (gl) {
    // cleanup
  }
});
</script>
