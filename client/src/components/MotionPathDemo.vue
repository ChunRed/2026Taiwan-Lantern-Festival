<template>
  <div class="p-6">
    <svg ref="svgEl" viewBox="0 0 450 600" class="w-full max-w-3xl border rounded bg-zinc-900">
  <path
    ref="pathEl"
    d="M220.158 362.787H220.171M220.158 362.787C233.003 367.031 248.471 371.693 275.708 380.561C310.044 391.74 413.527 408.837 420.494 460.143C427.462 511.45 374.445 539.598 326.749 532.353C276.709 524.752 251 491.715 228 470C220.056 462.5 209.669 443.649 204.272 435.731C198.508 427.269 192.072 412.232 190.806 409.077C186.663 398.816 180.468 383.006 178.669 375.772C175.908 364.637 170.498 349.258 169.219 333.574C181.026 348.867 208.098 359.422 220.158 362.787Z"
    fill="none"
    stroke="white"
    stroke-width="3"
  />

  <!-- 方塊：中心對齊用 x/y = -size/2 -->
    <g id="rect">
    

  <rect
    ref="dotEl"
    x="-10"
    y="-10"
    width="20"
    height="20"
    fill="cyan"
  />
  <text x="10" y="19" font-size="14" class="text-white">SVG &lt;rect&gt;</text>
  </g>
</svg>



    <div class="mt-4 flex gap-2">
      <button class="px-3 py-1 border rounded" @click="play">Play</button>
      <button class="px-3 py-1 border rounded" @click="pause">Pause</button>
      <button class="px-3 py-1 border rounded" @click="reverse">Reverse</button>
    </div>
  </div>








  <svg width="100%" height="100%" viewBox="-20 0 557 190" id="svg">
	<circle cx="100" cy="100" r="3" />
	<circle cx="300" cy="20" r="3" />
	<path id="path" d="M9,100c0,0,18.53-41.58,49.91-65.11c30-22.5,65.81-24.88,77.39-24.88c33.87,0,57.55,11.71,77.05,28.47c23.09,19.85,40.33,46.79,61.71,69.77c24.09,25.89,53.44,46.75,102.37,46.75c22.23,0,40.62-2.83,55.84-7.43c27.97-8.45,44.21-22.88,54.78-36.7c14.35-18.75,16.43-36.37,16.43-36.37"fill="none"
    stroke="white"
    stroke-width="3"/>
	<g id="rect">
		<rect width="85" height="30" fill="dodgerblue" />
		<text x="10" y="19" font-size="14">SVG &lt;rect&gt;</text>
	</g>
</svg>



</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

const svgEl = ref(null);
const pathEl = ref(null);
const dotEl = ref(null);

let tween;

onMounted(() => {
  // 讓點的中心對準路徑（可選，但很推薦）
  gsap.set(dotEl.value, { transformOrigin: "50% 50%" });

  tween = gsap.to(dotEl.value, {
    duration: 10,
    repeat: -1,
    ease: "none",
    motionPath: {
      path: pathEl.value,
      align: pathEl.value,
      alignOrigin: [0.5, 0.5],
      autoRotate: true,
    },
  });

  gsap.to("#rect", {
  duration: 5, 
  repeat: 12,
  repeatDelay: 3,
  yoyo: true,
  ease: "power1.inOut",
  motionPath:{
    path: "#path",
    align: "#path",
    autoRotate: true,
    alignOrigin: [0.5, 0.5]
  }
});
});


onBeforeUnmount(() => {
  tween?.kill();
  tween = null;
});

function play() {
  tween?.play();
}
function pause() {
  tween?.pause();
}
function reverse() {
  tween?.reverse();
}
</script>
