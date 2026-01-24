<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink, RouterView } from "vue-router";
import { motion } from "motion-v";

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

// Assets
import MapImg from "../assets/Map.png";
import DeerBtn from "../assets/deer_button.png";

// State
const state = ref(0);

// Methods
const PN_Intro = () => {
  if (state.value < 7) state.value++;
  else state.value = 0;
};

const PN_Intro_Skip = () => {
  state.value = 0;
};

// Lifecycle
setTimeout(() => {
  state.value = 1;
}, 4000);
</script>

<template>
  <!-- <MobileShell> -->
  <div class="flex flex-col h-full px-6 py-6 text-white font-sans">
    
    <!-- Main Content: Map -->
    <main class="flex-1 flex justify-center items-center w-full relative overflow-hidden my-4">
      <div class="relative w-full max-w-[450px]">
        <transition name="fade" mode="out-in">
          
          <!-- State 0 -->
          <div v-if="state == 0" key="state0">
            <motion.div
              :initial="{ opacity: 0, y: 0, scale: 1.1 }"
              :animate="{ opacity: 1, y: 0, scale: 1 }"
              :transition="{ duration: 1, delay: 1 }"
            >
              <img :src="MapImg" alt="Main Map" class="w-full h-full object-contain" />
            </motion.div>
            <MapPath />
          </div>

          <!-- State 1 -->
          <div v-else-if="state == 1" key="state1" class="w-full h-full object-contain">
            <PN_Intro_Map />
          </div>

          <!-- State 2 -->
          <div v-else-if="state == 2" key="state2" class="w-full h-full object-contain">
            <PN_Intro_Collect />
          </div>

          <!-- State 3 -->
          <div v-else-if="state == 3" key="state3" class="w-full h-full object-contain">
            <PN_Intro_Library />
          </div>

          <!-- State 4 -->
          <div v-else-if="state == 4" key="state4" class="w-full h-full object-contain">
            <PN_Intro_Gen />
          </div>

          <!-- State 5 -->
          <div v-else-if="state == 5" key="state5" class="w-full h-full object-contain">
            <PN_Intro_Gen2 />
          </div>

          <!-- State 6 -->
          <div v-else-if="state == 6" key="state6" class="w-full h-full object-contain">
            <PN_Intro_Gen3 />
          </div>

          <!-- State 7 -->
          <div v-else-if="state == 7" key="state7" class="w-full h-full object-contain">
            <PN_Intro_Gen4 />
          </div>

        </transition>
      </div>
    </main>

    <!-- Footer Section -->
    <transition name="fade" mode="out-in">
      
      <!-- State 0 Footer -->
      <div v-if="state == 0" key="state0">
        <motion.div
          :initial="{ opacity: 0, y: 0 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 1, delay: 2 }"
        >
          <footer class="flex justify-between items-center w-full mt-auto pt-4">
            <div class="text-lg tracking-[0.2em] font-light text-white">地 圖 | M A P</div>
            
            <button class="w-12 h-12 rounded-full border border-white flex justify-center items-center p-2 bg-transparent hover:bg-white/10 transition-colors" @click="PN_Intro()">
              <span class="text-3xl leading-none text-[#fffff]">?</span>
            </button>
            
            <RouterLink to="/gen-choose" class="flex h-12 w-12 items-center justify-center rounded-full border border-white bg-white/5">
              <img :src="DeerBtn" alt="Navigate" class="w-full h-full object-contain" />
            </RouterLink>
          </footer>

          <div class="my-5"></div>
          <div class="my-5"></div>
          <!-- Divider -->
          <div class="w-[110%] -ml-5 h-px bg-white/50 mb-4"></div>
          <div class="my-5 text-center">2026 Taiwan Lantern Festival</div>
        </motion.div>
      </div>

      <!-- State 1 Footer -->
      <div v-else-if="state == 1" key="state1">
        <motion.div
          :initial="{ opacity: 0, y: 0 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 1 }"
          class="w-full"
        >
          <footer class="grid grid-cols-[1fr_auto_1fr] items-center w-full mt-auto mb-12 px-5">
            <!-- Left Spacer -->
            <div></div>

            <!-- Deer Button -->
            <button class="w-14 h-14 rounded-full border border-white flex justify-center items-center p-2 bg-transparent hover:bg-white/10 transition-colors" @click="PN_Intro()">
              <span class="text-xl leading-none text-[#fffff]">{{state}}/7</span>
            </button>

            <!-- Skip button -->
            <div class="flex justify-end">
              <button class="w-14 h-14 rounded-full border border-[#666666] flex justify-center items-center p-2 transition-colors" @click="PN_Intro_Skip()">
                <span class="text-md leading-none text-[#666666]">skip</span>
              </button>
            </div>
          </footer>
        </motion.div>
      </div>

      <!-- State 2 Footer -->
      <div v-else-if="state == 2" key="state2">
        <motion.div
          :initial="{ opacity: 0, y: 0 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 1 }"
          class="w-full"
        >
          <footer class="grid grid-cols-[1fr_auto_1fr] items-center w-full mt-auto mb-12 px-5">
            <!-- Left Spacer -->
            <div></div>

            <!-- Deer Button -->
            <button class="w-14 h-14 rounded-full border border-white flex justify-center items-center p-2 bg-transparent hover:bg-white/10 transition-colors" @click="PN_Intro()">
              <span class="text-xl leading-none text-[#fffff]">{{state}}/7</span>
            </button>

            <!-- Skip button -->
            <div class="flex justify-end">
              <button class="w-14 h-14 rounded-full border border-[#666666] flex justify-center items-center p-2 transition-colors" @click="PN_Intro_Skip()">
                <span class="text-md leading-none text-[#666666]">skip</span>
              </button>
            </div>
          </footer>
        </motion.div>
      </div>

      <!-- State 3 Footer -->
      <div v-else-if="state == 3" key="state3">
        <motion.div
          :initial="{ opacity: 0, y: 0 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 1 }"
          class="w-full"
        >
          <footer class="grid grid-cols-[1fr_auto_1fr] items-center w-full mt-auto mb-12 px-5">
             <!-- Left Spacer -->
            <div></div>

            <!-- Deer Button -->
            <button class="w-14 h-14 rounded-full border border-white flex justify-center items-center p-2 bg-transparent hover:bg-white/10 transition-colors" @click="PN_Intro()">
              <span class="text-xl leading-none text-[#fffff]">{{state}}/7</span>
            </button>

            <!-- Skip button -->
            <div class="flex justify-end">
              <button class="w-14 h-14 rounded-full border border-[#666666] flex justify-center items-center p-2 transition-colors" @click="PN_Intro_Skip()">
                <span class="text-md leading-none text-[#666666]">skip</span>
              </button>
            </div>
          </footer>
        </motion.div>
      </div>


      <!-- State 4 Footer -->
      <div v-else-if="state == 4" key="state4">
        <motion.div
          :initial="{ opacity: 0, y: 0 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 1 }"
          class="w-full"
        >
          <footer class="grid grid-cols-[1fr_auto_1fr] items-center w-full mt-auto mb-12 px-5">
             <!-- Left Spacer -->
            <div></div>

            <!-- Deer Button -->
            <button class="w-14 h-14 rounded-full border border-white flex justify-center items-center p-2 bg-transparent hover:bg-white/10 transition-colors" @click="PN_Intro()">
              <span class="text-xl leading-none text-[#fffff]">{{state}}/7</span>
            </button>

            <!-- Skip button -->
            <div class="flex justify-end">
              <button class="w-14 h-14 rounded-full border border-[#666666] flex justify-center items-center p-2 transition-colors" @click="PN_Intro_Skip()">
                <span class="text-md leading-none text-[#666666]">skip</span>
              </button>
            </div>
          </footer>
        </motion.div>
      </div>


      <!-- State 5 Footer -->
      <div v-else-if="state == 5" key="state5">
        <motion.div
          :initial="{ opacity: 0, y: 0 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 1 }"
          class="w-full"
        >
          <footer class="grid grid-cols-[1fr_auto_1fr] items-center w-full mt-auto mb-12 px-5">
             <!-- Left Spacer -->
            <div></div>

            <!-- Deer Button -->
            <button class="w-14 h-14 rounded-full border border-white flex justify-center items-center p-2 bg-transparent hover:bg-white/10 transition-colors" @click="PN_Intro()">
              <span class="text-xl leading-none text-[#fffff]">{{state}}/7</span>
            </button>

            <!-- Skip button -->
            <div class="flex justify-end">
              <button class="w-14 h-14 rounded-full border border-[#666666] flex justify-center items-center p-2 transition-colors" @click="PN_Intro_Skip()">
                <span class="text-md leading-none text-[#666666]">skip</span>
              </button>
            </div>
          </footer>
        </motion.div>
      </div>


      <!-- State 6 Footer -->
      <div v-else-if="state == 6" key="state6">
        <motion.div
          :initial="{ opacity: 0, y: 0 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 1 }"
          class="w-full"
        >
          <footer class="grid grid-cols-[1fr_auto_1fr] items-center w-full mt-auto mb-12 px-5">
             <!-- Left Spacer -->
            <div></div>

            <!-- Deer Button -->
            <button class="w-14 h-14 rounded-full border border-white flex justify-center items-center p-2 bg-transparent hover:bg-white/10 transition-colors" @click="PN_Intro()">
              <span class="text-xl leading-none text-[#fffff]">{{state}}/7</span>
            </button>

            <!-- Skip button -->
            <div class="flex justify-end">
              <button class="w-14 h-14 rounded-full border border-[#666666] flex justify-center items-center p-2 transition-colors" @click="PN_Intro_Skip()">
                <span class="text-md leading-none text-[#666666]">skip</span>
              </button>
            </div>
          </footer>
        </motion.div>
      </div>




      <!-- State 7 Footer -->
      <div v-else-if="state == 7" key="state7">
        <motion.div
          :initial="{ opacity: 0, y: 0 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 1 }"
        >
          <footer class="flex justify-center items-center w-full mt-auto mb-12 pt-4 relative">
            <!-- Deer Button -->
            <button class="w-14 h-14 rounded-full border border-white flex justify-center items-center p-2 bg-transparent hover:bg-white/10 transition-colors" @click="PN_Intro()">
              <span class="text-3xl leading-none text-[#fffff]">›</span>
            </button>
          </footer>
        </motion.div>
      </div>
      
    </transition>

    <!-- <LiffProfile /> -->
  </div>
  <!-- </MobileShell> -->
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
