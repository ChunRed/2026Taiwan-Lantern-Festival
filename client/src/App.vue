<script setup>
  import { ref, watch, onMounted } from "vue";
  import { RouterLink, RouterView, useRoute } from "vue-router";
  import MobileShell from "./components/MobileShell.vue";
  import LoadingPage from "./components/LoadingPage.vue";
  import { motion } from "motion-v";
  import IconStroll from "./components/IconStroll.vue"

  const isMenuOpen = ref(false);
  const isLoading = ref(true);
  const route = useRoute();

  // Close menu when route changes
  watch(route, () => {
    isMenuOpen.value = false;
  });

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };

  onMounted(() => {
    const handleLoad = () => {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        isLoading.value = false;
      }, 3000);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }
    
    // Safety timeout
    setTimeout(() => {
      isLoading.value = false;
    }, 100);
  });
</script>

<template>
  <MobileShell >
    <transition
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-500 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <LoadingPage v-if="isLoading" />
    </transition>

    

    <div class="flex flex-col w-full h-full  py-6 text-white font-sans relative ">
      
      <!-- Header -->
      <header class="flex justify-between items-center w-full px-6 mb-2 z-50 relative ">
        <motion.div
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 1, delay: 0.2 }"
            class="flex flex-col items-start"
          >

          <RouterLink to="/home" class="text-3xl font-light tracking-widest hover:text-gray-300 transition-colors" @click="toggleMenu">
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
          <RouterLink to="/home" class="text-2xl font-light text-center tracking-widest hover:text-gray-300 transition-colors" @click="toggleMenu">首頁<div class="mt-3 text-sm text-center text-gray-300 font-light tracking-[0.6em]">HOME</div></RouterLink>


          <RouterLink to ="/library" class="text-2xl font-light text-center tracking-widest hover:text-gray-300 transition-colors" @click="toggleMenu">圖鑑<div class="mt-3 text-sm text-center text-gray-300 font-light tracking-[0.6em]">LIBRARY</div></RouterLink>

          
          <RouterLink to="/gen-choose" class="text-2xl font-light text-center tracking-widest hover:text-gray-300 transition-colors" @click="toggleMenu">生成<div class="mt-3 text-sm text-center text-gray-300 font-light tracking-[0.6em]">GENERATE</div></RouterLink>



          <RouterLink to="/test" class="text-2xl font-light text-center tracking-widest hover:text-gray-300 transition-colors" @click="toggleMenu">測試<div class="mt-3 text-sm text-center text-gray-300 font-light tracking-[0.6em]">TEST</div></RouterLink>








          <!-- <RouterLink to="/practice" class="text-3xl font-light tracking-widest hover:text-gray-300 transition-colors" @click="toggleMenu">PRACTICE</RouterLink>
          <RouterLink to="/lineinfo" class="text-3xl font-light tracking-widest hover:text-gray-300 transition-colors" @click="toggleMenu">LINEINFO</RouterLink> -->
        </div>
      </transition>

       <!-- Divider -->
      <div class="w-[110%] -ml-5 h-px bg-white/50 mb-4 mt-1 z-20"></div>

      <!-- Main Content Area -->
      <IconStroll v-if="route.name === 'information'" />
      
      <RouterView />
      <div class="absolute top-0 left-0 w-full h-[108px] bg-[rgb(0,0,0,0.3)] backdrop-blur-sm z-40"></div>
      
    </div>
  </MobileShell>
</template>
