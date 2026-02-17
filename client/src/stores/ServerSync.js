import { defineStore } from 'pinia';
import { watch } from 'vue';
import { useGenStore } from './Gen';
import {
    apiCreateSession,
    apiReadSession,
    apiUpdateSession,
    apiDeleteSession
} from "./api/clientApi.js";

export const useServerSyncStore = defineStore('serverSync', () => {
    const genStore = useGenStore();

    let uuid = "huang";
    let Data = [];

    // Watch for deep changes in ItemScale
    watch(
        () => genStore.ItemScale,
        (newValue) => {
            Data = [uuid];
            for (let i = 0; i < newValue.length; i++) {
                Data.push(newValue[i])
            }
            apiCreateSession(Data);
            console.log(Data);
        },
        { deep: true }
    );

    return {};
});
