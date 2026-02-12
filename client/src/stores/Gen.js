import { defineStore } from 'pinia'
import { ref } from 'vue'
import { io } from 'socket.io-client'

export const useGenStore = defineStore('gen', () => {

    const socket = ref(null)
    const userId = ref(null)
    const current_state = ref(' -- ');
    const beaconStatus = ref(0);
    const isTriggerActive = ref(false);

    let triggerName = [
        ' -- ',
        ' -- ',
        '構樹鹿',
        '月桃鹿',
        '青剛櫟鹿',
        '小葉桑鹿',
        '五節芒鹿',
        '赤榕鹿',
        '穀穗鹿',
        '金草蘭鹿',
    ]

    const triggerTimer = ref(0);
    let countdownInterval = null;

    function startCountdown() {
        if (countdownInterval) clearInterval(countdownInterval);
        triggerTimer.value = 10;

        countdownInterval = setInterval(() => {
            triggerTimer.value--;
            if (triggerTimer.value <= 0) {
                clearInterval(countdownInterval);
                isTriggerActive.value = false;
            }
        }, 1000);
    }

    function stopCountdown() {
        if (countdownInterval) clearInterval(countdownInterval);
        triggerTimer.value = 0;
    }

    function initSocket(uid) {
        if (!uid) return
        userId.value = uid

        // Dev environment: user runs app on port 5173, server on 4000
        // Production: served by express, relative path ok
        const serverUrl = import.meta.env.DEV ? 'http://localhost:4000' : ''

        // Connect to server
        socket.value = io(serverUrl)

        socket.value.on('connect', () => {
            console.log('Socket Connected:', socket.value.id)
            // Join room with userId
            socket.value.emit('register', uid)
        })


        socket.value.on('beacon-enter', (data) => {
            beaconStatus.value = Number(data.message); // Store raw status

            if (data.message == 1) {
                alert('您已離開一隻鹿！')
                current_state.value = '您已離開一隻鹿！';
                isTriggerActive.value = false;
                stopCountdown();
            }
            else if (data.message > 1 && data.message < triggerName.length) {
                alert('您已接近' + triggerName[data.message])
                current_state.value = '您已接近' + triggerName[data.message];
                isTriggerActive.value = true;
                startCountdown();
            }
        })
    }

    // State
    const loadingFinish = ref(false)

    const gen = ref([]);
    const ItemScale = ref([20, 40, 60, 80, 10, 30, 50, 70]);
    const SelectedItemRate = ref([]);


    const SetGen = (newValue) => {
        gen.value = [];
        SelectedItemRate.value = [0, 0, 0, 0, 0, 0, 0, 0];

        let mergeScale = 0;

        for (let i = 0; i < newValue.length; i++) {
            if (newValue[i] == true) {
                gen.value.push(i);
                mergeScale += ItemScale.value[i];
            }
        }

        for (let i = 0; i < newValue.length; i++) {
            let rate = ItemScale.value[gen.value[i]] / mergeScale;
            SelectedItemRate.value[i] = rate;
        }
        console.log(SelectedItemRate.value);
        console.log(gen.value);

    }





    return {
        gen,
        ItemScale,
        SelectedItemRate,
        SetGen,
        initSocket,
        socket,
        userId,
        userId,
        loadingFinish,
        current_state,
        isTriggerActive,
        triggerTimer,
        startCountdown,
        stopCountdown
    }
})
