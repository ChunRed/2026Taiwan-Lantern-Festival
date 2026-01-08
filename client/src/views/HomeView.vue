<script setup>
  import MobileShell from "../components/MobileShell.vue";
  import MapImg from "../assets/Map.jpg";
  import DeerBtn from "../assets/deer_button.png";
  import { RouterLink, RouterView } from "vue-router";

  import MapPath from "../components/MapPath.vue";

  import LiffProfile from "@/components/LiffProfile.vue";
  import { motion } from "motion-v"


</script>

<template>

  <!-- <MobileShell> -->

    <div class="flex flex-col h-full px-0 py-6 text-white font-sans">
      
     

      <!-- Main Content: Map -->
      <main class="flex-1 flex justify-center items-center w-full relative overflow-hidden my-4">

        <div class="relative w-full max-w-[450px]">

          <motion.div
            :initial="{ opacity: 0, y: 0, scale: 1.1 }"
            :animate="{ opacity: 1, y: 0 , scale: 1}"
            :transition="{ duration: 5, delay: 2.8 }"
          >
            <img :src="MapImg" alt="Main Map" class="w-full h-full object-contain" />
          </motion.div>


          
        <MapPath /> 
        </div>

      </main>

      <motion.div
            :initial="{ opacity: 0, y: 0 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 5, delay: 5 }"
          >
      <!-- Footer -->
      <footer class="flex justify-between items-center w-full mt-auto pt-4">
        <div class="text-lg tracking-[0.2em] font-light text-white">地 圖 | M A P</div>
        
        <!-- Deer Button -->
        <button class="w-14 h-14 rounded-full border border-white flex justify-center items-center p-2 bg-transparent hover:bg-white/10 transition-colors">
          <img :src="DeerBtn" alt="Navigate" class="w-full h-full object-contain" />
        </button>
      </footer>




      <div class="my-5"></div>
      <div class="my-5"></div>
      <!-- Divider -->
      <div class="w-[110%] -ml-5 h-px bg-white/50 mb-4"></div>
      <div class="my-5 text-center"> 2026 @ No Side</div>
      
      </motion.div>
      <!-- <LiffProfile /> -->
      
    </div>


  <!-- </MobileShell> -->
</template>
