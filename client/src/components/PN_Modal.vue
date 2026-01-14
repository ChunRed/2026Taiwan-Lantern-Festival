<template>
  <Transition
    enter-active-class="ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isVisible" class="absolute inset-0 z-50 flex items-center justify-center bg-[rgb(0,0,0,0.6)] backdrop-blur-[3px]">
    

      <div class="flex flex-col w-full h-full  py-6 text-white font-sans">

        <!-- Header -->
        <header class="flex justify-between items-center w-full px-6 mb-2 z-50 relative ">
          <motion.div
              :initial="{ opacity: 0, y: 20 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 1, delay: 0.2 }"
              class="flex flex-col items-start"
            >

            <div class="text-3xl font-light tracking-widest ">
              <div v-if="state == 0">
                <h1 class="text-2xl font-bold tracking-[0.3em] mb-1">光點為中鹿的位置</h1>
                <p class="text-[15px] text-gray-300 font-light tracking-[0.5em]">接近中鹿收集不同的元素</p>
              </div>
              <div v-else-if="state == 1">
                <h1 class="text-2xl font-bold tracking-[0.3em] mb-1">獲得新元素開啟圖鑑</h1>
                <p class="text-[15px] text-gray-300 font-light tracking-[0.2em]">每種元素分別對應不動的鹿以及植物</p>
              </div>
              <div v-else-if="state == 2">
                <h1 class="text-2xl font-bold tracking-[0.3em] mb-1">獲得新元素開啟圖鑑</h1>
                <p class="text-[15px] text-gray-300 font-light tracking-[0.2em]">每種元素分別對應不動的鹿以及植物</p>
              </div>
              <div v-else-if="state == 3">
                <h1 class="text-2xl font-bold tracking-[0.3em] mb-1">獲得新元素開啟圖鑑</h1>
                <p class="text-[15px] text-gray-300 font-light tracking-[0.2em]">每種元素分別對應不動的鹿以及植物</p>
              </div>
              
            </div>

          </motion.div>
        </header>

        <!-- Divider -->
        <div class="w-[110%] -ml-5 h-px bg-white/50 mb-4 mt-1 z-20"></div>
        






        <div class="relative  flex justify-center bottom-10">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-[#ffffff] bg-black/60"
            @click="closeModal()">
            <span class="text-3xl leading-none text-[#ffffff]">
              ›
            </span>
          </button>
        </div>

      </div>
    </div>
  </Transition>
</template>



<script setup>
import { ref, onMounted } from 'vue'
import { motion } from "motion-v"
import { RouterLink, RouterView, useRoute } from "vue-router";
import IconStroll from "../components/IconStroll.vue"

const isVisible = ref(false)

const state = ref(0)

const closeModal = () => {
  if (state.value < 3 ){
    state.value ++;
    console.log(state.value);
    
  }
  else {
    isVisible.value = false;
  }
}


onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 6000)
})


</script>
