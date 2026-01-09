<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <div class="flex flex-col h-full relative font-sans">
        
        <!-- Header Section (Title) -->
        <div class="mt-8 mb-6">
            <h1 class="text-lg font-bold tracking-widest text-[#96C8FF] mb-1 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] tracking-[0.8em]">
                生態復甦的守望者
            </h1>
            <p class="text-xs uppercase tracking-[0.2em] text-[#96C8FF] font-light">
                Guardian of Ecological Revival
            </p>
        </div>

        <!-- Badge -->
        <div class="mb-8">
            <div class="inline-flex items-center bg-[#96C8FF] text-black px-5 py-0.8 rounded-full">
                <span class="text-md  tracking-widest mr-2">五節芒</span>
                <span class="text-sm font-light uppercase tracking-wider pl-2 border-l border-black/30">Haengu</span>
            </div>
        </div>

        <!-- Text Content -->
        <div class="space-y-6 text-sm leading-6 tracking-widest text-gray-200 font-light text-justify">
            <p>
                梅花鹿會經因人為活動而銳減，卻在近代復育中逐漸回歸山林。牠象徵自然自我療癒的能力，也成為守望者般的存在，提醒人們生態修復與土地保護的責任。鹿的再現，不僅是族群記憶的回歸，更是一種關於永續與希望的見證。
            </p>
        </div>


        <!-- Progress Section -->
        <div class="mt-10 mb-10">
            <div class="mb-6">
                <h2 class="text-md font-bold tracking-widest text-[#96C8FF] tracking-[1.4em]">收集進度</h2>
                <p class="mt-2 text-xs uppercase tracking-[0.3em] text-[#96C8FF] font-light">Progress Bar</p>
            </div>
        </div>

        <!-- Bottom Arrow -->
        <div class="flex justify-center pb-4">
             <div class="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group cursor-pointer hover:border-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-white group-hover:-translate-y-1 transition-transform duration-300">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
             </div>
        </div>

    </div>
</template>