<template>
  <div class="min-h-screen bg-black text-white selection:bg-rose-500 selection:text-white">
    <!-- 模擬手機安全區 (Centered container) -->
    <div class="mx-auto min-h-screen max-w-[420px] bg-black relative">
      
      <!-- Top header (Sticky at top) -->
      <div class=" top-0 z-50 px-6 pt-3 pb-12 bg-gradient-to-b from-black via-black/90 to-transparent">
        <!-- Section title -->
        <div class="mt-6 flex items-center gap-4 pl-1">
          <div class="text-lg tracking-[0.35em] font-bold text-gray-200">圖 鑑</div>
          <div class="text-white/20 text-sm">|</div>
          <div class="text-lg tracking-[0.35em] font-normal text-gray-400">LIBRARY</div>
        </div>
      </div>

      <!-- 卡片 stacking 區塊 -->
      <main class="relative px-1 pb-48">
        <!-- Card Loop -->
        <article
          v-for="(c, i) in cards"
          :key="c.zh"
          class="stack-card sticky mb-8 overflow-hidden rounded-[32px] border border-white/10 shadow-2xl origin-top"
          :style="{ 
             top: `calc(110px + ${i * 30}px)`,
             zIndex: i + 1,
             willChange: 'transform, filter'
          }"
        >
            <!-- Background -->
            <div 
              class="absolute inset-0 z-0 transition-transform duration-700" 
              :style="{ background: `linear-gradient(180deg, ${c.gradFrom} 0%, ${c.gradTo} 80%, #111 100%)` }"
            ></div>
            
            <!-- Content -->
            <div class="relative z-10 flex min-h-[180px] flex-col p-6">
              <div class="flex items-start gap-5">
                <!-- Icon Circle -->
                <div class="shrink-0 pt-1">
                  <div class="grid h-[88px] w-[88px] place-items-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm shadow-inner overflow-hidden">
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
                    <h2 class="text-[26px] font-bold tracking-[0.4em] text-white drop-shadow-md">
                      {{ c.zh }}
                    </h2>
                    <!-- Arrow Btn -->
                    <div class="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5">
                      <span class="text-lg leading-none text-white/70">›</span>
                    </div>
                  </div>

                  <p class="mt-1 text-base tracking-wider text-white/80 italic font-serif">
                    {{ c.en }}
                  </p>

                  <!-- Badge -->
                  <div class="mt-4 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-3 py-1 backdrop-blur-md">
                   <div class="h-1.5 w-1.5 rounded-full bg-white"></div>
                   <span class="text-xs font-bold text-white">{{ c.percent }}%</span>
                  </div>
                </div>
              </div>

              <!-- Legend -->
              <div class="mt-8 rounded-2xl border border-white/10 bg-black/10 p-5 backdrop-blur-md">
                  <div class="mb-2 flex justify-between text-[10px] font-medium tracking-widest text-white/50 uppercase">
                    <span>Maturity</span>
                    <span>Collection</span>
                  </div>
                  
                  <div class="relative h-2 w-full rounded-full bg-white/10">
                     <div class="absolute left-0 top-0 h-full rounded-full bg-white/80" style="width: 75%"></div>
                  </div>

                  <div class="mt-4 flex justify-between text-center">
                     <div v-for="step in [25, 50, 75, 100]" :key="step" class="flex flex-col items-center gap-1">
                        <div class="h-10 w-10 rounded-full border border-white/20 bg-white/5 transition hover:bg-white/10 hover:scale-110"></div>
                        <span class="text-[10px] text-white/40">{{ step }}%</span>
                     </div>
                  </div>
              </div>
            </div>
        </article>
      </main>

       <!-- Footer Spacer / Hint -->
       <div class="pointer-events-none fixed bottom-0 left-0 right-0 z-50 h-32 bg-gradient-to-t from-black via-black/80 to-transparent" />
       
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Helper to resolve images from assets folder
const getImageUrl = (name) => {
  return new URL(`../assets/${name}`, import.meta.url).href;
};

const cards = [
  {
    zh: "構樹", 
    en: "Broussonetia papyrifera",
    percent: 10,
    gradFrom: "#F5B7FF",
    gradTo: "rgba(0,0,0, 1)",
    img: "構樹W.png"
  },
  {
    zh: "月桃", 
    en: "Alpinia katsumadai",
    percent: 10,
    gradFrom: "#C8AAFF",
    gradTo: "rgba(0,0,0, 1)",
    img: "月桃W.png"
  },
  {
    zh: "青剛櫟", 
    en: "Quercus glauca",
    percent: 10,
    gradFrom: "#517ADA",
    gradTo: "rgba(0,0,0, 1)",
    img: "青剛櫟W.png"
  },
  {
    zh: "小葉桑", 
    en: "Morus australis",
    percent: 10,
    gradFrom: "#01B9FF",
    gradTo: "rgba(0,0,0, 1)",
    img: "小葉桑W.png"
  },
  {
    zh: "五節芒",
    en: "Haengu",
    percent: 75,
    gradFrom: "#6FC8D7",
    gradTo: "rgba(0,0,0, 1)",
    img: "五節芒W.png"
  },
  {
    zh: "赤榕",
    en: "Ficus subpisocarpa",
    percent: 25,
    gradFrom: "#51CCB4",
    gradTo: "rgba(0,0,0, 1)",
    img: "赤榕W.png"
  },
  {
    zh: "穀穗",
    en: "Oryza sativa",
    percent: 75,
    gradFrom: "#FFF2A6",
    gradTo: "rgba(0,0,0, 1)",
    img: "穀穗W.png"
  },
  {
    zh: "金草蘭",
    en: "Cymbidium kanran",
    percent: 100,
    gradFrom: "#FFC3CC",
    gradTo: "rgba(0,0,0, 1)",
    img: "金草蘭W.png"
  },
];

let ctx;

onMounted(() => {
  ctx = gsap.context(() => {
    const cardEls = gsap.utils.toArray(".stack-card");
    const headerOffset = 110; 
    const stackGap = 35; // User changed this to 35 previously

    // Explicitly set initial state INCLUDING blur to enable interpolation from 0px
    gsap.set(cardEls, { 
      filter: "brightness(1) blur(0px)", 
      scale: 1, y: 0 
    });

    cardEls.forEach((card, i) => {
      const nextCard = cardEls[i + 1];
      if (!nextCard) return;

      const nextCardStickyTop = headerOffset + (i + 1) * stackGap;
      
      gsap.to(card, {
        scale: 0.7 + (0.05 * i), // Smaller scale for deeper cards       
        // Dynamic blur logic user requested:
        filter: "brightness(0.5) blur("+ ( cardEls.length - i ) +"px)", 
        y: -10,
        transformOrigin: "center top",
        ease: "none",
        scrollTrigger: {
          trigger: nextCard,
          start: `top ${nextCardStickyTop + 300}px`, 
          end: `top ${nextCardStickyTop}px`, 
          scrub: true,
        }
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
