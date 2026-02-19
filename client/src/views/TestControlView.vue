<script setup>
import { ref } from "vue";
import { useGenStore } from "../stores/Gen.js";

const genStore = useGenStore();

const inputBeaconStatus = ref(2);

const toggleTrigger = () => {
  genStore.toggleManualTrigger(Number(inputBeaconStatus.value));
};

// Helper to resolve images from assets folder
const getImageUrl = (name) => {
  return new URL(`../assets/${name}`, import.meta.url).href;
};

const plants = [
  { zh: "赤榕", en: "Ficus subpisocarpa", img: "赤榕W.png" },
  { zh: "金草蘭", en: "Cymbidium kanran", img: "金草蘭W.png" },
  { zh: "構樹", en: "Broussonetia papyrifera", img: "構樹W.png" },
  { zh: "月桃", en: "Alpinia katsumadai", img: "月桃W.png" },
  { zh: "青剛櫟", en: "Quercus glauca", img: "青剛櫟W.png" },
  { zh: "小葉桑", en: "Morus australis", img: "小葉桑W.png" },
  { zh: "五節芒", en: "Haengu", img: "五節芒W.png" },
  { zh: "穀穗", en: "Oryza sativa", img: "穀穗W.png" },
  
];

const resetAll = () => {
  genStore.ItemScale = [0, 0, 0, 0, 0, 0, 0, 0];
};

const randomizeAll = () => {
  genStore.ItemScale = genStore.ItemScale.map(() =>
    Math.floor(Math.random() * 101)
  );
};

const triggerSpecialEvent = () => {
  console.log("Special Event Triggered!");
  alert("Special Event Triggered!");
};
</script>

<template>
  <div class="min-h-screen bg-black text-white p-6 font-sans">
    <h1 class="text-3xl font-bold mb-8 text-center tracking-widest">
      TEST CONTROL
    </h1>

    <!-- Global Controls -->
    <div class="flex gap-4 justify-center mb-10">
      <button
        @click="resetAll"
        class="px-6 py-3 bg-white/20 border border-white/80 rounded-lg font-bold tracking-wider transition-colors"
      >
        RESET
      </button>
      <button
        @click="randomizeAll"
        class="px-6 py-3 bg-white/20 border border-white/80 rounded-lg font-bold tracking-wider transition-colors"
      >
        RANDOM
      </button>
      <button
        @click="triggerSpecialEvent"
        class="px-6 py-3 bg-white/20 border border-white/80 rounded-lg font-bold tracking-wider transition-colors"
      >
        SPECIAL EVENT
      </button>
    </div>

    <!-- Trigger Toggle Button -->
    <div class="flex items-center justify-center -mt-6 mb-8 gap-2">
      <div class="text-white font-bold text-shadow bg-white/20 px-2 py-1 rounded backdrop-blur-sm">
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

    <!-- Plant Grid -->
    <div
      class="grid grid-cols-1 gap-6 max-w-md mx-auto"
    >
      <div
        v-for="(plant, index) in plants"
        :key="index"
        class="bg-white/10 border border-white/20 rounded-xl p-4 flex flex-col items-center gap-4 transition-all hover:bg-white/15"
      >
        <!-- Header: Name -->
        <div class="text-center">
          <h2 class="text-xl font-bold tracking-widest">{{ plant.zh }}</h2>
          <p class="text-xs text-white/50 italic">{{ plant.en }}</p>
        </div>

        <!-- Image -->
        <div
          class="w-24 h-24 rounded-full border-2 border-white/30 overflow-hidden bg-black/40"
        >
          <img
            :src="getImageUrl(plant.img)"
            :alt="plant.zh"
            class="w-full h-full object-cover opacity-90"
          />
        </div>

        <!-- Controls -->
        <div class="w-full space-y-3 mt-2">
          <!-- Quantity Input -->
          <div
            class="flex items-center justify-between bg-black/30 p-2 rounded-lg"
          >
            <span class="text-sm font-medium text-white/80">Qty (0-100)</span>
            <input
              type="number"
              v-model="genStore.ItemScale[index]"
              min="0"
              max="100"
              class="w-16 bg-transparent border-b border-white/30 text-center focus:outline-none focus:border-white transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
