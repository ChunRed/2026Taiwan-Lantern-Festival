<template>
    
    <div class="Modal1 absolute top-40  size-24 text-white z-50" > 
        <img 
            src="../assets/deer-sm-1.png" 
            alt="Deer"
            class="h-full w-full object-cover opacity-100"
             />
    </div>
</template>



<script setup>
    import { gsap } from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import { onMounted, onUnmounted } from "vue";

    
    const gsapAN = ()=>{
        var tl = gsap.timeline();
        tl.fromTo(".Modal1", { x: 500, rotate:-25  }, { x: 220, duration: 3 })
            .to(".Modal1",{  rotate:-40, duration: 1 }, "-=0.75")
            .to(".Modal1",{   x: 500, rotate:-20 , duration: 1 });
    }
        
    
    
    onMounted(() => {
     // 執行 gsap 動畫
        gsapAN();
    });






</script>

