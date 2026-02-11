# 2026 Taiwan Lantern Festival Web Project

本專案包含 2026 台灣燈節的前端 (Client) 與後端 (Server) 程式碼。

## 1. 使用的 Node / npm 版本
建議使用以下版本以確保相容性：
- **Node.js**: v24.12.0
- **npm**: 11.6.2
- **建議**: 可以使用 `nvm` 切換至對應版本。

## 2. 技術架構
- **前端 (Client)**: Vue 3 + Vite (Lite version)
  - 使用 TailwindCSS 進行樣式設計
  - 使用 Socket.IO Client 進行即時通訊
- **後端 (Server)**: Node.js + Express
  - 使用 Socket.IO Server
  - 整合 LINE Bot SDK 處理 Beacon 事件

## 3. 如何執行 Server 和 Client 端

### 初始化安裝 (第一次執行前)
請分別在 `client` 和 `server` 目錄下安裝依賴套件：
```bash
# 安裝前端依賴
cd client
npm install

# 安裝後端依賴
cd ../server
npm install
```

### 開發模式 (Development)
若要分別開發前端與後端：

**啟動前端開發伺服器:**
```bash
cd client
npm run dev
```
- 預設網址: `http://localhost:5173`

**啟動後端伺服器:**
```bash
cd server
node server.js
# 或使用 nodemon (若有安裝)
npx nodemon server.js
```
- 預設通訊埠: `4000`

### 生產模式 (Production) / 整合執行
若要透過後端伺服器提供編譯好的前端檔案：

1. **編譯前端程式碼**:
   ```bash
   cd client
   npm run build
   ```
   此指令會將編譯後的檔案產生至 `client/dist` 目錄。

2. **啟動後端伺服器**:
   ```bash
   cd server
   node server.js
   ```
   此時後端會將 `client/dist` 的靜態檔案服務於 `http://localhost:4000`。

## 4. 如何測試使用
1. **瀏覽器測試**: 打開瀏覽器訪問 `http://localhost:4000` (整合模式) 或 `http://localhost:5173` (開發模式)。
2. **LINE Beacon 模擬**: 後端 `server.js` 包含處理 `/webhook` 的邏輯。
   - 當收到 Beacon `enter` 事件時，會透過 Socket.IO 發送 `beacon-enter` 事件給前端。
   - 前端會根據收到的 `hwid` 顯示對應的內容。

## 5. Ngrok 使用說明 (外部連線與 LINE Bot)
由於 LINE Bot 需要 HTTPS 的 Webhook URL，本機開發時需使用 ngrok 將 localhost 暴露至外網。

1. **執行 ngrok**:
   ```bash
   ngrok http 4000
   ```
   這會將本機的 port 4000 對應到一個公開的網址 (例如 `https://xxxx-xxxx.ngrok-free.app`)。

2. **設定 Webhook**:
   - 複製 ngrok 產生的 HTTPS 網址。
   - 加上 `/webhook` 路徑 (例如 `https://xxxx-xxxx.ngrok-free.app/webhook`)。
   - 將此完整 URL 填入 LINE Developers Console 的 Webhook URL 設定中。

3. **注意事項**:
   - 每次重啟 ngrok 網址都會改變，需重新設定 Webhook URL (除非使用付費固定網域)。
   - `server/server.js` 檔案開頭已有註解提示 `// ngrok http 4000`。
