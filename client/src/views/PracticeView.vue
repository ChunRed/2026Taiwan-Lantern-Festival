<script setup>
  import{  ref, reactive, watch, computed, onMounted } from "vue";
  import { motion } from "motion-v";

  import ComTest from "../components/com_test.vue";
  import MobileShell from "../components/MobileShell.vue";
  import ScrollTriggerPlayground from "../components/ScrollTriggerPlayground.vue";

  import MotionPathDemo from "../components/MotionPathDemo.vue"

  const count  = ref(0);

  //reactive 可被 watch 監聽
  const data = reactive({
    name: "huang",
    age: 25,
  });


  const increment = () => {
    count.value += 1;
  };

  const check = computed({
    get : () => {
      return data.age > 18 ? "成年" : "未成年" ;
    },

    set : (value) => {
      data.age = value;
    },
    
  });


  setTimeout(() => {
    data.name = "GRed";
    check.value = 17
  }, 2000);



  watch(data, () => {
    console.log("data被更動了");
    
  });



  onMounted(() => {
    console.log(count.value);
  });


  

</script>

<template>
  <!-- <MobileShell> -->
    <!-- Previous Content -->
    <div class="p-6 text-2xl font-bold text-center text-white">
      Tailwind OK ✅
    </div>

    <div>
      <h1 class="text-white">test: {{ count }}</h1>
      <button class="bg-sky-500/50 p-3 m-2 text-white" @click="increment"> Count is {{ count }}</button>

      <div class="text-white">name: {{ data.name }}</div>
      <div class="text-white">name: {{ data.age }}</div>
      <div class="text-white">name: {{ check }}</div>

      <ComTest Name= "chun-huang"  Age="26" />

    </div>
    
    <div class="p-8">
    <motion.div
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 3 }"
    >
      👋 Hello Motion!
    </motion.div>
    </div>
    
    <MotionPathDemo/>

    
</template>

<style >

</style>
