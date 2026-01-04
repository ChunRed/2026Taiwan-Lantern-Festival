<template>
    <div class="bg"></div>
    <div class="box-bg">
        <div class="box"></div>
    </div>
    <div class="bg"></div>
</template>


<script setup>
    import { gsap } from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import { onMounted, onUnmounted } from "vue";
    
    gsap.registerPlugin(ScrollTrigger);


    const gsapSet  = () => {
        ScrollTrigger.matchMedia({
            "(min-width: 768px)": () => {
                //跟設定css 一樣  如果畫面不小於 768px 執行
                gsap.to(".box", {
                    x: 300,
                    duration: 3,
                    rotation: 360,
                    scrollTrigger: {
                        trigger: ".box", //觸發得物件
                        start: "top top", // (物件開始位置, 卷軸開始位置) top center bottom px
                        end: "+=300", //(物件結束位置, 卷軸結束位置) , 也可以設卷軸捲動多少結束動畫(+=300)
                        pin: true, // 物件執行完動畫會跟著卷軸走，類似 fixed-top
                        scrub: true, // 物件動畫根據卷軸捲動程度跑
                        toggleClass: "active", //  class名稱 須為字串
                markers: true // 顯示標記
                }
            });
            }
        });
    }

    
    const triggers = ScrollTrigger.getAll();
  onMounted(() => {
     // 執行 gsap 動畫
       gsapSet();
    });
    onUnmounted(() => {
      triggers.forEach((trigger) => {
      // 把 ScrollTrigger 綁定的動畫消除
        trigger.kill();
      });
      // 消除綁定 MatchMedia();
      ScrollTrigger.clearMatchMedia();
    });

</script>

<style scoped>
    .bg {
        height: 100vh;
        background-color: #333;
    }
    .box-bg {
        height: 100vh;
        background-color: #666;
    }
    .box {
        width: 100px;
        height: 100px;
        background-color: #db3c3c;
    }
</style>