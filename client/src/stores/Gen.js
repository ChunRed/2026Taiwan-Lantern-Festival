import { defineStore } from 'pinia'
import { ref } from 'vue'
import { io } from 'socket.io-client'

export const useGenStore = defineStore('gen', () => {

    const socket = ref(null)
    const userId = ref(null)

    let trigger_state = 100;
    let current_state = 100;

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
            if (data.message == '靠近了baecon') {
                alert(data.message || '您已靠近一隻鹿！')
                trigger_state = 1;
            }
            else if (data.message == '離開了baecon') {
                alert(data.message || '您已離開一隻鹿！')
                trigger_state = 0;
            }

            // if (current_state != trigger_state) {
            //     if (trigger_state == 0) alert(data.message || '您已離開一隻鹿！')
            //     else if (trigger_state == 1) alert(data.message || '您已接近一隻鹿！')
            //     current_state = trigger_state;
            // }
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
        loadingFinish
    }
})
