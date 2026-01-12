



<template>
    <div class="flex flex-col">
        <div class="flex-none fixed  z-10 w-[110%]  h-[500px]  overflow-hidden  -ml-5 top-0 bg-[#000000] ">
            <div class="absolute w-[110%] h-24 bottom-0  -ml-5  mt-1 z-20  bg-gradient-to-t from-[#517ADA] to-black-500"></div>
        </div>
        

        <div class="relative top-[380px] w-full">


            <div v-if="genStore.gen.length > 0">
                <div class="  text-white  mt-3  text-[24px] font-bold text-center">
                    你獲得了一隻ＯＯＯ鹿
                </div>
                <Gen_Information  
                    :Gen="genStore.gen"
                    :Rate="genStore.SelectedItemRate" />
            </div>
            

            <div v-else>
                <div class="  text-white  mt-3  text-[18px] font-bold text-center mb-3">
                    你還沒有選擇任何元素，請錢選擇元素
                </div>
                <!-- Button -->
                <div class="flex justify-center">
                    <RouterLink to="/gen-choose" class="flex h-12 w-12 items-center justify-center rounded-full border border-[#ffffff] bg-black/60">
                        <span class="text-3xl leading-none text-[#ffffff]">
                        ›
                        </span>
                    </RouterLink>
                </div>
            </div>



        </div>

       


        
    </div>
   

</template>


<script setup>
    import Gen_Information from "../components/Gen_Information.vue";
    import { useGenStore } from "../stores/Gen.js";
    import { ref } from "vue";

    const genStore = useGenStore();

</script>