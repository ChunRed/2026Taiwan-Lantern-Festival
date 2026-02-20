<script setup>
import { ref, onMounted, computed } from 'vue';
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
import CrossOverlay from "../components/CrossOverlay.vue";
import LoadingPage from "../components/LoadingPage.vue";

// Assets
import MapImg from "../assets/Map.png";
import MapUIImg from "../assets/Map-UI.png";
import plantData from '../data/plantData.json';
import DeerBtn from "../assets/deer_button.png";
import IntroMapImg from "../assets/Intro_map.png";
import IntroCollectImg from "../assets/Intro_collect.png";
import IntroLibraryImg from "../assets/Intro_library.png";
import IntroGenImg from "../assets/Intro_gen.png";
import IntroGen2Img from "../assets/Intro_gen2.png";
import IntroGen3Img from "../assets/Intro_gen3.png";
import IntroGen4Img from "../assets/Intro_gen4.png";

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { nextTick, watch } from 'vue';

gsap.registerPlugin(ScrollTrigger);

// State
const state = ref(0);
const randomDeerTextSrc = ref(new URL('../assets/DeerIcon/text/0.png', import.meta.url).href);
// Use store state for loading
// Initialize store state
onMounted(() => {
  genStore.isHomeLoading = true;
});

const triggerMapSrc = computed(() => {
  const index = genStore.beaconStatus - 2;
  const plant = plantData[index];
  
  if (plant) {
    return new URL(`../assets/Trigger/trigger-${plant.nameZh}.png`, import.meta.url).href;
  }
  // Default fallback (e.g. last item or a specific default)
  return new URL(`../assets/Trigger/trigger-五節芒.png`, import.meta.url).href;
});

const currentTriggerInfo = computed(() => {
  const index = genStore.beaconStatus - 2;
  if (index >= 0 && index < plantData.length) {
    return {
      name: plantData[index].nameZh,
      scale: genStore.ItemScale[index]
    };
  }
  return null;
});

// Watch for state changes to re-apply GSAP animation
watch(state, async (newVal, oldVal) => {
  if (newVal === 0) {
    await nextTick();
    // Small delay to ensure DOM is ready and layout is settled
    setTimeout(() => {
      setupScrollAnimation();
    }, 100); 
  } else if (oldVal === 0) {
    // Cleanup when leaving state 0
    ScrollTrigger.getAll().forEach(t => {
      // Check if trigger is related to .info-zh
      if (t.vars && t.vars.trigger === '.info-zh') t.kill();
       // Also check if the trigger element itself is .info-zh (in case vars.trigger is resolved)
      if (t.trigger && (t.trigger.classList && t.trigger.classList.contains('info-zh'))) t.kill();
    });
  }
}, { immediate: true });

const setupScrollAnimation = () => {




  // Check if element exists
  const target_zh = document.querySelector('.info-zh');
  const target_en = document.querySelector('.info-en');
  if (!target_zh) return;
  
  // Clean up existing triggers for these elements to avoid duplicates
  ScrollTrigger.getAll().forEach(t => {
    if (t.vars && t.vars.trigger === '.info-zh') t.kill();
    if (t.trigger === target_zh) t.kill();
    if (t.vars && t.vars.trigger === '.info-en') t.kill();
    if (t.trigger === target_en) t.kill();
    
    // Clean up deer icons
    if (t.trigger && t.trigger.classList && t.trigger.classList.contains('deer-icon')) t.kill();
  });

  gsap.fromTo(target_zh, 
    { x: -100, opacity: 0, rotate:-5 },
    {
      x: 0, 
      opacity: 1, 
      rotate: 0,
      ease: "power2.out",
      scrollTrigger: {
        trigger: target_zh, // Use the element directly
        scroller: "#mobile-scroll-container",
        start: "top 80%", // Trigger when top of element hits 90% of viewport height
        end: "top 60%",   // Animation completes when top of element hits 60% of viewport height
        scrub: 1,         // Smooth scrubbing linked to scroll position
      }
    }
  );

  gsap.fromTo(target_en, 
    { x: 300, opacity: 0,  rotate:5},
    {
      x: 0, 
      opacity: 1, 
      rotate: 0,
      ease: "power2.out",
      scrollTrigger: {
        trigger: target_en, // Use the element directly
        scroller: "#mobile-scroll-container",
        start: "top 80%", // Trigger when top of element hits 90% of viewport height
        end: "top 60%",   // Animation completes when top of element hits 60% of viewport height
        scrub: 1,         // Smooth scrubbing linked to scroll position
      }
    }
  );

  // Deer icons animations
  const deerIcons = document.querySelectorAll('.deer-icon');
  deerIcons.forEach(icon => {
    const parentContainer = icon.closest('.info-zh') || icon.closest('.info-en');
    
    // Continuous floating animation (paused initially)
    const floatAnim = gsap.to(icon, {
      x: "random(-10, 10)",
      y: "random(-10, 10)",
      rotate: "random(-10, 10)",
      duration: "random(2, 4)",
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      repeatRefresh: true,
      paused: true
    });

    // Fade-in animation with delay
    gsap.fromTo(icon, 
      { opacity: 0, scale: 0.5 },
      {
        opacity: 0.5,
        scale: 1,
        duration: 0.8,
        delay: 1, // 1 second delay after parent starts entering
        ease: "back.out(1.7)", // light bounce effect
        scrollTrigger: {
          trigger: parentContainer,
          scroller: "#mobile-scroll-container",
          start: "top 80%",
          toggleActions: "play none none reverse"
        },
        onComplete: () => {
          floatAnim.resume();
        },
        onReverseComplete: () => {
          floatAnim.pause();
          // reset float transform so next time it starts fresh
          gsap.set(icon, { x: 0, y: 0, rotate: 0 });
        }
      }
    );
  });

  // Bottom deer animation
  const bottomDeerContainer = document.querySelector('.bottom-deer-container');
  const bottomDeer = document.querySelector('.bottom-deer');
  
  if (bottomDeerContainer && bottomDeer) {
    ScrollTrigger.getAll().forEach(t => {
      if (t.trigger === bottomDeerContainer) t.kill();
    });

    const deerAnim = gsap.fromTo(bottomDeer,
      { y: 0, opacity: 0 },
      {
        y: "-100%", // moves it up by its full height
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.2)",
        paused: true
      }
    );

    let deerDelayCall;

    ScrollTrigger.create({
      trigger: bottomDeerContainer,
      scroller: "#mobile-scroll-container",
      start: "top 98%", // 當容器快進到畫面範圍內時觸發
      onEnter: () => {
        // 隨機選一張文字圖片
        const randomIdx = Math.floor(Math.random() * 3);
        randomDeerTextSrc.value = new URL(`../assets/DeerIcon/text/${randomIdx}.png`, import.meta.url).href;

        // 每次滑到底部都要重新延遲1秒再播放
        if(deerDelayCall) deerDelayCall.kill();
        deerDelayCall = gsap.delayedCall(1, () => deerAnim.play());
      },
      onLeaveBack: () => {
        // 若在延遲期間滑回去，取消播放並倒轉動畫
        if(deerDelayCall) deerDelayCall.kill();
        deerAnim.reverse();
      }
    });
  }

};



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
  genStore.isHomeLoading = true;
  setTimeout(() => {
    genStore.isHomeLoading = false;
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
    genStore.isHomeLoading = false;
  }, 2000); // 3 second local loading for smoother entry

  // Only auto-advance to state 1 on first visit
  if (!genStore.hasVisitedHome) {
    setTimeout(() => {
        state.value = 1;
        genStore.hasVisitedHome = true;
    }, 1000); // Adjusted timing to account for loading
  }     
});
</script>

<template>
  <div class="flex flex-col h-full px-6 py-6 text-white font-sans relative">
    
    <transition name="fade">
      <LoadingPage v-if="genStore.isHomeLoading" class="absolute inset-0 z-[100]" />
    </transition>

    <CrossOverlay v-if="state === 0" />



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
          <!-- State 0 -->
          <div v-if="state == 0" key="state0" class="w-full h-full">
            <motion.div
              :initial="{ opacity: 0, y: 0, scale: 1.1 }"
              :animate="{ opacity: 1, y: 0, scale: 1 }"
              :transition="{ duration: 1, delay: 1 }"
              class="relative w-full h-full"
            >
              <!-- Normal Map (Relative to maintain layout size) -->
              <img 
                :src="MapImg" 
                alt="Main Map" 
                class="relative w-full h-full object-contain transition-opacity duration-1000"
                :class="{ 'opacity-0': genStore.isTriggerActive, 'opacity-100': !genStore.isTriggerActive }"
              />
              
              <!-- Trigger Map (Absolute overlay) -->
              <img 
                :src="triggerMapSrc" 
                alt="Trigger Map" 
                class="absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 animate-pulse-glow"
                :class="{ 'opacity-100': genStore.isTriggerActive, 'opacity-0': !genStore.isTriggerActive }"
              />
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

              <!-- Map UI Overlay (Placed last to be on top of glass) -->
              <img 
                :src="MapUIImg" 
                alt="Map UI" 
                class="absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 pointer-events-none z-20"
                :class="{ 'opacity-0': genStore.isTriggerActive, 'opacity-100': !genStore.isTriggerActive }"
              />
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

      </div>
    </main>

    <!-- Footer Section -->
        <!-- State 0 Footer -->
        <div v-if="state == 0" key="state0" class="mt-auto">
          <motion.div
              :initial="{ opacity: 0, y: 0 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 1, delay: 2 }"
            >
              <footer class="flex justify-between items-center w-full pt-4 h-16 relative">
                <transition name="fade" mode="out-in">
                  <div v-if="!genStore.isTriggerActive" class="flex justify-between items-center w-full">
                    <div class="text-lg tracking-[0.2em] font-light text-white">地 圖 | M A P</div>
                    
                    <div class="flex gap-4">
                      <button class="w-12 h-12 rounded-full border border-white flex justify-center items-center p-2 bg-transparent hover:bg-white/10 transition-colors" @click="nextState">
                        <span class="text-3xl leading-none text-[#fffff]">!</span>
                      </button>
                      
                      <RouterLink to="/library" class="flex h-12 w-12 items-center justify-center rounded-full border border-white bg-white/5">
                        <img :src="DeerBtn" alt="Navigate" class="w-full h-full object-contain" />
                      </RouterLink>
                    </div>
                  </div>

                  <div v-else-if="currentTriggerInfo" class="absolute inset-0 flex items-center justify-center w-full">
                    <div class="bg-black/40 backdrop-blur-sm px-6 py-2 rounded-full border border-white/30 text-white flex gap-4 items-center shadow-lg transform transition-all duration-300">
                        <span class="text-lg tracking-widest font-bold">{{ currentTriggerInfo.name }}</span>
                        <div class="h-4 w-px bg-white/50"></div>
                        <span class="text-lg font-mono text-white">{{ Math.floor(currentTriggerInfo.scale) }} % </span>
                    </div>
                  </div>
                </transition>
              </footer>

              
              <div v-if="!genStore.isHomeLoading" class="my-5"></div>
              <div v-if="!genStore.isHomeLoading"  class="w-[110%] -ml-5 h-px bg-white/50 mb-4"></div>


              <div class="info-zh relative mt-24 bg-[#000000]/20 rounded-lg p-4 z-0">
                <img src="../assets/DeerIcon/Group 435.png" class="deer-icon absolute -top-12 -left-8 w-24 opacity-0 z-[-1] pointer-events-none" />
                <img src="../assets/DeerIcon/Group 440.png" class="deer-icon absolute -bottom-12 -right-4 w-28 opacity-0 z-[-1] pointer-events-none" />
                <div class="mt-4 text-md">2026台灣燈會｜逐鹿光溯源展區</div>
                <div class="mt-4 text-sm">活動時間：2026/3/3(二) - 3/15(日)</div>
                <div class="mt-4 text-sm">活動地點：嘉義縣政府前廣場</div>
              </div>

              <div class="info-en relative mt-24 bg-[#000000]/20 rounded-lg p-4 z-0">
                <img src="../assets/DeerIcon/Group 442.png" class="deer-icon absolute -top-8 -right-8 w-20 opacity-0 z-[-1] pointer-events-none" />
                <img src="../assets/DeerIcon/Group 443.png" class="deer-icon absolute -bottom-12 -left-6 w-28 opacity-0 z-[-1] pointer-events-none" />
                <div class="mt-4 text-md">2026 TAIWAN LANTERN FESTIVAL</div>
                <div class="mt-4 text-sm">Chasing Light, Reflecting Deer in the Grass</div>
                <div class="mt-4 text-sm">2026 / 3 / 3 (Tue) - 3 / 15 (Sun)</div>
                <div class="mt-4 text-sm">CHIAYI COUNTY GOVERNMENT PLAZA</div>
              </div>

              <div v-if="!genStore.isHomeLoading" style="height: 15vh;"> </div>

              <!-- 頁面底部出現一半的鹿 -->
              <div class="bottom-deer-container relative w-auto -mx-6 -mb-6 h-[320px] overflow-hidden flex justify-center pointer-events-none">
                <div class="bottom-deer absolute top-full opacity-0 flex flex-col items-center">
                  <img :src="randomDeerTextSrc" class="w-56 -ml-8 mb-2" alt="Speech Bubble" />
                  <img src="../assets/DeerIcon/Group 442-2.png" class="w-48" alt="Bottom Deer" />
                </div>
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

<style scoped>
@keyframes pulse-glow {
  0%, 100% {
    filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0));
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 1));
  }
}

.animate-pulse-glow {
  animation: pulse-glow 2s infinite ease-in-out;
}
</style>
