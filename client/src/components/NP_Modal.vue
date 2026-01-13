<template>
  <Transition
    enter-active-class="ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">

      <div class="relative w-full h-full max-w-md transform overflow-hidden  bg-black/40 p-6 text-left align-middle shadow-xl transition-all">
        <h3 class="text-lg font-medium leading-6 text-white text-center">
          Modal Title
        </h3>
        
        
        <div class="relative top-32 w-full max-w-[450px]">

          <motion.div
            :initial="{ opacity: 0, y: 0, scale: 1.1 }"
            :animate="{ opacity: 1, y: 0 , scale: 1}"
            :transition="{ duration: 1, delay: 0 }"
          >
            <img :src="MapImg" alt="Main Map" class="w-full h-full object-contain" />
          </motion.div>
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
import MapImg from "../assets/Map.png";

const isVisible = ref(false)

const closeModal = () => {
  isVisible.value = false
}


onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 4000)
})


</script>
