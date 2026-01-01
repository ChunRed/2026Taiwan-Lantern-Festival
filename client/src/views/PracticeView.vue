<script setup>
  import{  ref, reactive, watch, computed, onMounted } from "vue";
  import { motion } from "motion-v";

  import ComTest from "../components/com_test.vue";
  import MobileShell from "../components/MobileShell.vue";

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
    
    

    <svg width="450" height="600" viewBox="0 0 450 600" class="w-64 mx-auto">
    <motion.path
      d="M220.158 362.787H220.171M220.158 362.787C233.003 367.031 248.471 371.693 275.708 380.561C310.044 391.74 413.527 408.837 420.494 460.143C427.462 511.45 374.445 539.598 326.749 532.353C276.709 524.752 251 491.715 228 470C220.056 462.5 209.669 443.649 204.272 435.731C198.508 427.269 192.072 412.232 190.806 409.077C186.663 398.816 180.468 383.006 178.669 375.772C175.908 364.637 170.498 349.258 169.219 333.574C181.026 348.867 208.098 359.422 220.158 362.787Z"
      stroke="#ffffff"
      stroke-width="2"
      fill="none"
      :initial="{ pathLength: 0 }"
      :animate="{ pathLength: 1 }"
      :transition="{ duration: 1.2, ease: 'easeInOut' }"
    />
  </svg>
    
</template>

<style >

</style>
