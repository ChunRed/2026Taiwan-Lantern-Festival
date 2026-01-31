<script setup>
import { onMounted } from "vue";
import { motion } from "motion-v";

// We can add more complex logic here if needed,
// for now it's a visual component.
</script>

<template>
  <div
    class="absolute inset-0 z-[100] bg-black flex flex-col px-6 py-6 overflow-hidden"
  >
    <!-- Phantom Header (App.vue) -->
    <div
      class="flex justify-between items-center w-full mb-2 opacity-0 pointer-events-none"
    >
      <div class="h-10"></div>
    </div>

    <!-- Phantom Divider (App.vue) -->
    <div class="w-[110%] -ml-5 h-px mb-4 mt-5 opacity-0"></div>

    <!-- IntroView Structure Mimic -->
    <div
      class="w-full flex-1 flex flex-col items-center justify-between py-10 text-center relative"
    >
      <!-- Center Content Area -->
      <div
        class="relative w-full flex-1 flex flex-col items-center justify-center mt-14"
      >
        <!-- Loading Circle (Matches Main Moon Circle position) -->
        <div class="relative w-40 h-40 flex items-center justify-center">
          <!-- Glow effect
                  <div class="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div> -->
          <!-- Background Image -->

          <!-- Center Circle -->
          <motion.div
            class="w-full h-full"
            :animate="{ scale: [0.9, 1.0, 0.9], opacity: [0.8, 1, 0.8] }"
            :transition="{ duration: 2, repeat: Infinity, ease: 'easeInOut' }"
          >
            <img
              src="@/assets/Intro/I_IconBG.png"
              alt="Moon Background"
              class="absolute inset-0 w-full h-full object-contain"
            />
          </motion.div>

          <!-- Loading Text Overlay -->
          <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          >
            <motion.p
              class="text-black/50 font-bold tracking-[0.2em] text-xs"
              :animate="{ opacity: [0.4, 1, 0.4] }"
              :transition="{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }"
            >
              LOADING
            </motion.p>
          </div>
        </div>
      </div>

      <!-- Phantom Text Section (IntroView) -->
      <div
        class="relative z-20 space-y-3 mt-20 mb-14 opacity-0 pointer-events-none"
      >
        <p class="text-sm tracking-[0.2em] font-light">Line 1</p>
        <p class="text-sm tracking-[0.2em] font-light">Line 2</p>
        <p class="text-sm tracking-[0.2em] font-light">Line 3</p>
        <p class="text-sm tracking-[0.2em] font-light">Line 4</p>
      </div>

      <!-- Phantom Button (IntroView) -->
      <div class="relative z-30 mb-4 opacity-0 pointer-events-none">
        <div class="w-16 h-16"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure it covers everything */
</style>
