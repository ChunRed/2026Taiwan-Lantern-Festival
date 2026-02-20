<template>
  <div class="flex flex-col relative w-full h-full">
    <LoadingPage v-if="isLoading" />
    <CrossOverlay />
    <ExplosionEffect 
      v-if="showExplosion" 
      :colors="explosionColors" 
      :particleCount="explosionConfig.particleCount"
      :minSize="explosionConfig.minSize"
      :maxSize="explosionConfig.maxSize"
      :minForce="explosionConfig.minForce"
      :maxForce="explosionConfig.maxForce"
      :duration="explosionConfig.duration"
    />
    <div
      class="absolute top-0 left-0 z-0 w-full h-[500px] overflow-hidden bg-[#000000]"
    >
      
    </div>

    <div class="relative z-10 top-[0px] w-full">
      <div v-if="genStore.gen.length > 0">
        <!-- Add Image Here -->
        <div class="flex justify-center relative w-full h-auto overflow-hidden">
            <!-- 第二層：剩下的元素飄浮 (放置於最下層) -->
            <FloatingIconsCanvas :images="floatingImagesRest" :config="floatingConfigRest" />
            
            <!-- Background Floating Icons (Canvas) -->
            <FloatingIconsCanvas :images="floatingImages" :config="floatingConfig" />

            <!-- === 圖片與背景飄浮元素之間的黑色遮罩 === -->
            <div 
              class="absolute inset-0 bg-black z-0 pointer-events-none mask-pulse"
              :style="{ 
                '--mask-min': maskMinOpacity, 
                '--mask-max': maskMaxOpacity,
                'animation-duration': `${maskDuration}s` 
              }"
            ></div>

            <img src="../assets/Gen_Image/Gen_test1.png" alt="Example Image" class="w-full h-auto relative z-10" />
        </div>

        <!-- 漸層 -->
        <div
          class="relative -top-24 left-0 z-10 w-full h-24"
          :style="{ background: `linear-gradient(to top, ${maxThemeColor}, transparent)` }"
        ></div>


        <div class="relative -top-12 text-white mt-3 text-[24px] font-bold text-center">
          你獲得了一隻ＯＯＯ鹿!
        </div>
        <Gen_Information
          :Gen="genStore.gen"
          :Rate="genStore.SelectedItemRate"
        
        />
      </div>

      <div v-else>
        <div class="text-white mt-3 text-[18px] font-bold text-center mb-3">
          你還沒有選擇任何元素，請選擇元素!
        </div>
        <!-- Button -->
        <div class="flex justify-center">
          <RouterLink
            to="/gen-choose"
            class="flex h-12 w-12 items-center justify-center rounded-full border border-[#ffffff] bg-black/60"
          >
            <span class="text-3xl leading-none text-[#ffffff]"> › </span>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Gen_Information from "../components/Gen_Information.vue";
import ExplosionEffect from "../components/ExplosionEffect.vue";
import CrossOverlay from "../components/CrossOverlay.vue";
import LoadingPage from "../components/LoadingPage.vue";
import FloatingIconsCanvas from "../components/FloatingIconsCanvas.vue";
import { useGenStore } from "../stores/Gen.js";
import { ref, onMounted, computed } from "vue";
import plantData from "@/data/plantData.json";

const genStore = useGenStore();
const isLoading = ref(true);
const showExplosion = ref(false);

const maxThemeColor = computed(() => {
  const scales = genStore.ItemScale;
  const selectedGens = genStore.gen;
  let maxScale = -1;
  let maxIdx = -1;
  
  for (let i = 0; i < selectedGens.length; i++) {
    const plantIdx = selectedGens[i];
    if (scales[plantIdx] > maxScale) {
      maxScale = scales[plantIdx];
      maxIdx = plantIdx;
    }
  }

  if (maxIdx !== -1 && plantData[maxIdx]) {
    return plantData[maxIdx].themeColor;
  }
  return '#517ADA'; // fallback default color
});

// === 這裡可以調整圖片與背景元素之間的黑色遮罩透明度「動態參數」 ===
const maskMinOpacity = ref(0.0); // 最小透明度 (最亮)
const maskMaxOpacity = ref(0.8); // 最大透明度 (最暗)
const maskDuration = ref(10);     // 動態變化週期 (幾秒完成一次呼吸燈循環)

// === 隨便調整以下參數就可以設定元素的漂浮動態！ ===
const floatingConfig = ref({
  density: 20,           // 元素出現的數量 (太滿可調小)
  minSize: 20,         // 大小最小值 (px)
  maxSize: 120,         // 大小最大值 (px)
  speedX: 0.8,          // 左右飄動速度
  speedY: 0.3,          // 向上飄動速度
  rotSpeed: 0.02,       // 旋轉速度
  opacity: 1          // 透明度 (0.0 ~ 1.0)
});

// === 第二層 (剩下的元素) 參數調整 ===
const floatingConfigRest = ref({
  density: 30,          // 剩下的元素數量
  minSize: 5,          // 剩下的元素 大小最小值 (px)
  maxSize: 20,          // 剩下的元素 大小最大值 (px)
  speedX: 0.5,          // 剩下的元素 左右飄動速度
  speedY: 0.6,          // 剩下的元素 向上飄動速度
  rotSpeed: 0.03,       // 剩下的元素 旋轉速度
  opacity: 0.3          // 剩下的元素 透明度 (0.0 ~ 1.0)
});

const floatingImages = computed(() => {
  const selectedIndices = [...genStore.gen];
  // 依據分數大小反向排序
  selectedIndices.sort((a, b) => genStore.ItemScale[b] - genStore.ItemScale[a]);
  const top2 = selectedIndices.slice(0, 2);

  return top2.map(idx => {
    return new URL(`../assets/${plantData[idx].nameZh}.png`, import.meta.url).href;
  });
});

const floatingImagesRest = computed(() => {
  const selectedIndices = [...genStore.gen];
  // 依據分數大小反向排序
  selectedIndices.sort((a, b) => genStore.ItemScale[b] - genStore.ItemScale[a]);
  
  // 抓取第 3 個之後的所有剩餘項目 (若沒超過 2 個則回傳空陣列)
  const rest = selectedIndices.slice(2);

  return rest.map(idx => {
    return new URL(`../assets/${plantData[idx].nameZh}W.png`, import.meta.url).href;
  });
});

// Colors for the explosion effect (easily adjustable)
const explosionColors = ['#C8AAFF', '#ffffff', '#7093FF', '#FFF2A6'] ;

// Particle Settings (Adjust here)
const explosionConfig = {
  particleCount: 100, // Quantity of particles (Density)
  minSize: 4,         // Minimum size of particles
  maxSize: 60,        // Maximum size of particles
  minForce: 3,        // Minimum explosion force (velocity)
  maxForce: 20,        // Maximum explosion force (velocity)
  duration: 15000      // Duration in milliseconds
};

onMounted(() => {
  // 2秒 loading 畫面
  setTimeout(() => {
    isLoading.value = false;
    showExplosion.value = true;
    
    // Remove the explosion effect after duration to free up resources
    setTimeout(() => {
      showExplosion.value = false;
    }, explosionConfig.duration);
  }, 2000);
});
</script>

<style scoped>
@keyframes pulseOpacity {
  0% { opacity: var(--mask-min); }
  50% { opacity: var(--mask-max); }
  100% { opacity: var(--mask-min); }
}

.mask-pulse {
  animation: pulseOpacity infinite ease-in-out;
}
</style>
