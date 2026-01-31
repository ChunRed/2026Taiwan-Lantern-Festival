<script setup>
import { RouterLink, useRoute } from "vue-router";
import { onMounted, ref, computed } from "vue";
import plantData from "@/data/plantData.json";

const route = useRoute();

// --- State ---
const currentId = ref(route.query.id); // Default to Haengu if no ID provided
console.log(currentId.value);

// --- Computed ---
const currentData = computed(() => {
  return plantData.find((p) => p.id === currentId.value) || plantData[0];
});

// --- Lifecycle ---
onMounted(() => {
  const scrollContainer = document.getElementById("mobile-scroll-container");
  if (scrollContainer) {
    scrollContainer.scrollTop = 0;
  }
});

// --- Methods ---
const getImageUrl = (name) => {
  return new URL(`../assets/Middle_Deer/${name}`, import.meta.url).href;
};
</script>

<template>
  <div
    class="flex px-6 flex-col h-full relative font-sans transition-colors duration-700"
  >
    <!-- Content Container -->
    <div class="relative z-10 flex flex-col h-full">
      <!-- Header Section (Title) -->
      <div class="mt-64 mb-6">
        <h1
          class="text-2xl font-bold tracking-widest mb-1 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] tracking-[1.2em] transition-colors duration-500"
          :style="{ color: currentData.themeColor }"
        >
          {{ currentData.title }}
        </h1>
        <p
          class="text-sm uppercase tracking-[0.1em] font-light transition-colors duration-500"
          :style="{ color: currentData.themeColor }"
        >
          {{ currentData.subtitle }}
        </p>
      </div>

      <!-- Badge -->
      <div class="mb-8">
        <div
          class="inline-flex items-center text-black px-5 py-0.8 rounded-full transition-colors duration-500"
          :style="{ backgroundColor: currentData.themeColor }"
        >
          <span class="text-md tracking-widest mr-2">{{
            currentData.nameZh
          }}</span>
          <span
            class="text-sm font-light uppercase tracking-wider pl-2 border-l border-black/30"
            >{{ currentData.nameEn }}</span
          >
        </div>
      </div>

      <!-- Text Content -->
      <div
        class="space-y-6 text-md leading-6 tracking-widest text-gray-200 font-light text-justify transition-opacity duration-300"
      >
        <p>
          {{ currentData.description }}
        </p>
      </div>

      <!-- Progress Section -->
      <div class="mt-10 mb-10">
        <div class="mb-6">
          <h2
            class="text-2xl font-bold tracking-widest tracking-[0.5em] transition-colors duration-500"
            :style="{ color: currentData.themeColor }"
          >
            {{ currentData.title2 }}
          </h2>
          <p
            class="mt-2 text-[11px] uppercase tracking-[0.2em] font-light transition-colors duration-500"
            :style="{ color: currentData.themeColor }"
          >
            {{ currentData.subtitle2 }}
          </p>
        </div>

        <!-- Deer Image -->
        <div class="w-full flex justify-center my-10 relative group z-50">
          <!-- Image with consistent styling -->
          <!-- Added a subtle optional glow or effect matching the theme color if desired, 
                          but keeping it clean for now per standard request -->
          <img
            :src="getImageUrl(currentData.DeerImage)"
            :alt="currentData.nameZh"
            class="w-full h-auto object-contain drop-shadow-2xl transition-all duration-700 hover:scale-[1.02]"
          />
        </div>

        <!-- Text Content -->
        <div
          class="space-y-6 text-md leading-6 tracking-widest text-gray-200 font-light text-justify transition-opacity duration-300"
        >
          <p>
            {{ currentData.description2 }}
          </p>
        </div>
      </div>

      <!-- Bottom Arrow -->
      <div class="flex justify-center pb-2 mb-20">
        <RouterLink
          to="/library"
          class="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5"
        >
          <span class="text-3xl leading-none text-white/70"> ‹ </span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
