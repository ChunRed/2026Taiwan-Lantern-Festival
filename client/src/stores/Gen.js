import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { io } from 'socket.io-client'

export const useGenStore = defineStore('gen', () => {

    const socket = ref(null)
    const userId = ref(null)
    const current_state = ref(' -- ');
    const beaconStatus = ref(0);
    const isTriggerActive = ref(false);
    const isHomeLoading = ref(false);
    const hasVisitedHome = ref(false);
    const notificationMessage = ref('');
    const notificationVisible = ref(false);

    function showNotification(msg) {
        notificationMessage.value = msg;
        notificationVisible.value = true;
    }

    function closeNotification() {
        notificationVisible.value = false;
        setTimeout(() => {
            notificationMessage.value = '';
        }, 300);
    }

    let triggerName = [
        ' -- ',
        ' -- ',
        '赤榕鹿',
        '金草蘭鹿',
        '穀穗鹿',
        '構樹鹿',
        '月桃鹿',
        '青剛櫟鹿',
        '小葉桑鹿',
        '五節芒鹿',
    ]

    const triggerTimer = ref(0);
    let countdownInterval = null;

    function startCountdown() {
        if (countdownInterval) clearInterval(countdownInterval);
        triggerTimer.value = 55;

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
        socket.value = io(serverUrl);

        socket.value.on('connect', () => {
            console.log('Socket Connected:', socket.value.id)
            // Join room with userId
            socket.value.emit('register', uid)
        })


        socket.value.on('beacon-enter', (data) => {
            beaconStatus.value = Number(data.message); // Store raw status

            if (data.message == 1) {
                showNotification('您已離開一隻鹿！');
                current_state.value = '您已離開一隻鹿！';
                isTriggerActive.value = false;
                stopCountdown();
            }
            else if (data.message > 1 && data.message < triggerName.length) {
                showNotification('您已接近' + triggerName[data.message]);
                current_state.value = '您已接近' + triggerName[data.message];
                isTriggerActive.value = true;
                startCountdown();
            }
        })
    }


    function QueryParameters() {
        if (beaconStatus.value == 1) {
            showNotification('您已離開一隻鹿！');
            current_state.value = '您已離開一隻鹿！';
            isTriggerActive.value = false;
            stopCountdown();
        }
        else if (beaconStatus.value > 1 && beaconStatus.value < triggerName.length) {
            showNotification('您已接近' + triggerName[beaconStatus.value]);
            current_state.value = '您已接近' + triggerName[beaconStatus.value];
            isTriggerActive.value = true;
            startCountdown();
        }
    }

    // Check URL parameters on store initialization
    if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        let statusFromUrl = urlParams.get('BeaconStatus');

        // Also check hash in case Vue Router appended it there
        if (!statusFromUrl && window.location.hash.includes('?')) {
            const hashParams = new URLSearchParams(window.location.hash.split('?')[1]);
            statusFromUrl = hashParams.get('BeaconStatus');
        }

        if (statusFromUrl) {
            beaconStatus.value = Number(statusFromUrl);
            QueryParameters();
        }
    }


    function toggleManualTrigger(status) {
        if (!isTriggerActive.value) {
            // Turn ON
            beaconStatus.value = status;
            isTriggerActive.value = true;
            if (status > 1 && status < triggerName.length) {
                showNotification('您已接近' + triggerName[status]);
                current_state.value = '您已接近' + triggerName[status];
            }
            startCountdown();
        } else {
            // Turn OFF
            isTriggerActive.value = false;
            showNotification('您已離開一隻鹿！');
            current_state.value = '您已離開一隻鹿！';
            stopCountdown();
        }
    }

    // State
    const loadingFinish = ref(false)

    const gen = ref([]);
    const ItemScale = ref([0, 0, 0, 0, 0, 0, 0, 0]);
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




    let incrementInterval = null;

    function stopIncrementing() {
        if (incrementInterval) {
            clearInterval(incrementInterval);
            incrementInterval = null;
        }
    }

    function startIncrementing() {
        stopIncrementing();

        if (!isTriggerActive.value) return;

        incrementInterval = setInterval(() => {
            // beaconStatus 2 -> ItemScale[0]
            // beaconStatus 3 -> ItemScale[1]
            // ...
            const index = beaconStatus.value - 2;
            if (index >= 0 && index < ItemScale.value.length) {
                if (ItemScale.value[index] < 100) {
                    ItemScale.value[index] += 10;
                    if (ItemScale.value[index] > 100) {
                        ItemScale.value[index] = 100;
                    }
                }
                // console.log(`Auto-incrementing ItemScale[${index}]:`, ItemScale.value[index]);
            }
        }, 10000);
    }

    watch([isTriggerActive, beaconStatus], ([newActive, newStatus], oldValues) => {
        const oldActive = oldValues ? oldValues[0] : undefined;
        const oldStatus = oldValues ? oldValues[1] : undefined;

        if (newActive) {
            // If it just became active OR status changed, restart the timer
            if (newActive !== oldActive || newStatus !== oldStatus) {
                startIncrementing();
            }
        } else {
            stopIncrementing();
        }
    }, { immediate: true });


    return {
        gen,
        ItemScale,
        SelectedItemRate,
        SetGen,
        initSocket,
        socket,
        userId,
        loadingFinish,
        current_state,
        isTriggerActive,
        triggerTimer,
        startCountdown,
        stopCountdown,
        isHomeLoading,
        hasVisitedHome,
        beaconStatus,
        notificationMessage,
        notificationVisible,
        showNotification,
        closeNotification,
        toggleManualTrigger,
        QueryParameters
    }
})
