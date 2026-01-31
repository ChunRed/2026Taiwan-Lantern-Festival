import { defineStore } from 'pinia'
import { ref } from 'vue'
import { io } from 'socket.io-client'

export const useGenStore = defineStore('gen', () => {

    const socket = ref(null)
    const userId = ref(null)

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
            console.log('Beacon Enter:', data)
            alert(data.message || '您已靠近一隻鹿！')
        })
    }

    // State
    const loadingFinish = ref(false)

    const gen = ref([]);
    const ItemScale = ref([20, 0, 0, 0, 0, 0, 0, 0]);
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
