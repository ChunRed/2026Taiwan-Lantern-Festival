// ngrok http 4000

const express = require('express');
const app = express();

// 1. 修正 http 的引入方式
const http = require('http');

const axios = require("axios");
const path = require('path');
const line = require('@line/bot-sdk');

// 2. 必須從 socket.io 中解構出 Server 類別
const { Server } = require("socket.io");

// LINE Bot 配置
const config = {
    channelAccessToken: 'sVrh9lLrLa1c3El9Pgcw/xHMWu/uJ20qs8cB4N4vw1GGaauwjVy7tqnNsu8FwbU/XIRygGBy4FsAHygu5+dsAl7WLfgopy5xYq+grxNm+zdB0z9HjwX2Z526fE2b1KQKDXmvYB/d9Rux8SWqn5b5LwdB04t89/1O/w1cDnyilFU=',
    channelSecret: 'ac6012cf3c7c1350a1100b748555e468'
};

// 3. 正確建立伺服器
const server = http.createServer(app);

// 4. 正確初始化 Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const client = new line.Client(config);

// --- 以下邏輯保持不變 ---

io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);
    socket.on('register', (userId) => {
        if (userId) {
            socket.join(userId);
            console.log(`Socket ${socket.id} joined room ${userId}`);
        }
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

app.use(express.static(path.join(__dirname, '../client/dist')));

app.post('/webhook', line.middleware(config), (req, res) => {
    Promise.all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});

async function handleEvent(event) {
    if (event.type === 'beacon') {
        const { hwid, type } = event.beacon;
        const userId = event.source.userId;

        if (type === 'enter') {

            const hwid = event.beacon.hwid;
            const rawDm = event.beacon.dm; // 這裡是 hex 字串 "524f4f4d31"

            if (rawDm) {
                // 將 Hex 轉換回 ASCII 字串
                const buffer = Buffer.from(rawDm, 'hex');
                const roomName = buffer.toString('utf8');

                console.log(`用戶 ${userId} 收到來自 HWID: ${hwid} 的訊號，位置在: ${roomName}`);
                console.log(roomName);

                if (roomName === "ROOM1") {
                    // 推送到前端 Vue
                    io.to(userId).emit('beacon-enter', {
                        type: 'text',
                        hwid: hwid,
                        message: '靠近了baecon'
                    });
                    //推送到line聊天室
                    // return client.pushMessage(userId, {
                    //     type: 'text',
                    //     text: '靠近了baecon！發現了一隻鹿。'
                    // });
                }

                else if (roomName === "ROOM2") {
                    // 推送到前端 Vue
                    io.to(userId).emit('beacon-enter', {
                        type: 'text',
                        hwid: hwid,
                        message: '離開了baecon'
                    });
                    //推送到line聊天室
                    // return client.pushMessage(userId, {
                    //     type: 'text',
                    //     text: '離開了一隻鹿。'
                    // });
                }
            }

        }
    }
    return Promise.resolve(null);
}

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});