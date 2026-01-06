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
