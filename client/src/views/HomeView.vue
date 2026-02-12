<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink, RouterView } from "vue-router";
import { motion } from "motion-v";
import { useGenStore } from "@/stores/Gen";

const genStore = useGenStore();

// Components
import MobileShell from "../components/MobileShell.vue";
import MapPath from "../components/MapPath.vue";
import LiffProfile from "@/components/LiffProfile.vue";
import PN_Intro_Map from "../components/PN_Intro_Map.vue";
import PN_Intro_Collect from "../components/PN_Intro_Collect.vue";
import PN_Intro_Library from "../components/PN_Intro_Library.vue";
import PN_Intro_Gen from "../components/PN_Intro_Gen.vue";
import PN_Intro_Gen2 from "../components/PN_Intro_Gen2.vue";
import PN_Intro_Gen3 from "../components/PN_Intro_Gen3.vue";
import PN_Intro_Gen4 from "../components/PN_Intro_Gen4.vue";
import FluidFrostedGlass from "../components/FluidFrostedGlass.vue";
import LoadingPage from "../components/LoadingPage.vue";

// Assets
import MapImg from "../assets/Map.png";
import TriggerMapImg from "../assets/Trigger/trigger-五節芒.png";
import DeerBtn from "../assets/deer_button.png";
import IntroMapImg from "../assets/Intro_map.png";
import IntroCollectImg from "../assets/Intro_collect.png";
import IntroLibraryImg from "../assets/Intro_library.png";
import IntroGenImg from "../assets/Intro_gen.png";
import IntroGen2Img from "../assets/Intro_gen2.png";
import IntroGen3Img from "../assets/Intro_gen3.png";
import IntroGen4Img from "../assets/Intro_gen4.png";

// State
const state = ref(0);
const isLoading = ref(true);

// Methods
const nextState = () => {
  let next = state.value + 1;
  if (next > 7) {
    next = 0;
    triggerLoading();
  }
  state.value = next;
};

const prevState = () => {
  let prev = state.value - 1;
  if (prev < 0) prev = 7;
  
  if (prev === 0) {
    triggerLoading();
  }
  state.value = prev;
};

const PN_Intro_Skip = () => {
  triggerLoading();
  state.value = 0;
};

const triggerLoading = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 1000); // 1 second loading when switching back to 0
}

const preloadImages = () => {
  const images = [
    IntroMapImg,
    IntroCollectImg,
    IntroLibraryImg,
    IntroGenImg,
    IntroGen2Img,
    IntroGen3Img,
    IntroGen4Img
  ];

  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};

// Lifecycle
onMounted(() => {
  // Preload images for smoother transitions
  preloadImages();

  // Give it some time for the glass effect to initialize and stablize
  setTimeout(() => {
    isLoading.value = false;
  }, 3000); // 3 second local loading for smoother entry
});

setTimeout(() => {
  state.value = 1;
}, 5000); // Adjusted timing to account for loading
</script>

<template>
  <div class="flex flex-col h-full px-6 py-6 text-white font-sans relative">
    
    <transition name="fade">
      <LoadingPage v-if="isLoading" class="absolute inset-0 z-[100]" />
    </transition>

    <!-- Navigation Arrows -->
    <button 
      v-if="state !== 0"
      class="absolute left-4 top-[55%] -translate-y-1/2 z-50 w-12 h-12 flex justify-center items-center bg-black/20 hover:bg-white/10 rounded-full border border-white/30 backdrop-blur-sm transition-colors"
      @click="prevState"
    >
      <span class="text-2xl text-white">‹</span>
    </button>

    <button 
      v-if="state !== 0"
      class="absolute right-4 top-[55%] -translate-y-1/2 z-50 w-12 h-12 flex justify-center items-center bg-black/20 hover:bg-white/10 rounded-full border border-white/30 backdrop-blur-sm transition-colors"
      @click="nextState"
    >
      <span class="text-2xl text-white">›</span>
    </button>
    
    <!-- Main Content: Map -->
    <main class="flex-1 flex justify-center items-center w-full relative overflow-hidden my-4">
      <div class="relative w-full h-full max-w-[390px] flex items-center justify-center">
        <transition name="fade" mode="out-in">
          
          <!-- State 0 -->
          <div v-if="state == 0" key="state0" class="w-full h-full">
            <motion.div
              :initial="{ opacity: 0, y: 0, scale: 1.1 }"
              :animate="{ opacity: 1, y: 0, scale: 1 }"
              :transition="{ duration: 1, delay: 1 }"
              class="relative w-full h-full"
            >
              <img :src="genStore.isTriggerActive ? TriggerMapImg : MapImg" alt="Main Map" class="w-full h-full object-contain transition-opacity duration-500" />
              <MapPath />
              <motion.div
                v-if="!genStore.isTriggerActive"
                :initial="{ opacity: 0 }"
                :animate="{ opacity: 1 }"
                :transition="{ duration: 1.5, delay: 0.5 }"
                class="absolute inset-0 w-full h-full"
              >
                <FluidFrostedGlass />
              </motion.div>
            </motion.div>
          </div>

          <!-- Other States -->
          <div v-else-if="state == 1" key="state1" class="w-full h-full object-contain flex items-center justify-center">
            <PN_Intro_Map />
          </div>
          <div v-else-if="state == 2" key="state2" class="w-full h-full object-contain flex items-center justify-center">
            <PN_Intro_Collect />
          </div>
          <div v-else-if="state == 3" key="state3" class="w-full h-full object-contain flex items-center justify-center">
            <PN_Intro_Library />
          </div>
          <div v-else-if="state == 4" key="state4" class="w-full h-full object-contain flex items-center justify-center">
            <PN_Intro_Gen />
          </div>
          <div v-else-if="state == 5" key="state5" class="w-full h-full object-contain flex items-center justify-center">
            <PN_Intro_Gen2 />
          </div>
          <div v-else-if="state == 6" key="state6" class="w-full h-full object-contain flex items-center justify-center">
            <PN_Intro_Gen3 />
          </div>
          <div v-else-if="state == 7" key="state7" class="w-full h-full object-contain flex items-center justify-center">
            <PN_Intro_Gen4 />
          </div>

        </transition>
      </div>
    </main>

    <!-- Footer Section -->
    <transition name="fade" mode="out-in">
        <!-- State 0 Footer -->
        <div v-if="state == 0" key="state0" class="mt-auto">
          <motion.div
              :initial="{ opacity: 0, y: 0 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 1, delay: 2 }"
            >
              <footer class="flex justify-between items-center w-full pt-4">
                <div class="text-lg tracking-[0.2em] font-light text-white">地 圖 | M A P</div>
                
                <button class="w-12 h-12 rounded-full border border-white flex justify-center items-center p-2 bg-transparent hover:bg-white/10 transition-colors" @click="nextState">
                  <span class="text-3xl leading-none text-[#fffff]">!</span>
                </button>
                
                <RouterLink to="/library" class="flex h-12 w-12 items-center justify-center rounded-full border border-white bg-white/5">
                  <img :src="DeerBtn" alt="Navigate" class="w-full h-full object-contain" />
                </RouterLink>
              </footer>

              <div class="my-5"></div>
              <div class="w-[110%] -ml-5 h-px bg-white/50 mb-4"></div>
              <div class="my-5 text-center">2026 Taiwan Lantern Festival</div>

              <div class="my-5 text-center">
                {{ genStore.current_state }}
              </div>
            </motion.div>
        </div>

        <!-- Footer for other states -->
        <div v-else key="others" class="mt-auto">
            <div class="w-full mb-12">
              <footer class="grid grid-cols-[1fr_auto_1fr] items-center w-full">
                <div></div>

                <div class="w-14 h-14 rounded-full border border-white flex justify-center items-center p-2 bg-transparent">
                  <span class="text-xl leading-none text-[#fffff]">{{state}}/7</span>
                </div>

                <div class="flex justify-end">
                  <button class="w-14 h-14 rounded-full border border-[#666666] flex justify-center items-center p-2 transition-colors" @click="PN_Intro_Skip()">
                    <span class="text-md leading-none text-[#666666]">skip</span>
                  </button>
                </div>
              </footer>
            </div>
        </div>
    </transition>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
