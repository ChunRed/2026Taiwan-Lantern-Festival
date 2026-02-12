<template>
  <div 
    ref="container"
    class="fluid-glass-container pointer-events-none absolute inset-0 z-[1] overflow-hidden"
    :style="containerStyle"
  >
    <div class="glass-effect w-full h-full absolute inset-0"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

// --- 參數設定 (Configuration) ---
// 你可以在這裡調整效果
const CONFIG = {
  count: 3,           // 疏密程度 (Density): 數量越多越密 (建議 3-8)
  blur: '7px',        // 模糊強度 (Blur Strength): 數字越大越模糊
  speed: 2,         // 流動速度 (Speed): 數字越大動越快 (建議 0.1 - 1.0)
  sizeMin: 70,        // 最小圓圈大小 (%)
  sizeVar: 40         // 圓圈大小變化範圍 (%)
};

const container = ref(null);
const blobs = [];
let animationFrame;

// Initialize blob data
for (let i = 0; i < CONFIG.count; i++) {
  blobs.push({
    x: Math.random() * 100,
    y: Math.random() * 100,
    vx: (Math.random() - 0.5) * CONFIG.speed,
    vy: (Math.random() - 0.5) * CONFIG.speed,
    size: CONFIG.sizeMin + Math.random() * CONFIG.sizeVar,
    opacity: 0.5 + Math.random() * 0.5
  });
}

const update = () => {
  if (!container.value) return;

  blobs.forEach((blob, i) => {
    // Update position
    blob.x += blob.vx;
    blob.y += blob.vy;

    // Bounce off edges
    if (blob.x <= -20 || blob.x >= 120) blob.vx *= -1;
    if (blob.y <= -20 || blob.y >= 120) blob.vy *= -1;

    // Randomize movement slightly for fluid feel
    if (Math.random() < 0.05) {
      blob.vx += (Math.random() - 0.5) * 0.1;
      blob.vy += (Math.random() - 0.5) * 0.1;
    }

    // Clamp speed to config limit
    const currentMaxSpeed = CONFIG.speed * 2; // Allow some fluctuation
    blob.vx = Math.max(-currentMaxSpeed, Math.min(currentMaxSpeed, blob.vx));
    blob.vy = Math.max(-currentMaxSpeed, Math.min(currentMaxSpeed, blob.vy));

    // Update CSS variables
    container.value.style.setProperty(`--x${i}`, `${blob.x.toFixed(2)}%`);
    container.value.style.setProperty(`--y${i}`, `${blob.y.toFixed(2)}%`);
    container.value.style.setProperty(`--s${i}`, `${blob.size.toFixed(2)}%`);
  });

  animationFrame = requestAnimationFrame(update);
};

onMounted(() => {
  update();
});

onUnmounted(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
});

const containerStyle = computed(() => {
  const gradients = blobs.map((_, i) => 
    `radial-gradient(ellipse var(--s${i}) var(--s${i}) at var(--x${i}) var(--y${i}), black 0%, transparent 80%)`
  ).join(', ');

  return {
    '--blur-amt': CONFIG.blur,
    'maskImage': gradients,
    'WebkitMaskImage': gradients,
    'maskComposite': 'add', 
    'WebkitMaskComposite': 'source-over',
    'backdropFilter': 'blur(var(--blur-amt))',
    'WebkitBackdropFilter': 'blur(var(--blur-amt))'
  };
});
</script>

<style scoped>
.glass-effect {
  mix-blend-mode: normal; 
}
</style>
