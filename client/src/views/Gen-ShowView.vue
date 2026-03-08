<template>
  <div ref="captureArea" class="flex flex-col relative w-full h-full bg-[#000000]">
    <LoadingPage data-html2canvas-ignore="true" v-if="isLoading" />
    <CrossOverlay data-html2canvas-ignore="true" />
    <ExplosionEffect 
      data-html2canvas-ignore="true"
      v-if="showExplosion" 
      :colors="explosionColors" 
      :particleCount="explosionConfig.particleCount"
      :minSize="explosionConfig.minSize"
      :maxSize="explosionConfig.maxSize"
      :minForce="explosionConfig.minForce"
      :maxForce="explosionConfig.maxForce"
      :duration="explosionConfig.duration"
    />
    <div
      class="absolute top-0 left-0 z-0 w-full h-[500px] overflow-hidden bg-[#000000]"
    >
      
    </div>

    <div class="relative z-10 top-[0px] w-full">
      <div v-if="genStore.gen.length > 0">
        <!-- Add Image Here -->
        <div class="flex justify-center relative w-full h-auto overflow-hidden">
            <!-- 第二層：剩下的元素飄浮 (放置於最下層) -->
            <FloatingIconsCanvas :images="floatingImagesRest" :config="floatingConfigRest" />
            
            <!-- Background Floating Icons (Canvas) -->
            <FloatingIconsCanvas :images="floatingImages" :config="floatingConfig" />

            <!-- === 圖片與背景飄浮元素之間的黑色遮罩 === -->
            <div 
              class="absolute inset-0 bg-black z-0 pointer-events-none mask-pulse"
              :style="{ 
                '--mask-min': maskMinOpacity, 
                '--mask-max': maskMaxOpacity,
                'animation-duration': `${maskDuration}s` 
              }"
            ></div>

            <img :src="genShowImage" alt="Generated Image" class="w-full h-auto relative z-10" />
        </div>

        <!-- 漸層 -->
        <div
          class="relative -top-24 left-0 z-10 w-full h-24"
          :style="{ background: `linear-gradient(to top, ${maxThemeColor}, transparent)` }"
        ></div>


        <div class="relative -top-20 text-white text-[24px] font-bold text-center">
          你獲得了一隻{{ genDeerData.name }}!
        </div>

        <div class="relative -top-20">
          <hr class="border-white/20 my-4 mx-8" />
        </div>
        
        <!-- 新增鹿的內容與 hashtag -->
        <div class="relative -top-20 text-white mt-2 px-6 space-y-4">
          <!-- hashtags (改為無底色、粗體白字) -->
          <div class="flex justify-center flex-wrap gap-2 text-white font-bold tracking-wide w-full text-lg drop-shadow-md">
            <span 
              v-for="(tag, idx) in genDeerData.hashtags" 
              :key="idx"
              class="px-2 py-1 whitespace-nowrap flex items-center justify-center leading-none"
            >
              {{ tag }}
            </span>
          </div>
          <!-- content (靠左對齊, \n 換行) -->
          <div class="whitespace-pre-line leading-relaxed text-[15px] opacity-90 text-left w-full">
            {{ genDeerData.content }}
          </div>
        </div>

        <div class="relative -top-12">
          <hr class="border-white/20 my-0 mx-8" />
        </div>

        <!-- 上傳資訊區塊 -->
        <div data-html2canvas-ignore="true" class="flex flex-col items-center justify-center relative -top-6 pb-4 w-full px-8 space-y-3">
          <div class="text-white/80 text-sm font-light tracking-wider text-center">
            將生成鹿上傳顯示於主鹿下方的 LED 螢幕中
          </div>
          <button 
            @click="openUploadDialog"
            :disabled="genStore.isUploaded"
            class="px-8 py-3 font-bold rounded-full w-full shadow-lg tracking-widest text-lg transition"
            :class="genStore.isUploaded ? 'bg-gray-400 text-white opacity-80 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200'"
          >
            {{ genStore.isUploaded ? '已 上 傳' : '上 傳 數 據' }}
          </button>
          
          <button 
            @click="downloadImage"
            :disabled="isDownloading"
            class="px-8 py-3 font-bold rounded-full w-full shadow-lg tracking-widest text-lg transition bg-black border border-white text-white hover:bg-white hover:text-black mt-2 flex items-center justify-center gap-2"
          >
            <span v-if="isDownloading" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            {{ isDownloading ? '產 生 中' : '下 載 圖 片' }}
          </button>
        </div>

        <!-- 元素連結 (百分比資訊區塊) 移至最下方 -->
        <div class="relative mt-4 -top-2 pb-12" data-html2canvas-ignore="true">
          <Gen_Information
            :Gen="genStore.gen.filter(i => i !== 8)"
            :Rate="genStore.SelectedItemRate.filter((r, i) => genStore.gen[i] !== 8)"
          />
        </div>
      </div>

      <div v-else>
        <div class="text-white mt-3 text-[18px] font-bold text-center mb-3">
          你還沒有選擇任何元素，請選擇元素!
        </div>
        <!-- Button -->
        <div class="flex justify-center" data-html2canvas-ignore="true">
          <RouterLink
            to="/gen-choose"
            class="flex h-12 w-12 items-center justify-center rounded-full border border-[#ffffff] bg-black/60"
          >
            <span class="text-3xl leading-none text-[#ffffff]"> › </span>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- 彈出截圖視窗 -->
    <div data-html2canvas-ignore="true" v-if="showImageDialog" class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 px-6 backdrop-blur-sm">
      <div class="text-white text-xl font-bold mb-6 tracking-widest animate-pulse drop-shadow-lg">
        請長按下方圖片儲存
      </div>
      <div class="relative w-full max-w-sm flex flex-col items-center">
        <img :src="generatedImageUrl" class="w-full h-auto max-h-[65vh] object-contain rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] border border-white/20" alt="Generated Image" />
      </div>
      <div class="flex gap-4 mt-8 w-full max-w-sm px-4">
        <button 
          @click="showImageDialog = false" 
          class="flex-1 py-3 rounded-full font-bold bg-white text-black hover:bg-gray-200 transition shadow-lg text-lg tracking-widest"
        >
          完 成
        </button>
        <button 
          @click="shareToInstagram" 
          class="flex-1 py-3 rounded-full font-bold bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white hover:opacity-90 transition shadow-lg text-lg tracking-widest"
        >
          分 享 至 IG
        </button>
      </div>
    </div>

    <!-- 彈出輸入視窗 -->
    <div data-html2canvas-ignore="true" v-if="showUploadDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black px-4">
      <div class="bg-[#000000] border border-white/20 rounded-2xl p-6 w-full max-w-sm flex flex-col items-center shadow-2xl">
        <h3 class="text-xl font-bold mb-4 text-white">請輸入上傳名稱</h3>
        <input 
          v-model="uploadName" 
          type="text" 
          class="w-full bg-[#333333] border border-black rounded-lg px-4 py-3 mb-6 text-white text-lg focus:outline-none focus:ring-2 focus:ring-white text-center placeholder-gray-500"
          placeholder="請輸入名稱"
        />
        <div class="flex justify-between w-full gap-4">
          <button 
            @click="showUploadDialog = false" 
            class="flex-1 py-3 rounded-lg font-bold bg-black text-white  border border-white transition text-lg"
          >
            取 消
          </button>
          <button 
            @click="confirmUpload" 
            class="flex-1 py-3 rounded-lg font-bold bg-white text-black  transition shadow-md text-lg"
          >
            確 認
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Gen_Information from "../components/Gen_Information.vue";
import ExplosionEffect from "../components/ExplosionEffect.vue";
import CrossOverlay from "../components/CrossOverlay.vue";
import LoadingPage from "../components/LoadingPage.vue";
import FloatingIconsCanvas from "../components/FloatingIconsCanvas.vue";
import { useGenStore } from "../stores/Gen.js";
import { ref, onMounted, computed } from "vue";
import plantData from "@/data/plantData.json";
import genData from "@/data/genData.json";
import html2canvas from "html2canvas";
import { apiFindSessionByUserId, apiUpdateSession } from "../stores/api/clientApi.js";

const genStore = useGenStore();
const isLoading = ref(true);
const showExplosion = ref(false);
const captureArea = ref(null);
const isDownloading = ref(false);

const showUploadDialog = ref(false);
const uploadName = ref("");

const showImageDialog = ref(false);
const generatedImageUrl = ref("");

let image_id;

const maxThemeColor = computed(() => {
  const selectedIndices = [...genStore.gen];
  const all8Selected = [0,1,2,3,4,5,6,7].every(i => selectedIndices.includes(i));
  const hasGodDeer = selectedIndices.includes(8);
  
  if (all8Selected && hasGodDeer) {
    return '#FFD700'; // special color for god deer
  }

  const scales = genStore.ItemScale;
  const selectedGens = selectedIndices.filter(i => i !== 8);
  let maxScale = -1;
  let maxIdx = -1;
  
  for (let i = 0; i < selectedGens.length; i++) {
    const plantIdx = selectedGens[i];
    if (scales[plantIdx] > maxScale) {
      maxScale = scales[plantIdx];
      maxIdx = plantIdx;
    }
  }

  if (maxIdx !== -1 && plantData[maxIdx]) {
    return plantData[maxIdx].themeColor;
  }
  return '#517ADA'; // fallback default color
});

const genShowImage = computed(() => {
  const selectedIndices = [...genStore.gen];
  const all8Selected = [0,1,2,3,4,5,6,7].every(i => selectedIndices.includes(i));
  const hasGodDeer = selectedIndices.includes(8);
  const allScale100 = genStore.ItemScale.slice(0, 8).every(scale => scale === 100);
  
  if (all8Selected && hasGodDeer) {
    if (allScale100) {
      image_id = '9.png';
      return new URL('../assets/Gen_Image/9.png', import.meta.url).href;
    } else {
      image_id = '91.png';
      return new URL('../assets/Gen_Image/91.png', import.meta.url).href;
    }
  }

  const normalSelectedIndices = selectedIndices.filter(i => i !== 8);

  if (normalSelectedIndices.length < 2) {
    // 預設防呆機制 (不足兩個元素或只有一個元素時回傳 0.png)
    image_id = '0.png';
    return new URL('../assets/Gen_Image/0.png', import.meta.url).href;
  }

  // 依據分數大小反向排序，取出最高分的前兩個索引
  normalSelectedIndices.sort((a, b) => genStore.ItemScale[b] - genStore.ItemScale[a]);
  const top2 = normalSelectedIndices.slice(0, 2);

  // 確保組合檔名時，數字為小到大排序 (例如 1 和 3 -> 13)
  top2.sort((a, b) => a - b);
  const imageName = `${top2[0]}${top2[1]}.png`;
  image_id = imageName;
  return new URL(`../assets/Gen_Image/${imageName}`, import.meta.url).href;
});

const genDeerData = computed(() => {
  const selectedIndices = [...genStore.gen];
  
  let targetIndex = "0";
  const all8Selected = [0,1,2,3,4,5,6,7].every(i => selectedIndices.includes(i));
  const hasGodDeer = selectedIndices.includes(8);
  const allScale100 = genStore.ItemScale.slice(0, 8).every(scale => scale === 100);

  if (all8Selected && hasGodDeer) {
    if (allScale100) {
      return { name: "彩蛋神鹿", content: "你觸發了隱藏機制，解鎖了獨一無二的九宮格神鹿！這代表著全元素的完美融合。", hashtags: ["#全收集", "#隱藏機制"] };
    } else {
      return { name: "彩蛋神鹿", content: "你觸發了隱藏機制，解鎖了獨一無二的九宮格神鹿！", hashtags: ["#全收集", "#隱藏機制"] };
    }
  }

  const normalSelectedIndices = selectedIndices.filter(i => i !== 8);

  if (normalSelectedIndices.length >= 2) {
    normalSelectedIndices.sort((a, b) => genStore.ItemScale[b] - genStore.ItemScale[a]);
    const top2 = normalSelectedIndices.slice(0, 2);
    top2.sort((a, b) => a - b);
    targetIndex = `${top2[0]}${top2[1]}`;
  }

  const foundData = genData.find(d => d.index === targetIndex);
  return foundData || { name: "未知鹿", content: "這個組合尚未定義", hashtags: [] };
});

// === 這裡可以調整圖片與背景元素之間的黑色遮罩透明度「動態參數」 ===
const maskMinOpacity = ref(0.0); // 最小透明度 (最亮)
const maskMaxOpacity = ref(0.8); // 最大透明度 (最暗)
const maskDuration = ref(10);     // 動態變化週期 (幾秒完成一次呼吸燈循環)

// === 隨便調整以下參數就可以設定元素的漂浮動態！ ===
const floatingConfig = ref({
  density: 20,           // 元素出現的數量 (太滿可調小)
  minSize: 20,         // 大小最小值 (px)
  maxSize: 120,         // 大小最大值 (px)
  speedX: 0.8,          // 左右飄動速度
  speedY: 0.3,          // 向上飄動速度
  rotSpeed: 0.02,       // 旋轉速度
  opacity: 1          // 透明度 (0.0 ~ 1.0)
});

// === 第二層 (剩下的元素) 參數調整 ===
const floatingConfigRest = ref({
  density: 30,          // 剩下的元素數量
  minSize: 5,          // 剩下的元素 大小最小值 (px)
  maxSize: 20,          // 剩下的元素 大小最大值 (px)
  speedX: 0.5,          // 剩下的元素 左右飄動速度
  speedY: 0.6,          // 剩下的元素 向上飄動速度
  rotSpeed: 0.03,       // 剩下的元素 旋轉速度
  opacity: 0.3          // 剩下的元素 透明度 (0.0 ~ 1.0)
});

const floatingImages = computed(() => {
  const selectedIndices = [...genStore.gen];
  const normalSelectedIndices = selectedIndices.filter(i => i !== 8);
  // 依據分數大小反向排序
  normalSelectedIndices.sort((a, b) => genStore.ItemScale[b] - genStore.ItemScale[a]);
  const top2 = normalSelectedIndices.slice(0, 2);

  return top2.map(idx => {
    return new URL(`../assets/${plantData[idx].nameZh}.png`, import.meta.url).href;
  });
});

const floatingImagesRest = computed(() => {
  const selectedIndices = [...genStore.gen];
  const normalSelectedIndices = selectedIndices.filter(i => i !== 8);
  // 依據分數大小反向排序
  normalSelectedIndices.sort((a, b) => genStore.ItemScale[b] - genStore.ItemScale[a]);
  
  // 抓取第 3 個之後的所有剩餘項目 (若沒超過 2 個則回傳空陣列)
  const rest = normalSelectedIndices.slice(2);

  return rest.map(idx => {
    return new URL(`../assets/${plantData[idx].nameZh}W.png`, import.meta.url).href;
  });
});

// Colors for the explosion effect (easily adjustable)
const explosionColors = ['#C8AAFF', '#ffffff', '#7093FF', '#FFF2A6'] ;

// Particle Settings (Adjust here)
const explosionConfig = {
  particleCount: 100, // Quantity of particles (Density)
  minSize: 4,         // Minimum size of particles
  maxSize: 60,        // Maximum size of particles
  minForce: 3,        // Minimum explosion force (velocity)
  maxForce: 20,        // Maximum explosion force (velocity)
  duration: 15000      // Duration in milliseconds
};

const openUploadDialog = async () => {
  if (genStore.isUploaded) {
    genStore.showNotification("已經上傳過囉！請重新選擇元素生成。");
    return;
  }

  // 判斷台灣時間是否為下午 16:30 之前
  const now = new Date();
  const taiwanTimeOptions = { timeZone: 'Asia/Taipei', hour12: false, hour: 'numeric', minute: 'numeric' };
  const formatter = new Intl.DateTimeFormat('en-US', taiwanTimeOptions);
  const parts = formatter.formatToParts(now);
  const hour = parseInt(parts.find(p => p.type === 'hour').value, 10);
  const minute = parseInt(parts.find(p => p.type === 'minute').value, 10);

  if (hour < 16 || (hour === 16 && minute < 30)) {
    genStore.showNotification("LED螢幕於16：30開放，歡迎回來再次上傳！");
    return;
  }

  let defaultName = "未知用戶";
  try {
    if (window.liff && window.liff.isLoggedIn()) {
      const p = await window.liff.getProfile();
      defaultName = p.displayName;
    } else {
      defaultName = "Test";
    }
  } catch (e) {
    console.error("Failed to get profile:", e);
  }

  uploadName.value = defaultName;
  showUploadDialog.value = true;
};

const confirmUpload = async () => {
  if (!uploadName.value.trim()) {
    genStore.showNotification("請輸入名稱！");
    return;
  }

  if (genStore.socket) {
    // 取得所有元素的 ItemScale，若未被選中 (不在 genStore.gen 內) 則以 0 代替
    const selectedScales = genStore.ItemScale.slice(0, 8).map((scale, idx) => 
      genStore.gen.includes(idx) ? scale : 0
    );
    
    // 多加一個數值表示有無選擇鹿王元素 (1代表有選，0代表沒選)
    selectedScales.push(genStore.gen.includes(8) ? 100 : 0);

    genStore.socket.emit("tdMSG", [uploadName.value.trim(), ...selectedScales, image_id]);
    
    // Save to Supabase
    try {
      const existingSession = await apiFindSessionByUserId(genStore.userId || 'test');
      if (existingSession && existingSession.id) {
        const newData = [genStore.userId || 'test', ...genStore.ItemScale, uploadName.value.trim()];
        await apiUpdateSession(existingSession.id, newData);
      }
    } catch (err) {
      console.error("Failed to update supabase with name:", err);
    }
    
    genStore.isUploaded = true;
    showUploadDialog.value = false;
    genStore.showNotification("上傳成功！");
  } else {
    genStore.showNotification("連線尚未建立！");
  }
};

const downloadImage = async () => {
  if (!captureArea.value || isDownloading.value) return;
  
  try {
    isDownloading.value = true;
    genStore.showNotification("圖片準備中，請稍候...");
    
    // 讓 DOM 更新
    await new Promise(r => setTimeout(r, 200));

    // 使用 html2canvas 將 DOM 轉換為 canvas
    const canvas = await html2canvas(captureArea.value, {
      backgroundColor: "#000000",
      useCORS: true,
      scale: 2, // 提升畫質
      logging: false,
    });
    
    // 顯示在彈窗內
    generatedImageUrl.value = canvas.toDataURL("image/png");
    showImageDialog.value = true;
    
    genStore.closeNotification();
  } catch (err) {
    console.error("生成圖片錯誤:", err);
    genStore.showNotification("產生圖片時發生錯誤！");
  } finally {
    isDownloading.value = false;
  }
};

const shareToInstagram = async () => {
  if (!generatedImageUrl.value) return;

  try {
    // 轉換 base64 為 blob
    const response = await fetch(generatedImageUrl.value);
    const blob = await response.blob();
    const file = new File([blob], `my-deer-${Date.now()}.png`, { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: '我的專屬生成鹿',
        text: '來看看我的 2026 台灣燈節生成鹿！',
        files: [file]
      });
      genStore.showNotification("分享成功！");
    } else {
      // 降級處理：提醒用戶長按儲存後去 IG 發布
      genStore.showNotification("您的設備暫不支持直接分享，請長按儲存後分享至 IG！");
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error("分享失敗:", err);
      genStore.showNotification("分享時發生錯誤！");
    }
  }
};

onMounted(() => {
  // 讓頁面先捲動到最上面，確保 html2canvas 擷取的內容不會跑掉
  window.scrollTo(0, 0);

  // 2秒 loading 畫面
  setTimeout(() => {
    isLoading.value = false;
    showExplosion.value = true;
    
    // Remove the explosion effect after duration to free up resources
    setTimeout(() => {
      showExplosion.value = false;
    }, explosionConfig.duration);
  }, 2000);
});
</script>

<style scoped>
@keyframes pulseOpacity {
  0% { opacity: var(--mask-min); }
  50% { opacity: var(--mask-max); }
  100% { opacity: var(--mask-min); }
}

.mask-pulse {
  animation: pulseOpacity infinite ease-in-out;
}
</style>
