
<script setup >

import plantData from '@/data/plantData.json';
const MAX_BALLS = 8;



const getImageUrl = (name) => {
  return new URL(`../assets/${name}`, import.meta.url).href;
};

</script>





<template>
    <!-- 可捲動的按鈕列表區塊 -->
    <div class="flex-1 overflow-y-auto px-6 py-6">
      <div class="flex flex-col gap-3">
        <div
            v-for="i in MAX_BALLS"
            :key="i"
            class="relative flex items-center justify-between px-4 py-3 rounded-lg border text-base transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
        
          <div class="flex items-start gap-2">
            <img :src="getImageUrl(plantData[i-1].image)" alt="" class="w-10 h-10 " >
            
            <div class="px-3 flex flex-col text-left">
              <span class="font-medium text-[16px] tracking-[1.2em]" :style="{ color: plantData[i-1].themeColor }">{{ plantData[i-1].nameZh }} </span>
            <span class="font-medium text-[11px] tracking-[0.1em]" :style="{ color: plantData[i-1].themeColor }">{{ plantData[i-1].nameEn }}</span>
            </div>
            
          </div>
        </div>
      </div>
      
      <!-- 底部預留空間，確保最後一個按鈕不貼底 -->
      <div class="h-20"></div>
    </div>
</template>