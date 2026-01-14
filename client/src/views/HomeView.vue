<script setup>
  import MobileShell from "../components/MobileShell.vue";
  import MapImg from "../assets/Map.png";
  import DeerBtn from "../assets/deer_button.png";
  import { RouterLink, RouterView } from "vue-router";

  import MapPath from "../components/MapPath.vue";
  import LiffProfile from "@/components/LiffProfile.vue";

  import { motion } from "motion-v"
  import { ref, onMounted } from 'vue'
  import PN_Intro_Map from "../components/PN_Intro_Map.vue";
  import PN_Intro_Collect from "../components/PN_Intro_Collect.vue";
  import PN_Intro_Library from "../components/PN_Intro_Library.vue";
  import PN_Intro_Gen from "../components/PN_Intro_Gen.vue";


  const state = ref(0);


  const PN_Intro = () => {
    if (state.value < 4) state.value ++;
    else state.value = 0;
  }

  const PN_Intro_Skip = () => {
    state.value = 0;
  }


  setTimeout(() => {
    state.value = 1;
    
  },4000)


</script>

<template>

  <!-- <MobileShell> -->

    <div class="flex flex-col h-full px-6 py-6 text-white font-sans ">
      
     

      <!-- Main Content: Map -->
      <main class="flex-1 flex justify-center items-center w-full relative overflow-hidden my-4 ">

        <div class="relative w-full max-w-[450px]">

          <transition name="fade" mode="out-in">
            <!-- state0 -->
            <div v-if="state == 0" key="state0">
              <motion.div
                :initial="{ opacity: 0, y: 0, scale: 1.1 }"
                :animate="{ opacity: 1, y: 0 , scale: 1}"
                :transition="{ duration: 1, delay: 1 }"
              >
                <img :src="MapImg" alt="Main Map" class="w-full h-full object-contain" />
              </motion.div>
              <MapPath /> 
            </div>

            <!-- state1 -->
            <div v-else-if="state == 1" key="state1" class="w-full h-full object-contain">
              <PN_Intro_Map/>
            </div>

            <!-- state2 -->
            <div v-else-if="state == 2" key="state2" class="w-full h-full object-contain">
              <PN_Intro_Collect/>
            </div>

            <!-- state3 -->
            <div v-else-if="state == 3" key="state3" class="w-full h-full object-contain">
              <PN_Intro_Library/>
            </div>

            <!-- state4 -->
            <div v-else-if="state == 4" key="state4" class="w-full h-full object-contain">
              <PN_Intro_Gen/>
            </div>
            
          </transition>
          

        
        </div>

      </main>



      
      <transition name="fade" mode="out-in">
        <div v-if="state == 0" key="state0">
          <motion.div
            :initial="{ opacity: 0, y: 0 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 1, delay: 2 }"
          >
            <!-- Footer -->
            <footer class="flex justify-between items-center w-full mt-auto pt-4">
              <div class="text-lg tracking-[0.2em] font-light text-white">地 圖 | M A P</div>


              <button class="w-12 h-12 rounded-full border border-white flex justify-center items-center p-2 bg-transparent hover:bg-white/10 transition-colors" @click="PN_Intro()">
                <span class="text-3xl leading-none text-[#fffff]">
                  ?
                </span>
              </button>
              
              <!-- Deer Button -->
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


        <div v-else-if="state == 1" key="state1">
          <motion.div
            :initial="{ opacity: 0, y: 0 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, delay: 1 }"
          >
            <!-- Footer -->
            <footer class="flex justify-center items-center w-full mt-auto pt-4">
              
              <!-- Deer Button -->
              <button class="w-14 h-14 rounded-full border border-white flex justify-center items-center p-2 bg-transparent hover:bg-white/10 transition-colors" @click="PN_Intro()">
                <span  class="text-xl leading-none text-[#fffff]">
                  {{state}}/4
                </span>
                <!-- <span v-else class="text-3xl leading-none text-[#fffff]">
                  ›
                </span> -->
              </button>

              <!-- Skip button -->
              <button class="absolute right-5 w-14 h-14 rounded-full border border-[#666666] flex justify-center items-center p-2  transition-colors" @click="PN_Intro_Skip()">
                <span  class="text-md leading-none text-[#666666]">
                  skip
                </span>
              </button>
            </footer>
          </motion.div>
        </div>


        <div v-else-if="state == 2" key="state2">
          <motion.div
            :initial="{ opacity: 0, y: 0 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, delay: 1 }"
          >
            <!-- Footer -->
            <footer class="flex justify-center items-center w-full mt-auto pt-4">
              
              <!-- Deer Button -->
              <button class="w-14 h-14 rounded-full border border-white flex justify-center items-center p-2 bg-transparent hover:bg-white/10 transition-colors" @click="PN_Intro()">
                <span  class="text-xl leading-none text-[#fffff]">
                  {{state}}/4
                </span>
              </button>

              <!-- Skip button -->
              <button class="absolute right-5 w-14 h-14 rounded-full border border-[#666666] flex justify-center items-center p-2  transition-colors" @click="PN_Intro_Skip()">
                <span  class="text-md leading-none text-[#666666]">
                  skip
                </span>
              </button>
            </footer>
          </motion.div>
        </div>


        <div v-else-if="state == 3" key="state3">
          <motion.div
            :initial="{ opacity: 0, y: 0 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, delay: 1 }"
          >
            <!-- Footer -->
            <footer class="flex justify-center items-center w-full mt-auto pt-4">
              
              <!-- Deer Button -->
              <button class="w-14 h-14 rounded-full border border-white flex justify-center items-center p-2 bg-transparent hover:bg-white/10 transition-colors" @click="PN_Intro()">
                <span  class="text-xl leading-none text-[#fffff]">
                  {{state}}/4
                </span>
                </button>

              <!-- Skip button -->
              <button class="absolute right-5 w-14 h-14 rounded-full border border-[#666666] flex justify-center items-center p-2  transition-colors" @click="PN_Intro_Skip()">
                <span  class="text-md leading-none text-[#666666]">
                  skip
                </span>
              </button>
            </footer>
          </motion.div>
        </div>


        <div v-else-if="state == 4" key="state4">
          <motion.div
            :initial="{ opacity: 0, y: 0 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, delay: 1 }"
          >
            <!-- Footer -->
            <footer class="flex justify-center items-center w-full mt-auto pt-4">
              
              <!-- Deer Button -->
              <button class="w-14 h-14 rounded-full border border-white flex justify-center items-center p-2 bg-transparent hover:bg-white/10 transition-colors" @click="PN_Intro()">
                
                <span  class="text-3xl leading-none text-[#fffff]">
                  ›
                </span>
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
