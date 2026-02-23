<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useGenStore } from "@/stores/Gen";
import { motion } from "motion-v";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

const genStore = useGenStore();
const pathOpacity = ref(1);

watch(() => genStore.isTriggerActive, (active) => {
  pathOpacity.value = active ? 0 : 1;
}, { immediate: true });


onMounted(() => {

});

</script>

<template>
  <!-- MP01 -->
  <svg
    viewBox="0 0 450 600"
    class="absolute top-0 left-0 w-full h-full pointer-events-none"
  >
    <motion.path
      id="path1"
      d="M306.338 531.482C362.366 556.359 416.236 539.741 423.997 493.173C427.562 471.78 423.488 440.934 395.473 424.516C363.876 405.997 303.883 409.303 266.099 396.654C211.044 378.223 174.888 347.715 168.776 344.729C162.664 341.744 160.253 342.753 160.627 347.715C163.173 381.546 229.599 497.411 306.338 531.482Z"
      stroke="#ffffff"
      stroke-width="1"
      fill="none"
      
      :initial="{ pathLength: 0 }"
      :animate="{ pathLength: 1 }"
      :transition="{ duration: 3, ease: 'easeInOut', delay: 0 }"
      class="blur-[2px] transition-opacity duration-500"
      :style="{ opacity: pathOpacity }"
    />
    
  </svg>

  <!-- MP05 -->
  <svg
    viewBox="0 0 450 600"
    class="absolute top-0 left-0 w-full h-full pointer-events-none"
  >
    <motion.path
      id="path2"
      class="blur-[3px] transition-opacity duration-500"
      :style="{ opacity: pathOpacity }"
      d="M253.271 79.7686C247.054 94.5416 232.508 99.2369 219.145 111.112C198.867 129.134 181.395 66.1337 217.022 50.0133C225.973 45.9635 239.519 45.6865 247.668 51.4097C257.759 58.4959 256.48 72.1438 253.271 79.7686Z"
      stroke="#ffffff"
      stroke-width="2"
      fill="none"
      :initial="{ pathLength: 0 }"
      :animate="{ pathLength: 1 }"
      :transition="{ duration: 3, ease: 'easeInOut', delay: 0 }"
    />
    
  </svg>

  <!-- MP04 -->
  <svg
    viewBox="0 0 450 600"
    class="absolute top-0 left-0 w-full h-full pointer-events-none"
  >
    <motion.path
      class="blur-[5px] transition-opacity duration-500"
      :style="{ opacity: pathOpacity }"
      id="path3"
      d="M402.058 215.872C366.973 157.734 319.544 129.303 281.929 120.28C258.805 114.733 237.376 115.5 241.5 164.5C244.236 197 218.5 202.5 192.5 222.5C171.466 235.933 163.888 268.659 170 300.5C180.697 344.282 238.048 362.143 277.777 372.094C317.506 382.044 364.366 380.054 402.058 348.71C437.955 318.859 429.981 262.141 402.058 215.872Z"
      stroke="#ffffff"
      stroke-width="4"
      fill="none"
      :initial="{ pathLength: 0 }"
      :animate="{ pathLength: 1 }"
      :transition="{ duration: 3, ease: 'easeInOut', delay: 0 }"
    />
    
  </svg>

  <!-- MP03 -->
  <svg
    viewBox="0 0 450 600"
    class="absolute top-0 left-0 w-full h-full pointer-events-none"
  >
    <motion.path
      id="path5"
      class="blur-[2px] transition-opacity duration-500"
      :style="{ opacity: pathOpacity }"
      d="M223.955 146.757C230.459 164.231 219.318 178.463 206.068 184.276C178.749 196.26 152.434 228.715 147.5 258.5C138.504 312.804 150.146 378.038 92.9618 378.038C68.7667 378.038 38.7037 332.296 43.5114 279.358C48.6081 223.236 78.1594 185.694 122.949 156.522C152.935 136.991 180.519 131.648 187.129 129.796C199.755 126.712 217.45 129.282 223.955 146.757Z"
      stroke="#ffffff"
      stroke-width="1"
      fill="none"
      :initial="{ pathLength: 0 }"
      :animate="{ pathLength: 1 }"
      :transition="{ duration: 3, ease: 'easeInOut', delay: 0 }"
    />
    
  </svg>

  <!-- MP02 -->
  <svg
    viewBox="0 0 450 600"
    class="absolute top-0 left-0 w-full h-full pointer-events-none"
  >
    <motion.path
      id="path4"
      class="blur-[6px] transition-opacity duration-500"
      :style="{ opacity: pathOpacity }"
      d="M140.685 376.067C138.709 378.484 134.354 385.267 124.478 392.518C114.601 399.769 106.736 400.81 100.774 405.57C82.008 420.555 90.7587 449.39 109.17 459.711C131.681 472.329 155.614 461.145 159.944 438.909C161.83 429.225 159.944 415.222 154.018 399.27C151.76 393.191 147.949 378.621 146.611 376.067C145.273 373.512 142.66 373.65 140.685 376.067Z"
      stroke="#ffffff"
      stroke-width="4"
      fill="none"
      :initial="{ pathLength: 0 }"
      :animate="{ pathLength: 1 }"
      :transition="{ duration: 3, ease: 'easeInOut', delay: 0 }"
    />
  </svg>
</template>
