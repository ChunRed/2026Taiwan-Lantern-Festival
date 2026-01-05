<template>
    <div class="Modal1 absolute  top-0 bg-cyan-500 w-20 h-20 text-white z-50" > hello </div>
</template>

<script setup>
    import { gsap } from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import { onMounted, onUnmounted } from "vue";

    
    const gsapAN = ()=>{
        var tl = gsap.timeline();
        tl.fromTo(".Modal1", { x: -100 }, { x: 0, duration: 1 });
    }
        
    
    
    onMounted(() => {
     // 執行 gsap 動畫
        gsapAN();
    });


</script>

