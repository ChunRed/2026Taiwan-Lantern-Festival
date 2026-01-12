
<script setup>
import { onMounted, ref } from "vue";
import SelectPhysics from "../components/Gen_select.vue";
import plantData from '@/data/plantData.json';

const textColor = ref("#888888");


const MAX_BALLS = 8;
const ready = ref(false);
const toggles = ref(Array.from({ length: MAX_BALLS }, () => false));

let clickValue = 0;

onMounted(() => {
  // ✅ 沒有 Matter.js 的話，至少先把 ready 打開，按鈕才可按
  ready.value = true;
});



function toggleBall(idx) {
  if (!ready.value) return;

  const next = !toggles.value[idx];
  toggles.value[idx] = next;

  //console.log("toggle", idx, next ? "ON" : "OFF");
  //console.log(toggles);
  clickValue = idx;
}


const getImageUrl = (name) => {
  return new URL(`../assets/${name}`, import.meta.url).href;
};


</script>







<template>
  <div class="flex flex-col h-screen overflow-hidden bg-black">
    <!-- 固定在上方的 SelectPhysics 區塊 -->
    <div class="flex-none z-10 bg-black pt-2 px-4 pb-2 border-b border-white/10">
      <SelectPhysics
        :Index = toggles
        :Value = clickValue
      />
    </div>



    <!-- 可捲動的按鈕列表區塊 -->
    <div class="flex-1 overflow-y-auto px-6 py-6">
      <div class="flex flex-col gap-3">
        <button
          v-for="i in MAX_BALLS"
          :key="i"
          type="button"
          @click="toggleBall(i - 1)"
          :disabled="!ready"
          class="relative flex items-center justify-between px-4 py-3 rounded-lg border text-base transition
                 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="toggles[i-1]
            ? ' border-white/80'
            : 'bg-black text-white border-white/10 hover:border-white/40'"
        >
      
          <div class="flex items-start gap-2">
            <img :src="getImageUrl(plantData[i-1].image)" alt="" class="w-10 h-10 " >
            
            <div class="px-3 flex flex-col text-left">
              <span class="font-medium text-[16px] tracking-[1.2em]" :style="{ color: plantData[i-1].themeColor }">{{ plantData[i-1].nameZh }} </span>
            <span class="font-medium text-[11px] tracking-[0.1em]" :style="{ color: plantData[i-1].themeColor }">{{ plantData[i-1].nameEn }}</span>
            </div>
            
          </div>
          



          <!-- 右側小指示燈 -->
          <span
            class="ml-3 inline-flex items-center gap-2"
          >
            <span
              class="h-2.5 w-2.5 rounded-full shadow-sm"
              :style="{ backgroundColor: toggles[i-1] ? plantData[i-1].themeColor : '#333333' }"
            ></span>
            <span class="text-xs opacity-80 font-mono">{{ toggles[i-1] ? '刪除' : '選擇' }}</span>
          </span>
        </button>
      </div>
      
      <!-- 底部預留空間，確保最後一個按鈕不貼底 -->
      <div class="h-20"></div>
    </div>

    
  </div>


</template>




<style>
  
</style>
