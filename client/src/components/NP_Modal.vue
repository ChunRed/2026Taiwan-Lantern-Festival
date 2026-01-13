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
              :transition="{ duration: 3, delay: 0.2 }"
              class="flex flex-col items-start"
            >

            <div class="text-3xl font-light tracking-widest ">
              <h1 class="text-2xl font-bold tracking-[0.3em] mb-1">逐 鹿 光 溯 源</h1>
              <p class="text-[0.6rem] text-gray-300 font-light tracking-wide">Chasing Light, Reflecting Deer in the Grass</p>
            </div>

          </motion.div>
        </header>

        <!-- Divider -->
        <div class="w-[110%] -ml-5 h-px bg-white/50 mb-4 mt-1 z-20"></div>





        
        <div class=" flex flex-col h-full px-6 py-6 text-white font-sans">
        
          <div class="flex-1 flex justify-center items-center w-full relative overflow-hidden my-4  ">

            <div class="relative w-full max-w-[450px] -top-[50px]">

              <motion.div
                :initial="{ opacity: 0, y: 0, scale: 1 }"
                :animate="{ opacity: 1, y: 0 , scale: 1}"
                :transition="{ duration: 5, delay: 0}"
              >
                <img :src="MapImg" alt="Main Map" class="w-full h-full object-contain" />
              </motion.div>
            </div>
          </div>
        </div>






        <div class="relative mt-4 flex justify-center bottom-4">
          <button
            type="button"
            class="inline-flex justify-center rounded-md border border-transparent bg-white/50 px-4 py-2 text-sm font-medium text-white  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            @click="closeModal"
          >
            返回
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>



<script setup>
import { ref, onMounted } from 'vue'
import { motion } from "motion-v"
import MapImg from "../assets/deer_points.png";
import { RouterLink, RouterView, useRoute } from "vue-router";
import IconStroll from "../components/IconStroll.vue"

const isVisible = ref(false)

const closeModal = () => {
  isVisible.value = false
}


onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 6000)
})


</script>
