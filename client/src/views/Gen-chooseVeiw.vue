<script setup>
import { onMounted, ref, computed } from "vue";
import SelectPhysics from "../components/Gen_select.vue";
import FloatingParticlesOverlay from "../components/FloatingParticlesOverlay.vue";
import plantData from "@/data/plantData.json";
import { useGenStore } from "../stores/Gen.js";

const genStore = useGenStore();

const MAX_BALLS = 8;
const ready = ref(false);
const toggles = ref(Array.from({ length: MAX_BALLS }, () => false));

// Compute indices of top 2 selected items by scale
const topTwoIndices = computed(() => {
  // Map to objects with index, active status, and scale
  const items = toggles.value.map((isActive, idx) => ({
    idx,
    isActive,
    scale: genStore.ItemScale[idx] || 0
  }));
  
  // Filter only active (selected) items with positive scale
  const activeItems = items.filter(item => item.isActive && item.scale > 0);
  
  // Sort by scale descending
  activeItems.sort((a, b) => b.scale - a.scale);
  
  // Return just the indices of the top 2
  return activeItems.slice(0, 2).map(item => item.idx);
});

let clickValue = 0;

onMounted(() => {
  // ✅ 沒有 Matter.js 的話，至少先把 ready 打開，按鈕才可按
  ready.value = true;
});

function toggleBall(idx) {
  if (!ready.value) return;

  if (genStore.ItemScale[idx] == 0) return;

  const next = !toggles.value[idx];
  toggles.value[idx] = next;
  clickValue = idx;
  genStore.SetGen(toggles.value);
}

const getImageUrl = (name) => {
  return new URL(`../assets/item/${name}`, import.meta.url).href;
};


</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden ">
    <FloatingParticlesOverlay theme-color="#333333" />
    
    <!-- 固定在上方的 SelectPhysics 區塊 -->
    <div
      class="flex-none z-10 pt-2 px-4 pb-2 border-b border-white/10"
    >
      <SelectPhysics
        :Index="toggles"
        :Scale="genStore.ItemScale"
        :Value="clickValue"
      />
    </div>

    <!-- 可捲動的按鈕列表區塊 -->
    <div class="flex-1 overflow-y-auto px-6 py-6">
      <div class="grid grid-cols-3 gap-3">
        <button
          v-for="i in MAX_BALLS"
          :key="i"
          type="button"
          @click="toggleBall(i - 1)"
          :disabled="!ready"
          class="relative flex flex-col items-center justify-center aspect-square rounded-xl border text-base transition disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          :class="
            toggles[i - 1]
              ? ' border-[#888888]/50 bg-white/5'
              : 'bg-[#000000]/50  text-white border-white/10 hover:border-white/40'
          "
          :style="
            topTwoIndices.includes(i - 1)
              ? {
                  boxShadow: `0 0 15px ${plantData[i - 1].themeColor}`,
                  borderColor: plantData[i - 1].themeColor
                }
              : {}
          "
        >
          <!-- Selection Indicator (Dot) -->
          <span
            v-if="genStore.ItemScale[i - 1] > 0 && toggles[i - 1]"
            class="absolute top-2 right-2 h-2 w-2 rounded-full shadow-[0_0_5px_currentColor]"
            :style="{ backgroundColor: plantData[i - 1].themeColor }"
          ></span>
<!-- ... rest of template ... -->

          <!-- Known Plant -->
          <div
            v-if="genStore.ItemScale[i - 1] > 0"
            class="flex flex-col items-center gap-1 w-full px-1"
          >
            <img
              :src="getImageUrl(plantData[i - 1].image)"
              alt=""
              class="w-10 h-10 object-contain mb-1 my-2"
            />

            <div class="flex flex-col text-center w-full overflow-hidden">
              <span
                class="font-medium text-[13px] tracking-widest truncate w-full"
                :style="{ color: plantData[i - 1].themeColor }"
                >{{ plantData[i - 1].nameZh }}
              </span>
              <span
                class="font-medium text-[9px] tracking-wider opacity-60 truncate w-full"
                :style="{ color: plantData[i - 1].themeColor }"
                >{{ plantData[i - 1].nameEn }}</span
              >
            </div>
          </div>

          <!-- Unknown Element -->
          <div v-else class="flex flex-col items-center gap-1 w-full opacity-40">
            <img
              :src="getImageUrl('未知元素.png')"
              alt=""
              class="w-10 h-10 grayscale mb-1"
            />
            <div class="flex flex-col text-center">
              <span class="font-medium text-xs tracking-[0.5em] text-white/40"
                >????</span
              >
            </div>
          </div>
        </button>

        <!-- 9th Filler Item (Placeholder for grid completion) -->
        <button
          type="button"
          disabled
          class="relative flex flex-col items-center justify-center aspect-square rounded-xl border text-base transition opacity-80 cursor-not-allowed overflow-hidden bg-[#000000]/50 text-white border-white/20"
        >
          <div class="flex flex-col items-center gap-1 w-full opacity-40">
            <img
              :src="getImageUrl('未知元素.png')"
              alt=""
              class="w-10 h-10 grayscale mb-1"
            />
            <div class="flex flex-col text-center">
              <span class="font-medium text-xs tracking-[0.5em] text-white/40"
                >????</span
              >
            </div>
          </div>
        </button>
      </div>

      <!-- 底部預留空間，確保最後一個按鈕不貼底 -->
      <div class="h-20"></div>
    </div>
  </div>
</template>

<style></style>
