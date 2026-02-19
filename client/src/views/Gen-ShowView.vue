<template>
  <div class="flex flex-col relative w-full h-full">
    <CrossOverlay />
    <ExplosionEffect 
      v-if="showExplosion" 
      :colors="explosionColors" 
      :particleCount="explosionConfig.particleCount"
      :minSize="explosionConfig.minSize"
      :maxSize="explosionConfig.maxSize"
      :minForce="explosionConfig.minForce"
      :maxForce="explosionConfig.maxForce"
      :duration="explosionConfig.duration"
    />
    <div
      class="absolute top-0 left-0 z-0 w-full h-[500px] overflow-hidden bg-[#000000]"
    >
      
    </div>

    <div class="relative z-10 top-[0px] w-full">
      <div v-if="genStore.gen.length > 0">
        <!-- Add Image Here -->
        <div class="flex justify-center mb-4 ">
            <img src="../assets/Gen_Image/Example.png" alt="Example Image" class="w-full h-auto" />
        </div>

        <!-- 藍色漸層 -->
        <div
          class="relative -top-24 left-0 z-10 w-full h-24 bg-gradient-to-t from-[#517ADA] to-black-500"
        ></div>


        <div class="relative -top-12 text-white mt-3 text-[24px] font-bold text-center">
          你獲得了一隻ＯＯＯ鹿!
        </div>
        <Gen_Information
          :Gen="genStore.gen"
          :Rate="genStore.SelectedItemRate"
        
        />
      </div>

      <div v-else>
        <div class="text-white mt-3 text-[18px] font-bold text-center mb-3">
          你還沒有選擇任何元素，請選擇元素!
        </div>
        <!-- Button -->
        <div class="flex justify-center">
          <RouterLink
            to="/gen-choose"
            class="flex h-12 w-12 items-center justify-center rounded-full border border-[#ffffff] bg-black/60"
          >
            <span class="text-3xl leading-none text-[#ffffff]"> › </span>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Gen_Information from "../components/Gen_Information.vue";
import ExplosionEffect from "../components/ExplosionEffect.vue";
import CrossOverlay from "../components/CrossOverlay.vue";
import { useGenStore } from "../stores/Gen.js";
import { ref, onMounted } from "vue";

const genStore = useGenStore();
const showExplosion = ref(true);

// Colors for the explosion effect (easily adjustable)
const explosionColors = ['#C8AAFF', '#ffffff', '#7093FF', '#FFF2A6'] ;

// Particle Settings (Adjust here)
const explosionConfig = {
  particleCount: 100, // Quantity of particles (Density)
  minSize: 4,         // Minimum size of particles
  maxSize: 60,        // Maximum size of particles
  minForce: 3,        // Minimum explosion force (velocity)
  maxForce: 12,        // Maximum explosion force (velocity)
  duration: 8000      // Duration in milliseconds
};

onMounted(() => {
  // Remove the explosion effect after duration to free up resources
  setTimeout(() => {
    showExplosion.value = false;
  }, explosionConfig.duration);
});
</script>
