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


app.use(express.json());

// Enable CORS for development
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// API Route to update plant color
app.post('/api/update-plant-color', (req, res) => {
    const { index, color } = req.body;
    const fs = require('fs');
    // Adjust path to reach client/src/data/plantData.json from server/
    const filePath = path.join(__dirname, '../client/src/data/plantData.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading plant data:', err);
            return res.status(500).send('Error reading data');
        }

        try {
            const plants = JSON.parse(data);
            if (index >= 0 && index < plants.length) {
                plants[index].themeColor = color;

                fs.writeFile(filePath, JSON.stringify(plants, null, 4), (err) => {
                    if (err) {
                        console.error('Error writing plant data:', err);
                        return res.status(500).send('Error writing data');
                    }
                    console.log(`Updated plant ${index} color to ${color}`);
                    res.json({ success: true });
                });
            } else {
                res.status(400).send('Invalid index');
            }
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            res.status(500).send('Error parsing data');
        }
    });
});

app.use(express.static(path.join(__dirname, '../client/dist')));


// API Route to save all plant data (for reordering)
app.post('/api/save-plant-data', (req, res) => {
    const defaultPoints = req.body;
    const fs = require('fs');
    const filePath = path.join(__dirname, '../client/src/data/plantData.json');

    fs.writeFile(filePath, JSON.stringify(defaultPoints, null, 4), (err) => {
        if (err) {
            console.error('Error writing plant data:', err);
            return res.status(500).send('Error writing data');
        }
        console.log('Updated all plant data');
        res.json({ success: true });
    });
});


async function handleEvent(event) {
    if (event.type === 'beacon') {
        const { hwid, type } = event.beacon;
        const userId = event.source.userId;

        if (type === 'enter') {

            const hwid = event.beacon.hwid;
            const dmHex = event.beacon.dm;

            if (dmHex) {
                const deviceId = parseInt(dmHex, 16);

                console.log(`用戶 ${userId} 收到來自 HWID: ${hwid} 的訊號，位置在: ${deviceId}`);

                // 推送到前端 Vue
                io.to(userId).emit('beacon-enter', {
                    type: 'text',
                    hwid: hwid,
                    message: deviceId
                });

                //推送到line聊天室
                // return client.pushMessage(userId, {
                //     type: 'text',
                //     text: '靠近了baecon！發現了一隻鹿。'
                // });
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