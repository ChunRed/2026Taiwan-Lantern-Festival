<template>
  <canvas ref="canvasRef" class="floating-canvas absolute inset-0 w-full h-full pointer-events-none z-[-1]"></canvas>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  config: {
    type: Object,
    default: () => ({
      density: 12,          // 密度(元素出現的數量)
      minSize: 80,          // 大小最小值 (px)
      maxSize: 200,         // 大小最大值 (px)
      speedX: 0.5,          // 左右飄動速度
      speedY: 1.0,          // 向上飄動速度 (正數往上)
      rotSpeed: 0.02,       // 旋轉動態的速度
      opacity: 0.4          // 透明度
    })
  }
});

const canvasRef = ref(null);
let ctx;
let animationId;
let particles = [];
let loadedImages = [];
let resizeObserver = null;
let lastHeight = 0;

const initParticles = () => {
  particles = [];
  if (loadedImages.length === 0 || !canvasRef.value) return;
  
  const { density, minSize, maxSize, speedX, speedY, rotSpeed } = props.config;
  
  // 取得父層實際可用大小
  const rect = canvasRef.value.parentElement.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  for (let i = 0; i < density; i++) {
    particles.push({
      img: loadedImages[i % loadedImages.length],
      // 隨機分佈在畫面上
      x: Math.random() * width,
      y: Math.random() * height,
      size: minSize + Math.random() * (maxSize - minSize),
      vx: (Math.random() - 0.5) * speedX, 
      vy: -(Math.random() * 0.5 + 0.5) * speedY, // 確保大致都往上飄
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * rotSpeed
    });
  }
};

const loadImages = async () => {
  loadedImages = [];
  const promises = props.images.map(src => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  });
  
  const results = await Promise.all(promises);
  loadedImages = results.filter(img => img !== null);
  initParticles();
};

// 聽變數變更並重新初始化
watch(() => props.images, loadImages, { deep: true });
watch(() => props.config, initParticles, { deep: true });

const render = () => {
  if (!canvasRef.value || !ctx) return;
  
  const rect = canvasRef.value.parentElement.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  ctx.clearRect(0, 0, width, height);

  particles.forEach(p => {
    // 位置更新
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vrot;

    // 邊界無限循環無縫接軌 (如果超出畫面就放到另一邊)
    if (p.x < -p.size) p.x = width + p.size;
    if (p.x > width + p.size) p.x = -p.size;
    if (p.y < -p.size) p.y = height + p.size;
    if (p.y > height + p.size) p.y = -p.size;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = props.config.opacity || 0.4;
    ctx.drawImage(p.img, -p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();
  });

  animationId = requestAnimationFrame(render);
};

const setupCanvas = () => {
  if (!canvasRef.value) return;
  const canvas = canvasRef.value;
  ctx = canvas.getContext('2d');
  
  if (resizeObserver) resizeObserver.disconnect();
  
  resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
      const rect = entry.contentRect;
      const dpr = window.devicePixelRatio || 1;
      // 取出真實的解析度並進行 Canvas 大小縮放
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // 當圖片載入撐開高度後，重新打散粒子的分佈，避免初始擠在同一個地方
      if (lastHeight < 50 && rect.height >= 50) {
        initParticles();
      }
      lastHeight = rect.height;
    }
  });
  
  if (canvas.parentElement) {
    resizeObserver.observe(canvas.parentElement);
  }
};

onMounted(() => {
  setupCanvas();
  loadImages();
  render();
});

onBeforeUnmount(() => {
  if (animationId) cancelAnimationFrame(animationId);
  if (resizeObserver) resizeObserver.disconnect();
});
</script>
