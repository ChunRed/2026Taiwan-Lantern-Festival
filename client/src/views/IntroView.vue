<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import gsap from "gsap";

import { motion } from "motion-v";

const router = useRouter();
const containerRef = ref(null);

// Configuration for glowing particles
const isNavigating = ref(false);

const navigateHome = () => {
  if (isNavigating.value) return;
  isNavigating.value = true;

  const tl = gsap.timeline({
    onComplete: () => {
      router.push("/home");
    },
  });

  // 1. Fade out text and button immediately
  tl.to(".intro-text, .intro-btn", {
    y: 20,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: "power2.in",
  });

  // 3. Moon/Deer Zoom effect & Fade out
  tl.to(
    ".moon-composition",
    {
      scale: 3,
      opacity: 0,
      filter: "blur(10px)",
      duration: 1.2,
      ease: "power2.inOut",
    },
    "<0.2",
  ); // slightly overlapped

  // 4. Optional: Flash of light or fade to black?
  // Since background is black, fading out elements works perfectly.
};

onMounted(() => {
  // Wait for DOM
  const ctx = gsap.context(() => {
    // // Main Deer/Moon Glow Pulse
    // gsap.to('.moon-glow', {
    //     boxShadow: "0 0 80px 30px rgba(100, 149, 237, 0.4)",
    //     scale: 1.05,
    //     duration: 4,
    //     repeat: -1,
    //     yoyo: true,
    //     ease: "sine.inOut"
    // });

    // Animate Decor Particles (Stacked PNG Layers)
    // Subtle breathing/twinkle effect
    // gsap.fromTo('.particle-layer', {
    //     opacity: 0,
    // },{
    //     opacity: 0.3,
    //     duration: 2,
    //     delay:4,
    // });

    gsap
      .fromTo(
        ".particle-layer",
        {
          opacity: 0,
        },
        {
          opacity: 0.3,
          duration: 1,
        },
      )
      .delay(5);

    gsap
      .to(".particle-layer", {
        opacity: 1,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          amount: 1,
          from: "random",
        },
      })
      .delay(1);

    gsap.to(".particle-layer", {
      scale: 1.1,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: {
        amount: 2,
        from: "end",
      },
    });
  }, containerRef.value);

  return () => ctx.revert();
});
</script>

<template>
  <div
    ref="containerRef"
    class="w-full flex-1 flex flex-col items-center justify-between py-10 text-center relative overflow-hidden"
  >
    <!-- Center Content Area -->
    <div
      class="relative w-full flex-1 flex flex-col items-center justify-center mt-5"
    >
      <!-- Moon/Deer Composition -->
      <div class="moon-composition relative z-10">
        <!-- Main Moon Circle -->
        <div class="relative w-60 h-60 flex items-center justify-center">
          <!-- Background Image -->
          <!-- <img
            src="@/assets/Intro/I_IconBG.png"
            alt="Moon Background"
            class="absolute inset-0 w-full h-full object-contain blur-sm"
          /> -->

          <!-- Deer Image -->
          <motion.div
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 1, delay: 0 }"
            class="flex flex-col items-start"
          >
            <img
              src="@/assets/Intro_logo.png"
              alt="Deer"
              class="w-80 h-auto object-contain relative z-20 translate-y-3 drop-shadow-[-6px_5px_4px_rgba(0,0,0,0.6)]"
            />
          </motion.div>

          <!-- <motion.div
                        :initial="{ opacity: 0, y: 30 }"
                        :animate="{ opacity: 1, y: 0 }"
                        :transition="{ duration: 3, delay: 4 }"
                    > -->
          <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none z-30 flex items-center justify-center"
          >
            <img
              src="@/assets/Intro/I_particle1.png"
              class="absolute w-full h-full object-contain particle-layer layer-1"
            />
            <img
              src="@/assets/Intro/I_particle2.png"
              class="absolute w-full h-full object-contain particle-layer layer-2"
            />
            <img
              src="@/assets/Intro/I_particle3.png"
              class="absolute w-full h-full object-contain particle-layer layer-3"
            />
          </div>
          <!-- </motion.div> -->
        </div>
      </div>
    </div>

    <!-- Text Section -->
    <motion.div
      :initial="{ opacity: 0, y: 0 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 1, delay: 1.5 }"
    >
      <div class="relative z-20 space-y-3 mt-20 mb-14 intro-text">
        <p
          class="text-sm tracking-[0.2em] font-light text-gray-100 drop-shadow-md"
        >
          一個能夠掌握足夠的山林智慧
        </p>
        <p
          class="text-sm tracking-[0.2em] font-light text-gray-100 drop-shadow-md"
        >
          並謹遵 einu的獵人
        </p>
        <p
          class="text-sm tracking-[0.2em] font-light text-gray-100 drop-shadow-md"
        >
          才是受大家景仰
        </p>
        <p
          class="text-sm tracking-[0.2em] font-light text-gray-100 drop-shadow-md"
        >
          也能守護這塊土地與神靈的獵人
        </p>
      </div>
    </motion.div>

    <!-- Navigation Button -->
    <div class="relative z-30 mb-4 intro-btn">
      <button
        @click="navigateHome"
        class="group w-16 h-16 rounded-full border border-gray-400 flex items-center justify-center hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-sm cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1"
          stroke="currentColor"
          class="w-8 h-8 text-gray-300 group-hover:text-white group-hover:translate-x-1 transition-transform"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Custom animations can go here if distinct from GSAP or Tailwind */
</style>
