
<script setup>
import { onMounted, ref } from "vue";
import SelectPhysics from "../components/SelectPhysics.vue";

const MAX_BALLS = 8;
const ready = ref(false);
const toggles = ref(Array.from({ length: MAX_BALLS }, () => false));

onMounted(() => {
  // ✅ 沒有 Matter.js 的話，至少先把 ready 打開，按鈕才可按
  ready.value = true;
});



function toggleBall(idx) {
  if (!ready.value) return;

  const next = !toggles.value[idx];
  toggles.value[idx] = next;

  console.log("toggle", idx, next ? "ON" : "OFF");
  console.log(toggles.value);
}
</script>







<template>
  
  <h1 class="text-white text-center mb-10">This is an Generative Page</h1>
  <SelectPhysics/>


  <!-- 8 個 Toggle -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-10">
        <button
          v-for="i in MAX_BALLS"
          :key="i"
          type="button"
          @click="toggleBall(i - 1)"
          :disabled="!ready"
          class="relative flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition
                 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="toggles[i-1]
            ? 'bg-white text-black border-white/50'
            : 'bg-black text-white border-white/20 hover:border-white/40'"
        >
          <span class="font-medium ">Toggle {{ i }}</span>

          <!-- 右側小指示燈 -->
          <span
            class="ml-3 inline-flex items-center gap-2"
          >
            <span
              class="h-2.5 w-2.5 rounded-full"
              :class="toggles[i-1] ? 'bg-emerald-400' : 'bg-white/30'"
            />
            <span class="text-xs opacity-80">{{ toggles[i-1] ? 'ON' : 'OFF' }}</span>
          </span>
        </button>
      </div>


      <div class="mt-40"></div>
      <div class="mt-40"></div>
      <div class="mt-40"></div>
      <div class="mt-40"></div>
      <div class="mt-40"></div>
      <div class="mt-40"></div>
      <div class="mt-40"></div>
  
</template>




<style>
  
</style>
