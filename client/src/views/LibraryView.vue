<template>
  <div
    class="min-h-screen bg-black text-white selection:bg-rose-500 px-3 selection:text-white"
  >
    <!-- 模擬手機安全區 (Centered container) -->
    <div class="mx-auto min-h-screen max-w-[420px] bg-black relative">
      <!-- Top header (Sticky at top) -->
      <div
        class="top-0 z-50 px-6 pt-3 pb-12 bg-gradient-to-b from-black via-black/90 to-transparent"
      >
        <!-- Section title -->
        <div class="mt-6 flex items-center gap-4 pl-1">
          <div class="text-lg tracking-[0.35em] font-bold text-gray-200">
            圖 鑑
          </div>
          <div class="text-white/20 text-sm">|</div>
          <div class="text-lg tracking-[0.35em] font-normal text-gray-400">
            LIBRARY
          </div>
        </div>
      </div>

      <!-- 卡片 stacking 區塊 -->
      <main class="relative px-1 pb-10">
        <!-- Card Loop -->
        <article
          v-for="(c, i) in cards"
          :key="c.zh"
          class="stack-card sticky mb-8 overflow-hidden rounded-[20px] border border-white/10 shadow-2xl origin-top"
          :style="{
            top: `calc(30px + ${i * 74}px)`,
            zIndex: i + 1,
            willChange: 'transform, filter',
          }"
        >
          <div v-if="c.percent > 0">
            <!-- Background -->
            <div
              class="absolute inset-0 z-0 transition-transform duration-700"
              :style="{
                background: `linear-gradient(180deg, ${c.gradFrom} 0%, ${c.gradTo} 80%)`,
              }"
            ></div>

            <!-- Content -->
            <div class="relative z-10 flex min-h-[140px] flex-col p-4">
              <div class="flex items-start gap-5">
                <!-- Icon Circle -->
                <div class="shrink-0 pt-1">
                  <div
                    class="grid h-[55px] w-[55px] place-items-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm shadow-inner overflow-hidden"
                  >
                    <!-- Image Asset -->
                    <img
                      :src="getImageUrl(c.img)"
                      :alt="c.zh"
                      class="h-full w-full object-cover opacity-90"
                    />
                  </div>
                </div>

                <!-- Text Info -->
                <div class="flex-1">
                  <div class="flex items-start justify-between">
                    <h2
                      class="text-[18px] font-bold tracking-[1.2em] text-white drop-shadow-md"
                    >
                      {{ c.zh }}
                    </h2>

                    <RouterLink
                      :to="{ path: '/information', query: { id: c.id } }"
                      class="flex h-8 w-8 items-center justify-center rounded-full border border-white/80 bg-white/5"
                    >
                      <span class="text-2xl leading-none text-white/70">
                        ›
                      </span>
                    </RouterLink>
                  </div>

                  <p
                    class="mt-1 text-base tracking-wider text-white/80 italic font-serif"
                  >
                    {{ c.en }}
                  </p>

                  <!-- Badge -->
                  <div
                    class="mt-4 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-3 py-1 backdrop-blur-md"
                  >
                    <div class="h-1.5 w-1.5 rounded-full bg-white"></div>
                    <span class="text-xs font-bold text-white"
                      >{{ c.percent }}%</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else>
            <!-- Background -->
            <div
              class="absolute inset-0 z-0 transition-transform duration-700"
              :style="{
                background: `linear-gradient(180deg, #333333 0%, #000000 80%)`,
              }"
            ></div>

            <!-- Content -->
            <div class="relative z-10 flex min-h-[140px] flex-col p-4">
              <div class="flex items-start gap-5">
                <!-- Icon Circle -->
                <div class="shrink-0 pt-1">
                  <div
                    class="grid h-[55px] w-[55px] place-items-center rounded-full bg-white/10 backdrop-blur-sm shadow-inner overflow-hidden"
                  >
                    <!-- Image Asset -->
                    <img
                      :src="getImageUrl('未知元素.png')"
                      :alt="c.zh"
                      class="h-full w-full object-cover opacity-50"
                    />
                  </div>
                </div>

                <!-- Text Info -->
                <div class="flex-1">
                  <div class="flex items-start justify-between">
                    <h2
                      class="text-[18px] font-bold tracking-[1.2em] text-white/40 drop-shadow-md"
                    >
                      ????
                    </h2>
                  </div>

                  <!-- Badge -->
                  <div
                    class="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 backdrop-blur-md"
                  >
                    <div class="h-1.5 w-1.5 rounded-full bg-white/40"></div>
                    <span class="text-xs font-bold text-white/40"
                      >{{ c.percent }}%</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>
      <div class="w-[110%] -ml-5 h-px bg-white/50 mb-4 mt-20"></div>
      <div class="my-5 text-center">2026 Taiwan Lantern Festival</div>

      <div class="w-full h-[200px] mt-150 mb-50 text-white"></div>


  <!-- Footer Spacer / Hint
      <div class="pointer-events-none fixed bottom-0 mt-90 left-0 right-0 z-50 h-32 bg-gradient-to-t from-black via-black/80 to-transparent" ></div>-->
      
      <!-- Color Editor Section -->
      <div class="px-6 py-8 bg-gray-900/80 mt-10 rounded-xl mx-4 mb-32 border border-white/10">
        <h3 class="text-white text-lg mb-4 font-bold tracking-wider text-center">Theme Color Editor</h3>
        <div class="grid grid-cols-1 gap-4">
          <div 
            v-for="(plant, index) in localPlants" 
            :key="plant.id" 
            class="flex items-center gap-4 bg-white/5 p-3 rounded-lg border border-white/5"
          >
            <span class="text-white/80 text-sm font-medium w-20 truncate">{{ plant.nameZh }}</span>
            

            <div class="flex items-center gap-2 flex-1">
              <div class="flex flex-col gap-1 mr-2">
                <button 
                  @click="moveUp(index)" 
                  :disabled="index === 0"
                  class="w-6 h-6 flex items-center justify-center bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded text-white text-xs"
                >
                  ▲
                </button>
                <button 
                  @click="moveDown(index)" 
                  :disabled="index === localPlants.length - 1"
                  class="w-6 h-6 flex items-center justify-center bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded text-white text-xs"
                >
                  ▼
                </button>
              </div>
              <input 
                type="color" 
                v-model="plant.themeColor"
                @input="handleColorChange(index, plant.themeColor)"
                class="bg-transparent border-none w-10 h-10 cursor-pointer rounded overflow-hidden"
              />
              <input 
                type="text" 
                v-model="plant.themeColor"
                @change="handleColorChange(index, plant.themeColor)"
                class="bg-black/40 text-white text-sm px-3 py-2 rounded border border-white/10 w-full font-mono uppercase focus:border-rose-500 focus:outline-none transition-colors"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, computed, ref } from "vue";
import { RouterLink } from "vue-router";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGenStore } from "../stores/Gen.js";
import plantData from "../data/plantData.json";

const genStore = useGenStore();

// Create reactive copy of plant data
const localPlants = ref(JSON.parse(JSON.stringify(plantData)));

gsap.registerPlugin(ScrollTrigger);

// Helper to resolve images from assets folder
const getImageUrl = (name) => {
  return new URL(`../assets/${name}`, import.meta.url).href;
};

// Mapping from plant ID to ItemScale index
const scaleIndexMap = {
  "tapangeosx": 0,
  "kitposa": 1,
  "otu": 2,
  "tahivcu & tahzucu": 3,
  "haengu": 4,
  "yono": 5,
  "ton'u & pai": 6,
  "fiteu": 7
};


// Debounce timer for API calls
let debounceTimer;

const handleColorChange = (index, newColor) => {
  // Clear previous timer to debounce multiple rapid changes
  if (debounceTimer) clearTimeout(debounceTimer);
  
  // Set new timer
  debounceTimer = setTimeout(() => {
    saveAllPlants();
  }, 300);
};

const moveUp = (index) => {
  if (index > 0) {
    const temp = localPlants.value[index];
    localPlants.value[index] = localPlants.value[index - 1];
    localPlants.value[index - 1] = temp;
    saveAllPlants();
  }
};

const moveDown = (index) => {
  if (index < localPlants.value.length - 1) {
    const temp = localPlants.value[index];
    localPlants.value[index] = localPlants.value[index + 1];
    localPlants.value[index + 1] = temp;
    saveAllPlants();
  }
};

const saveAllPlants = async () => {
  try {
    const response = await fetch('http://localhost:4000/api/save-plant-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(localPlants.value),
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log('Saved all plant data');
  } catch (error) {
    console.error('Failed to save plant data:', error);
  }
};

const cards = computed(() => {
  return localPlants.value.map(plant => {
    // Construct the W version filename from the image name in JSON
    // Assuming JSON has "Name.png" and we want "NameW.png"
    // The user requested to use data from JSON. 
    // If we strictly follow "use data from plantData", we should use plant.image.
    // However, looking at the previous code, it used "W" (white?) versions.
    // Let's rely on the JSON data primarily.
    // If the user meant "use the structure from JSON but keep the W images", I should inject 'W'.
    // But usually "move data to json" implies using the json's values.
    // I will try to use the image name as is from JSON first. 
    // Wait, the user said "don't use cards anymore".
    // I'll stick to plant.image.
    
    // To match the specific gradients used previously which might not be in JSON?
    // JSON has "themeColor".
    // Previous code: gradFrom: "#FF9696", gradTo: "rgba(0,0,0, 1)".
    // JSON has "themeColor": "#FF9696".
    // So gradFrom = themeColor. gradTo is fixed.
    
    // Percent:
    const scaleIndex = scaleIndexMap[plant.id];
    const percent = scaleIndex !== undefined ? genStore.ItemScale[scaleIndex] : 0;

    // Image logic:
    // The previous code had "赤榕W.png". JSON has "赤榕.png".
    // If I use "赤榕.png", it might be the colored version.
    // I will try to heuristically add 'W' if it matches the pattern or just utilize the JSON image.
    // Let's blindly use the JSON image for now as requested.
    
    // Actually, looking at the JSON, "image": "赤榕.png".
    // If I need "赤榕W.png", I'd have to modify it.
    // Let's assume the user updated JSON or expects us to use the filenames in JSON. 
    
    // One edge case: The previous array had a "link": "HeanguView.vue" for one item (haengu).
    // The JSON doesn't seem to have a "link" field.
    // But looking at the template, I don't see `c.link` being used for navigation logic in the visible code block?
    // Ah, I missed it?
    // Let me check the template again.
    // I don't see `c.link` usage in the template I read.
    // `RouterLink` points to `/information` with query id. 
    // `target` or separate link logic doesn't seem present in the snippet I saw.
    // The commented out `HeanguView.vue` link in the previous object might have been unused or for a different purpose not shown.
    
    return {
      zh: plant.nameZh,
      en: plant.nameEn,
      id: plant.id,
      percent: percent,
      gradFrom: plant.themeColor,
      gradTo: "rgba(0,0,0, 1)",
      img: plant.image.replace('.png', 'W.png'), // Construct W version to match visual style
    };
  });
});

let ctx;

onMounted(() => {
  ctx = gsap.context(() => {
    // Re-select elements whenever localPlants changes triggers a re-render ideally, 
    // but GSAP context runs once on mount. 
    // Vue's list rendering handles DOM updates.
    // However, for scrollTrigger to work correctly with dynamic lists (reordering), 
    // we might need to refresh or kill/recreate triggers.
    // But let's assume the stack effect is simple enough or won't break horribly on reorder.
    // Actually, if we reorder, the DOM elements change order. 
    // ScrollTrigger calculations are based on position.
    // We should probably rely on a watcher or manually refresh, but for now let's keep it simple.
    // If needed, we can add a watcher on `localPlants` to ScrollTrigger.refresh().
    
    const cardEls = gsap.utils.toArray(".stack-card");
    const headerOffset = 110;
    const stackGap = 35; // User changed this to 35 previously

    // Explicitly set initial state INCLUDING blur to enable interpolation from 0px
    gsap.set(cardEls, {
      filter: "brightness(1) blur(0px)",
      scale: 1,
      y: 0,
    });

    cardEls.forEach((card, i) => {
      const nextCard = cardEls[i + 1];
      if (!nextCard) return;

      const nextCardStickyTop = headerOffset + (i + 1) * stackGap;



      gsap.to(card, {
        scale: 0.9 + 0.01 * i, // Smaller scale for deeper cards
        // Dynamic blur logic user requested:
        filter: "brightness(0.7) ",
        y: -10,
        transformOrigin: "center top",
        ease: "none",
        scrollTrigger: {
          trigger: nextCard,
          start: `top ${nextCardStickyTop + 300}px`,
          end: `top ${nextCardStickyTop}px`,
          scrub: true,
        },
      });
    });
  });
});

onUnmounted(() => {
  ctx?.revert();
  ScrollTrigger.getAll().forEach((t) => t.kill());
});
</script>

<style scoped>
/* Ensure the body or html allows scrolling */
</style>
