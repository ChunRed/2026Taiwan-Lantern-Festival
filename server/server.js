// server.js
const express = require("express");
const axios = require("axios");
const path = require("path");

console.log("🔧 啟動中：載入 express / axios 完成");

const app = express();
app.use(express.json()); // 解析 JSON body

// 建議正式用環境變數，這裡先快速測試
const CHANNEL_ACCESS_TOKEN =
    process.env.LINE_CHANNEL_ACCESS_TOKEN ||
    "FKfYZmC+bW1R1jXNLyov/7rdFCUIjU6URja3M0g5Xe5mDDmPfbKw0PCSd86hO3R/XIRygGBy4FsAHygu5+dsAl7WLfgopy5xYq+grxNm+zcbq5GW/bQ0iXerwGJU1XFKC/izrmMp4aP3mKCN7m3LHwdB04t89/1O/w1cDnyilFU=";

// 全域錯誤監聽，避免程式默默掛掉卻沒看到錯誤
process.on("uncaughtException", (err) => {
    console.error("❌ uncaughtException：", err);
});
process.on("unhandledRejection", (reason, promise) => {
    console.error("❌ unhandledRejection：", reason);
});

// 最簡單測試用 GET，讓你可以直接用瀏覽器或 curl 測
app.get("/", (req, res) => {
    res.send("LINE Webhook demo server is running.");
});


const LIFF_ID = process.env.LIFF_ID || "把你的 LIFF ID 貼在這裡";

app.get('/liff', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'test.html'));
});



const distPath = path.join(__dirname, "..", "client", "dist");

// 1) 先讓 /assets 能正確拿到檔案
app.use("/assets", express.static(path.join(distPath, "assets")));

// (可選) 其他靜態檔，例如 favicon.svg、manifest 等通常在 dist 根目錄
app.use(express.static(distPath));

// 2) /home & /home/* 都回 index.html (給 Vue Router)
app.get("/home", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
});
app.get("/home/*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
});







// 這個路徑就是要填在 LINE Developers 裡的 Webhook URL
app.post("/webhook", async (req, res) => {
    const events = req.body.events || [];

    console.log("📩 收到 LINE Webhook：");
    console.dir(events, { depth: null });

    for (const ev of events) {
        // 訊息事件
        if (ev.type === "message" && ev.message.type === "text") {
            const replyToken = ev.replyToken;
            const userText = ev.message.text;
            const userId = ev.source.userId;

            if (userText == "我的ID") {
                await replyMessage(replyToken, {
                    type: "text",
                    text: userId,
                });
            }
            if (userText == "互動網頁") {
                await replyMessage(replyToken, {
                    type: "text",
                    text: "https://lorriane-unavid-indeterminedly.ngrok-free.dev/liff",
                });
            }
            else {
                await replyMessage(replyToken, {
                    type: "text",
                    text: `你輸入了：${userText}`,
                });
            }

        }

        // beacon 事件（之後你會用到）
        if (ev.type === "beacon") {
            const replyToken = ev.replyToken;
            const hwid = ev.beacon.hwid;
            const enterOrLeave = ev.beacon.type; // "enter" 或 "leave"

            await replyMessage(replyToken, {
                type: "text",
                text: `偵測到 Beacon (${hwid})，事件：${enterOrLeave}`,
            });
        }
    }

    // 一定要回 200 給 LINE，不然會被當作 webhook 失敗
    res.status(200).end();
});


// 用 LINE Messaging API 回覆訊息
async function replyMessage(replyToken, message) {
    if (!CHANNEL_ACCESS_TOKEN) {
        console.warn("⚠️ 尚未設定 CHANNEL_ACCESS_TOKEN，無法回覆訊息");
        return;
    }

    try {
        await axios.post(
            "https://api.line.me/v2/bot/message/reply",
            { replyToken, messages: [message] },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
                },
            }
        );
    } catch (err) {
        console.error("回覆訊息失敗：", err.response?.data || err.message);
    }
}


const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
    console.log(`✅ LINE Webhook server 已啟動，port = ${PORT}`);
    console.log(`   等一下記得把「https://你的網域/webhook」填到 LINE Developers 裡`);
});

// 印出關閉訊息（如果程式真的被關掉，這行會出現）
server.on("close", () => {
    console.log("🛑 server 被關閉了");
});
