<script setup>
import intro_library from "../assets/Intro_library.png";
import { motion } from "motion-v";
import { ref, onMounted } from "vue";
</script>

<template>
  <motion.div
    :initial="{ opacity: 0, y: 0, scale: 1 }"
    :animate="{ opacity: 1, y: 0, scale: 1 }"
    :transition="{ duration: 1, delay: 0 }"
  >
    <img
      :src="intro_library"
      alt="Intro Library"
      class="w-full h-full object-contain"
    />
  </motion.div>
</template>
