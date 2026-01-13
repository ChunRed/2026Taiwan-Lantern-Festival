


<script setup>
    
    import MapImg from "../assets/Intro_library.png";
    import { motion } from "motion-v"

</script>



<template>

    
        <div class=" flex flex-col h-full px-6 py-6 text-white font-sans">
          <div class="flex-1 flex justify-center items-center w-full relative overflow-hidden my-4  ">
            <div class="relative w-full max-w-[450px]">

              <motion.div
                :initial="{ opacity: 0, y: 0, scale: 1 }"
                :animate="{ opacity: 1, y: 0 , scale: 1}"
                :transition="{ duration: 5, delay: 0}"
              >
                <img :src="MapImg" alt="Main Map" class="w-full h-full object-contain" />
              </motion.div>
            </div>
          </div>
        </div>


</template>

