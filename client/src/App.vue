<script setup>
  import { ref, watch } from "vue";
  import { RouterLink, RouterView, useRoute } from "vue-router";
  import MobileShell from "./components/MobileShell.vue";
  import { motion } from "motion-v";

  const isMenuOpen = ref(false);
  const route = useRoute();

  // Close menu when route changes
  watch(route, () => {
    isMenuOpen.value = false;
  });

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };
</script>

<template>
  <MobileShell>
    <div class="flex flex-col h-full px-6 py-6 text-white font-sans relative">
      
      <!-- Header -->
      <header class="flex justify-between items-center w-full mb-2 z-50 relative">
        <motion.div
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 3, delay: 0.2 }"
            class="flex flex-col items-start"
          >

          <RouterLink to="/" class="text-3xl font-light tracking-widest hover:text-gray-300 transition-colors" @click="toggleMenu">
            <h1 class="text-2xl font-bold tracking-[0.3em] mb-1">逐 鹿 光 溯 源</h1>
            <p class="text-[0.6rem] text-gray-300 font-light tracking-wide">Chasing Light, Reflecting Deer in the Grass</p>
          </RouterLink>

        </motion.div>
          


        
        <!-- Menu Icon -->
        <button 
          @click="toggleMenu"
          class="w-10 h-10 border border-white rounded-full flex flex-col justify-center items-center gap-1.5 p-2.5 hover:bg-white/10 transition-colors z-50 relative"
        >
            <span 
              class="w-full h-0.5 bg-white block transition-transform duration-300"
              :class="{ 'rotate-45 translate-y-2': isMenuOpen }"
            ></span>
            <span 
              class="w-full h-0.5 bg-white block transition-opacity duration-300"
              :class="{ 'opacity-0': isMenuOpen }"
            ></span>
            <span 
              class="w-full h-0.5 bg-white block transition-transform duration-300"
              :class="{ '-rotate-45 -translate-y-2': isMenuOpen }"
            ></span>
        </button>
      </header>



      <!-- Menu Overlay -->
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-x-full"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-full"
      >
        <div 
          v-if="isMenuOpen" 
          class="fixed inset-0 bg-black/95 z-40 flex flex-col justify-center items-center gap-8 backdrop-blur-sm"
        >
          <RouterLink to="/" class="text-3xl font-light tracking-widest hover:text-gray-300 transition-colors" @click="toggleMenu">HOME</RouterLink>
          <RouterLink to="/library" class="text-3xl font-light tracking-widest hover:text-gray-300 transition-colors" @click="toggleMenu">圖鑑</RouterLink>
          <RouterLink to="/gen-choose" class="text-3xl font-light tracking-widest hover:text-gray-300 transition-colors" @click="toggleMenu">生成</RouterLink>
          <RouterLink to="/practice" class="text-3xl font-light tracking-widest hover:text-gray-300 transition-colors" @click="toggleMenu">PRACTICE</RouterLink>
          <RouterLink to="/lineinfo" class="text-3xl font-light tracking-widest hover:text-gray-300 transition-colors" @click="toggleMenu">LINEINFO</RouterLink>
        </div>
      </transition>

       <!-- Divider -->
      <div class="w-[110%] -ml-5 h-px bg-white/50 mb-4 mt-5"></div>

      <!-- Main Content Area -->
      <RouterView />
    </div>
  </MobileShell>
</template>
