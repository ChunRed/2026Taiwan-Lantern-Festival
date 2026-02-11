<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import MobileShell from "./components/MobileShell.vue";
import LoadingPage from "./components/LoadingPage.vue";
import { motion } from "motion-v";
import IconStroll from "./components/IconStroll.vue";
import LiffProfile from "./components/LiffProfile.vue";
import GradientBackground from "./components/GradientBackground.vue";

const isMenuOpen = ref(false);
const isLoading = ref(true);
const brightness = ref(0.3);
const route = useRoute();
import { useGenStore } from "@/stores/Gen";
const genStore = useGenStore();

// Define color palettes for different pages
// Format: [Color1, Color2, Color3]
const colorMap = {
  'home': ['#000000', '#517ADA', '#C8AAFF'],      // Dark Blue/Black theme
  'home-active': ['#FFD700', '#FF8C00', '#FFFFFF'], // Active/Near Deer (Gold/Orange)
  'library': ['#000000', '#000000', '#000000'],   // Example: More earthy/dark for library
  'gen-choose': ['#000000', '#000000', '#000000'],  // Original purple/blue mix
  'gen-show': ['#000000', '#000000', '#000000'], 
  'information': ['#000000', '#000000', '#000000'], // Dark Slate Gray
  'lineinfo': ['#000000', '#000000', '#000000'],
  'test': ['#000000', '#000000', '#000000'],      // Example: Reddish for test
};

const currentColors = computed(() => {
  // Check if we are home and close to a deer
  if (route.name === 'home' && genStore.beaconStatus > 1) {
    return colorMap['home-active'];
  }
  
  return colorMap[route.name] || ['#000000', '#517ADA', '#000000'];
});

// Watch beacon status to adjust brightness on home page
watch(() => genStore.beaconStatus, (newStatus) => {
  if (route.name === 'home') {
    if (newStatus !== 0) {
      brightness.value = 0.8; // Brighter when near deer
    } else {
      brightness.value = 0.3; // Default dim
    }
  }
});

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
  <GradientBackground 
    :colors="currentColors" 
    :brightness="brightness" 
    :speed="30"
  />
  <MobileShell>
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

    <div class="flex flex-col w-full h-full py-6 text-white font-sans relative">
      <!-- Header -->
      <header
        class="flex justify-between items-center w-full px-6 mb-2 z-50 relative"
      >
        <motion.div
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 1, delay: 0.2 }"
          class="flex flex-col items-start"
        >
          <RouterLink
            to="/home"
            class="text-3xl font-light tracking-widest hover:text-gray-300 transition-colors"
            @click="toggleMenu"
          >
            <h1 class="text-2xl font-bold tracking-[0.3em] mb-1">
              逐 鹿 光 溯 源
            </h1>
            <p class="text-[0.6rem] text-gray-300 font-light tracking-wide">
              Chasing Light, Reflecting Deer in the Grass
            </p>
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
          <RouterLink
            to="/home"
            class="text-2xl font-light text-center tracking-widest hover:text-gray-300 transition-colors"
            @click="toggleMenu"
            >首頁
            <div
              class="mt-3 text-sm text-center text-gray-300 font-light tracking-[0.6em]"
            >
              HOME
            </div></RouterLink
          >

          <RouterLink
            to="/library"
            class="text-2xl font-light text-center tracking-widest hover:text-gray-300 transition-colors"
            @click="toggleMenu"
            >圖鑑
            <div
              class="mt-3 text-sm text-center text-gray-300 font-light tracking-[0.6em]"
            >
              LIBRARY
            </div></RouterLink
          >

          <RouterLink
            to="/gen-choose"
            class="text-2xl font-light text-center tracking-widest hover:text-gray-300 transition-colors"
            @click="toggleMenu"
            >生成
            <div
              class="mt-3 text-sm text-center text-gray-300 font-light tracking-[0.6em]"
            >
              GENERATE
            </div></RouterLink
          >

          <RouterLink
            to="/test"
            class="text-2xl font-light text-center tracking-widest hover:text-gray-300 transition-colors"
            @click="toggleMenu"
            >測試
            <div
              class="mt-3 text-sm text-center text-gray-300 font-light tracking-[0.6em]"
            >
              TEST
            </div></RouterLink
          >

          <RouterLink
            to="/lineinfo"
            class="text-2xl font-light text-center tracking-widest hover:text-gray-300 transition-colors"
            @click="toggleMenu"
            >玩家資訊
            <div
              class="mt-3 text-sm text-center text-gray-300 font-light tracking-[0.6em]"
            >
              INFO
            </div></RouterLink
          >
        </div>
      </transition>

      <!-- Divider -->
      <div class="w-[110%] -ml-5 h-px bg-white/50 mb-4 mt-1 z-20"></div>

      <!-- Main Content Area -->
      <IconStroll v-if="route.name === 'information'" />

      <RouterView />
      <div
        class="absolute top-0 left-0 w-full h-[108px] bg-[rgb(0,0,0,0.3)] backdrop-blur-sm z-40"
      ></div>
      <LiffProfile />
    </div>

    <!-- Debug Control for Brightness (Hidden by default, hover bottom-left to see) -->
    <div class="fixed bottom-4 left-4 z-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
      <input 
        type="range" 
        min="0" 
        max="2" 
        step="0.1" 
        v-model.number="brightness" 
        class="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <div class="text-xs text-white bg-black/50 px-2 py-1 rounded mt-1 text-center">Brightness: {{ brightness }}</div>
    </div>
  </MobileShell>
</template>
