


<script setup>
    import { gsap } from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import { onMounted, onUnmounted, ref, computed } from "vue";
    import { useRoute } from "vue-router";
    import plantData from '../data/plantData.json';

    const route = useRoute();

    // --- State ---
    const currentId = ref(route.query.id || 'haengu'); // Default to Haengu

    // --- Computed ---
    const currentData = computed(() => {
        return plantData.find(p => p.id === currentId.value) || plantData[0];
    });



    gsap.registerPlugin(ScrollTrigger);

    const gsapAN = ()=>{
        gsap.to(".icon1", {
                    duration: 3,
                    rotation: 100,
                    opacity: 0.2,
                    y:-100,
                    scrollTrigger: {
                        trigger: ".Layer",
                        scroller: "#mobile-scroll-container",
                        start: "top top", 
                        end: "+=600",
                        scrub: true, 
                }
            });
        gsap.to(".icon2", {
                    duration: 3,
                    rotation: -100,
                    opacity: 0.2,
                    y:100,
                    scrollTrigger: {
                        trigger: ".Layer",
                        scroller: "#mobile-scroll-container",
                        start: "top top", 
                        end: "+=600",
                        scrub: true, 
                }
            });
    }

    // Helper to resolve images dynamically
    const getImageUrl = (name) => {
        return new URL(`../assets/${name}`, import.meta.url).href;
    };
        
    
    
    onMounted(() => {
        // Ensure DOM is ready
        setTimeout(() => {
            gsapAN();
            ScrollTrigger.refresh();
        }, 100);
    });

    onUnmounted(() => {
        ScrollTrigger.getAll().forEach(t => t.kill());
    });
</script>


<template>
    <div class="Layer absolute w-full h-full left-0 top-0 z-0">
        
        <!-- Fixed Background Images -->
        <div class=" absolute inset-x-0 top-0 h-screen sticky pointer-events-none z-0 overflow-hidden">
             <!-- Top Left Image -->
             <img :src="getImageUrl(currentData.image)" class="icon1 absolute top-14 -left-10 w-[250px] rotate-180" alt="" />
             
             <!-- Center Right Image -->
             <img :src="getImageUrl(currentData.image)" class="icon2 absolute top-40 left-48 w-[250px] " alt="" />
        </div>
    </div>
</template>
