<script setup>
import intro_collect from "../assets/Intro_collect.png";
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
      :src="intro_collect"
      alt="Intro Collect"
      class="w-full h-full object-contain"
    />
  </motion.div>
</template>
