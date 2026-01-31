<script setup>
import plantData from "@/data/plantData.json";
import { computed, watchEffect } from "vue";

const props = defineProps({
  Gen: {
    type: Array,
    required: true,
    default: () => [0, 0, 0, 0, 0, 0, 0, 0],
  },
  Rate: {
    type: Array,
    required: true,
    default: () => [0, 0, 0, 0, 0, 0, 0, 0],
  },
});

const segments = [
  {
    label: (props.Rate[0] * 100).toFixed(1).toString() + "%",
    value: props.Rate[0],
    color:
      props.Gen.length < 1 ? "#000000" : plantData[props.Gen[0]].themeColor,
  },
  {
    label: (props.Rate[1] * 100).toFixed(1).toString() + "%",
    value: props.Rate[1],
    color:
      props.Gen.length < 2 ? "#000000" : plantData[props.Gen[1]].themeColor,
  },
  {
    label: (props.Rate[2] * 100).toFixed(1).toString() + "%",
    value: props.Rate[2],
    color:
      props.Gen.length < 3 ? "#000000" : plantData[props.Gen[2]].themeColor,
  },
  {
    label: (props.Rate[3] * 100).toFixed(1).toString() + "%",
    value: props.Rate[3],
    color:
      props.Gen.length < 4 ? "#000000" : plantData[props.Gen[3]].themeColor,
  },
  {
    label: (props.Rate[4] * 100).toFixed(1).toString() + "%",
    value: props.Rate[4],
    color:
      props.Gen.length < 5 ? "#000000" : plantData[props.Gen[4]].themeColor,
  },
  {
    label: (props.Rate[5] * 100).toFixed(1).toString() + "%",
    value: props.Rate[5],
    color:
      props.Gen.length < 6 ? "#000000" : plantData[props.Gen[5]].themeColor,
  },
  {
    label: (props.Rate[6] * 100).toFixed(1).toString() + "%",
    value: props.Rate[6],
    color:
      props.Gen.length < 7 ? "#000000" : plantData[props.Gen[6]].themeColor,
  },
  {
    label: (props.Rate[7] * 100).toFixed(1).toString() + "%",
    value: props.Rate[7],
    color:
      props.Gen.length < 8 ? "#000000" : plantData[props.Gen[7]].themeColor,
  },
];

const normalized = computed(() => {
  // 1️⃣ 先轉成合法數值
  const cleaned = segments
    .map((x) => ({
      ...x,
      value: Math.max(0, Number(x.value) || 0),
    }))
    // 2️⃣ 直接移除 0% 的段
    .filter((x) => x.value > 0);

  const sum = cleaned.reduce((a, b) => a + b.value, 0) || 1;

  // 3️⃣ normalize 成百分比
  return cleaned.map((x) => ({
    ...x,
    pct: (x.value / sum) * 100,
  }));
});

const getImageUrl = (name) => {
  return new URL(`../assets/${name}`, import.meta.url).href;
};
</script>

<template>
  <!-- 比例 -->
  <div class="w-full px-3 mt-3">
    <div class="w-full flex items-center" :style="{ gap: `5px` }">
      <div
        v-for="(seg, idx) in normalized"
        :key="idx"
        class="rounded-[8px] flex items-center justify-center text-black font-medium transition-[flex-basis,width] duration-500 ease-out"
        :style="{
          flexBasis: seg.pct + '%',
          height: '20px',
          backgroundColor: seg.color,
        }"
      >
        <span class="text-[12px] leading-none select-none">
          {{ seg.label ?? `${Math.round(seg.pct)}%` }}
        </span>
      </div>
    </div>
  </div>

  <!-- 可捲動的按鈕列表區塊 -->
  <div class="flex-1 overflow-y-auto px-6 py-6">
    <div class="flex flex-col gap-3">
      <div
        v-for="i in props.Gen.length"
        :key="i"
        class="relative flex items-center justify-between px-4 py-2 rounded-lg border border-white/20 text-base transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div class="flex items-start gap-2">
          <img
            :src="getImageUrl(plantData[props.Gen[i - 1]].image)"
            alt=""
            class="w-6 h-6"
          />

          <div class="px-3 flex text-left">
            <span
              class="font-medium text-[16px]"
              :style="{ color: plantData[props.Gen[i - 1]].themeColor }"
              >{{
                plantData[props.Gen[i - 1]].nameZh +
                " | " +
                plantData[props.Gen[i - 1]].nameEn
              }}
            </span>
          </div>

          <!-- Bottom Arrow (Fixed at bottom) -->
          <div class="absolute bottom-3 flex-none right-3">
            <RouterLink
              :to="{
                name: 'information',
                query: { id: plantData[props.Gen[i - 1]].id },
              }"
              class="flex h-6 w-6 items-center justify-center bg-black/60"
            >
              <span
                class="text-3xl leading-none"
                :style="{ color: plantData[props.Gen[i - 1]].themeColor }"
              >
                ›
              </span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部預留空間，確保最後一個按鈕不貼底 -->
    <div class="h-20"></div>
  </div>
</template>
