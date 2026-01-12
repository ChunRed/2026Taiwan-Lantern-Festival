



<template>
    <div class="flex flex-col">
        <div class="flex-none fixed  z-10 w-[110%]  h-[500px]  overflow-hidden  -ml-5 top-0 bg-[#000000] opacity-80">
            <div class="absolute w-[110%] h-24 bottom-0  -ml-5  mt-1 z-20  bg-gradient-to-t from-[#517ADA] to-black-500"></div>
        </div>
        

        <div class="relative top-[380px] w-full">
             <div class="  text-white  mt-3  text-[24px] font-bold text-center">
                你獲得了一隻ＯＯＯ鹿
            </div>

            <Gen_Information class="mt-1" />
        </div>

       


        
    </div>
   

</template>


<script setup>
    import Gen_Information from "../components/Gen_Information.vue";


</script>