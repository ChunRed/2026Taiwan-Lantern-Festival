<script setup>
import { RouterLink, useRoute } from 'vue-router';
import { onMounted, ref, computed } from 'vue';
import plantData from '@/data/plantData.json';

const route = useRoute();

// --- State ---
const currentId = ref(route.query.id ); // Default to Haengu if no ID provided
console.log(currentId.value);

// --- Computed ---
const currentData = computed(() => {
    return plantData.find(p => p.id === currentId.value) || plantData[0];
});



// --- Lifecycle ---
onMounted(() => {
    const scrollContainer = document.getElementById('mobile-scroll-container');
    if (scrollContainer) {
        scrollContainer.scrollTop = 0;
    }
});
</script>

<template>
    <div class="flex px-6 flex-col h-full relative font-sans transition-colors duration-700">
        
        

        <!-- Content Container -->
        <div class="relative z-10 flex flex-col h-full">

            <!-- Header Section (Title) -->
            <div class="mt-64 mb-6">
                <h1 
                    class="text-2xl font-bold tracking-widest mb-1 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] tracking-[1.2em] transition-colors duration-500"
                    :style="{ color: currentData.themeColor }"
                >
                    {{ currentData.title }}
                </h1>
                <p 
                    class="text-sm uppercase tracking-[0.1em] font-light transition-colors duration-500"
                    :style="{ color: currentData.themeColor }"
                >
                    {{ currentData.subtitle }}
                </p>
            </div>  

            <!-- Badge -->
            <div class="mb-8">
                <div 
                    class="inline-flex items-center text-black px-5 py-0.8 rounded-full transition-colors duration-500"
                    :style="{ backgroundColor: currentData.themeColor }"
                >
                    <span class="text-md tracking-widest mr-2">{{ currentData.nameZh }}</span>
                    <span class="text-sm font-light uppercase tracking-wider pl-2 border-l border-black/30">{{ currentData.nameEn }}</span>
                </div>
            </div>

            <!-- Text Content -->
            <div class="space-y-6 text-md leading-6 tracking-widest text-gray-200 font-light text-justify transition-opacity duration-300">
                <p>
                    {{ currentData.description }}
                </p>
            </div>


            <!-- Progress Section -->
            <div class="mt-10 mb-10">
                <div class="mb-6">
                    <h2 
                        class="text-2xl font-bold tracking-widest tracking-[0.5em] transition-colors duration-500"
                        :style="{ color: currentData.themeColor }"
                    >
                        收集進度
                    </h2>
                    <p 
                        class="mt-2 text-sm uppercase tracking-[0.3em] font-light transition-colors duration-500"
                        :style="{ color: currentData.themeColor }"
                    >
                        Progress Bar
                    </p>
                </div>

                <!-- Custom Progress Bar -->
                <div class="relative px-2">
                    <!-- Bar Container -->
                    <div class="absolute top-1/2 left-0 w-full -translate-y-1/2 flex items-center px-4">
                        
                    </div>
                    
                

                    <!-- Circles Container -->
                    <div class="relative z-10 flex justify-between items-center w-full">
                        
                        <!-- 25% -->
                        <div class="flex flex-col items-center gap-2">
                             <div 
                                class="w-12 h-12 rounded-full border bg-black flex items-center justify-center relative overflow-hidden transition-all duration-500"
                                :style="{ borderColor: currentData.themeColor, boxShadow: `0 0 15px ${currentData.themeColor}4D` }" 
                             >
                             </div>
                             <span class="text-[10px] font-bold transition-colors duration-500" :style="{ color: currentData.themeColor }">25%</span>
                        </div>

                        <!-- 50% -->
                         <div class="flex flex-col items-center gap-2">
                             <div 
                                class="w-12 h-12 rounded-full border bg-black flex items-center justify-center relative overflow-hidden transition-all duration-500"
                                :style="{ borderColor: currentData.themeColor, boxShadow: `0 0 15px ${currentData.themeColor}4D` }"
                             >
                                 
                             </div>
                             <span class="text-[10px] font-bold transition-colors duration-500" :style="{ color: currentData.themeColor }">50%</span>
                        </div>

                        <!-- 75% -->
                         <div class="flex flex-col items-center gap-2">
                             <div 
                                class="w-14 h-14 -my-1 rounded-full border-2 bg-black flex items-center justify-center relative overflow-hidden transition-all duration-500"
                                :style="{ borderColor: currentData.themeColor, boxShadow: `0 0 20px ${currentData.themeColor}80` }"
                             >
                                
                             </div>
                             <span class="text-[10px] text-white font-bold">75%</span>
                        </div>

                        <!-- 100% -->
                         <div class="flex flex-col items-center gap-2">
                             <div class="w-12 h-12 rounded-full border border-gray-600 bg-black flex items-center justify-center relative">
                             </div>
                             <span class="text-[10px] text-gray-500 font-bold">100%</span>
                        </div>

                    </div>
                </div>
            </div>

            <!-- Bottom Arrow -->
            <div class="flex justify-center pb-2 mb-20">
                <RouterLink to="/library" class="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5">
                          <span class="text-3xl leading-none text-white/70">
                            ‹
                          </span>
                        </RouterLink>
            </div>

        </div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>