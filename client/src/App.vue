<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import MobileShell from "./components/MobileShell.vue";
import LoadingPage from "./components/LoadingPage.vue";
import { motion } from "motion-v";
import IconStroll from "./components/IconStroll.vue";
import LiffProfile from "./components/LiffProfile.vue";
import GradientBackground from "./components/GradientBackground.vue";
import FloatingParticlesOverlay from "./components/FloatingParticlesOverlay.vue";
import plantData from "@/data/plantData.json";

const isMenuOpen = ref(false);
const isLoading = ref(true);
const brightness = ref(1);
const route = useRoute();
import { useGenStore } from "@/stores/Gen";
import { useServerSyncStore } from "@/stores/ServerSync";
const genStore = useGenStore();
const serverSyncStore = useServerSyncStore();

const currentParticlesColor = computed(() => {
  if (route.name === 'information') {
    // Attempt to find theme color from plantData
    const id = route.query.id;
    const plant = plantData.find(p => p.id === id);
    if (plant) return plant.themeColor;
  }
  return null; // Fallback to component default
});

// Define color palettes for different pages
// Format: [Color1, Color2, Color3]
const colorMap = {
  'home': ['#999999', '#517ADA', '#000000'],      // Dark Blue/Black theme
  'home-active': ['#FFD700', '#FF8C00', '#FFFFFF'], // Active/Near Deer (Gold/Orange)
  'library': ['#000000', '#000000', '#000000'],   // Example: More earthy/dark for library
  'gen-choose': ['#000000', '#0B143B', '#000000'],  // Original purple/blue mix
  'gen-show': ['#000000', '#000000', '#000000'], 
  'information': ['#000000', '#000000', '#000000'], // Dark Slate Gray
  'lineinfo': ['#000000', '#000000', '#000000'],
  'test': ['#000000', '#000000', '#000000'],      // Example: Reddish for test
};

const currentColors = computed(() => {
  if (forceBlackBackground.value) {
    return ['#000000', '#000000', '#000000'];
  }

  // Check if we are home and close to a deer
  // if (route.name === 'home' && genStore.beaconStatus > 1) {
  //   return colorMap['home-active'];
  // }
  
  return colorMap[route.name] || ['#000000', '#517ADA', '#000000'];
});

// Watch beacon status to adjust brightness on home page
watch(() => genStore.beaconStatus, (newStatus) => {
  if (route.name === 'home') {
    if (newStatus !== 1) {
      brightness.value = 0.2; // Brighter when near deer
    } else {
      brightness.value = 1.0; // Default dim
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

const inputBeaconStatus = ref(2);

const toggleTrigger = () => {
  genStore.toggleManualTrigger(Number(inputBeaconStatus.value));
};

watch(() => genStore.isTriggerActive, (active) => {
  if (active) {
    brightness.value = 0.2;
  } else {
    brightness.value = 1.0;
  }
});

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

const forceBlackBackground = ref(false);

watch([isLoading, () => genStore.isHomeLoading], ([loading, homeLoading]) => {
  if (loading || homeLoading) {
    forceBlackBackground.value = true;
  } else {
    // Both finished loading, keep black for 1 more second
    setTimeout(() => {
      forceBlackBackground.value = false;
    }, 1000);
  }
}, { immediate: true });
</script>

<template>
  <GradientBackground 
    :colors="currentColors" 
    :brightness="brightness" 
    :speed="10"
  />
  <FloatingParticlesOverlay 
    v-if="['home', 'normal', 'library', 'information'].includes(route.name)" 
    :theme-color="currentParticlesColor" 
  />
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

  <!-- Notification Modal -->
  <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div v-if="genStore.notificationVisible" class="fixed inset-0 z-[1000] flex items-center justify-center px-8">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="genStore.closeNotification"></div>
          
          <!-- Box -->
          <div class="relative bg-black/80 border border-white/20 rounded-2xl p-8 max-w-sm w-full text-center shadow-[0_0_30px_rgba(255,255,255,0.1)] backdrop-blur-md">
              <p class="text-white text-lg font-light tracking-widest mb-8 leading-relaxed">{{ genStore.notificationMessage }}</p>
              
              <button 
                class="w-full py-3 border border-white/30 rounded-full text-white hover:bg-white/10 active:bg-white/20 transition-all duration-300 tracking-[0.2em] text-sm font-light"
                @click="genStore.closeNotification"
              >
                  確 定
              </button>
          </div>
      </div>
  </transition>

  <MobileShell>
    <!-- Content inside shell -->
    <div class="flex flex-col w-full h-full pb-6 text-white font-sans relative">
      <!-- Header -->
      <!-- Sticky Header Container -->
      <div class="sticky top-0 z-[100] w-full">
        <!-- Blurred Background -->
        <div class="absolute top-0 left-0 w-full h-[108px] bg-[rgb(0,0,0,0.3)] backdrop-blur-sm -z-10"></div>
        
        <!-- Header Content -->
        <div class="pt-6 px-6 mb-2">
          <header
            class="flex justify-between items-center w-full relative"
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
        </div>
      </div>

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

      <LiffProfile />
      
      

      <!-- Trigger Toggle Button -->
      <div class="relative z-[9999] flex items-center justify-end px-4 gap-2">
        <div class="text-white font-bold text-shadow bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
          {{ genStore.triggerTimer }}s
        </div>
        <input 
          v-model="inputBeaconStatus" 
          type="number" 
          min="1" 
          max="9" 
          class="w-12 h-8 bg-white/20 border border-white/30 rounded text-center text-white"
        />
        <button 
          class="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full border border-white/30 flex items-center justify-center text-white text-xs hover:bg-white/30 transition-colors shadow-lg"
          @click="toggleTrigger"
        >
          {{ genStore.isTriggerActive ? 'ON' : 'OFF' }}
        </button>
      </div>
    </div>
  </MobileShell>
</template>
