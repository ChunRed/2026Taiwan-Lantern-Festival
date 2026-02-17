<template>
  <div v-if="route.path === '/lineinfo'" class="liff-profile">
    <!-- 在LineInfoView頁面要顯示的內容 -->
    <h2>Welcome to my LIFF page Test</h2> 

    <pre>{{ status }}</pre>
    <div v-if="profile">
      <div>displayName: {{ profile.displayName }}</div>
      <div>userId: {{ profile.userId }}</div>
      <div>pictureUrl: {{ profile.pictureUrl }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useGenStore } from "../stores/Gen";
import { useServerSyncStore } from "../stores/ServerSync";

// 狀態
const route = useRoute();
const status = ref("loading...");
const profile = ref(null);

// LIFF ID（之後可以抽成 env）
const LIFF_ID = "2008806646-oNvJMBiC";

onMounted(async () => {
  try {
    // 動態載入 LIFF SDK（避免 index.html 污染）
    await loadLiffSdk();

    const serverSyncStore = useServerSyncStore(); // Get instance

    await liff.init({ liffId: LIFF_ID });

    // 若不是在 LINE App 內開啟，要求登入
    if (!liff.isLoggedIn()) {
      //liff.login();
      // For fallback logic if login doesn't redirect or for testing flow
      const fallbackId = "test"; 
      profile.value = {
        displayName: "Test",
        userId: fallbackId,
        pictureUrl: "test",
      };
      
      // Even in fallback/test mode, initialize
      const genStore = useGenStore();
      genStore.initSocket(fallbackId);
      serverSyncStore.initializeSync(fallbackId);
      
      return;
    }

    const p = await liff.getProfile();
    profile.value = p;

    // Initialize Socket
    const genStore = useGenStore();
    genStore.initSocket(p.userId);
    
    // Initialize Sync
    serverSyncStore.initializeSync(p.userId);

    status.value = "LIFF ready";
  } catch (e) {
    status.value = "LIFF init error: " + (e?.message || e);
  }
});

/**
 * 動態載入 LIFF SDK
 */
function loadLiffSdk() {
  return new Promise((resolve, reject) => {
    if (window.liff) return resolve();

    const script = document.createElement("script");
    script.src = "https://static.line-scdn.net/liff/edge/2/sdk.js";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
</script>

<style scoped>
.liff-profile {
  padding: 16px;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont;
}
</style>
