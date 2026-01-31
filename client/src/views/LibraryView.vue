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
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import { RouterLink } from "vue-router";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGenStore } from "../stores/Gen.js";

const genStore = useGenStore();

gsap.registerPlugin(ScrollTrigger);

// Helper to resolve images from assets folder
const getImageUrl = (name) => {
  return new URL(`../assets/${name}`, import.meta.url).href;
};

const cards = [
  {
    zh: "構樹",
    en: "tapangeosx",
    id: "tapangeosx",
    percent: genStore.ItemScale[0],
    gradFrom: "#F5B7FF",
    gradTo: "rgba(0,0,0, 1)",
    img: "構樹W.png",
  },
  {
    zh: "月桃",
    en: "kitposa",
    id: "kitposa",
    percent: genStore.ItemScale[1],
    gradFrom: "#C8AAFF",
    gradTo: "rgba(0,0,0, 1)",
    img: "月桃W.png",
  },
  {
    zh: "青剛櫟",
    en: "otu",
    id: "otu",
    percent: genStore.ItemScale[2],
    gradFrom: "#517ADA",
    gradTo: "rgba(0,0,0, 1)",
    img: "青剛櫟W.png",
  },
  {
    zh: "小葉桑",
    en: "tahivcu & tahzucu",
    id: "tahivcu & tahzucu",
    percent: genStore.ItemScale[3],
    gradFrom: "#01B9FF",
    gradTo: "rgba(0,0,0, 1)",
    img: "小葉桑W.png",
  },
  {
    zh: "五節芒",
    en: "haengu",
    id: "haengu",
    percent: genStore.ItemScale[4],
    gradFrom: "#6FC8D7",
    gradTo: "rgba(0,0,0, 1)",
    img: "五節芒W.png",
    link: "HeanguView.vue",
  },
  {
    zh: "赤榕",
    en: "yono",
    id: "yono",
    percent: genStore.ItemScale[5],
    gradFrom: "#51CCB4",
    gradTo: "rgba(0,0,0, 1)",
    img: "赤榕W.png",
  },
  {
    zh: "穀穗",
    en: "ton'u & pai",
    id: "ton'u & pai",
    percent: genStore.ItemScale[6],
    gradFrom: "#FFF2A6",
    gradTo: "rgba(0,0,0, 1)",
    img: "穀穗W.png",
  },
  {
    zh: "金草蘭",
    en: "fiteu",
    id: "fiteu",
    percent: genStore.ItemScale[7],
    gradFrom: "#FFC3CC",
    gradTo: "rgba(0,0,0, 1)",
    img: "金草蘭W.png",
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
