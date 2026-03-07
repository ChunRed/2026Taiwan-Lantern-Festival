import { defineStore } from 'pinia';
import { watch } from 'vue';
import { useGenStore } from './Gen';
import {
    apiCreateSession,
    apiReadSession,
    apiUpdateSession,
    apiDeleteSession,
    apiFindSessionByUserId
} from "./api/clientApi.js";

export const useServerSyncStore = defineStore('serverSync', () => {
    const genStore = useGenStore();

    let newData = [];

    // Watch for deep changes in ItemScale
    watch(
        () => genStore.ItemScale,
        async (newValue) => {
            if (isInitializing) return;

            if (!genStore.userId) {
                console.warn('User ID not set yet, skipping sync');
                // Construct new data
                newData = ['test', ...newValue, ""];
                SendData('test');
            }
            else {
                // Construct new data
                newData = [genStore.userId, ...newValue, ""];
                SendData(genStore.userId);
            }

        },
        { deep: true }
    );


    const SendData = async (uuid) => {
        try {
            // Check if session exists (OPTIMIZATION: Could cache sessionId to avoid repetitive lookups)
            const existingSession = await apiFindSessionByUserId(uuid);

            if (existingSession && existingSession.id) {
                // Update existing
                await apiUpdateSession(existingSession.id, newData);
                //console.log('Updated session:', existingSession.id, newData);
            } else {
                // Create new
                await apiCreateSession(newData);
                //console.log('Created new session:', newData);
            }
        } catch (error) {
            console.error('Sync failed:', error);
        }
    }

    let isInitializing = false;

    const initializeSync = async (userId) => {
        if (!userId) {
            userId = 'test';
        }

        isInitializing = true;
        try {
            //console.log('Initializing sync for user:', userId);
            const existingSession = await apiFindSessionByUserId(userId);

            if (existingSession && existingSession.items_mas) {
                // Extract everything after userId
                let remoteScale = existingSession.items_mas.slice(1);

                // If the last item is a string (uploadName), remove it so we only have numbers
                if (typeof remoteScale[remoteScale.length - 1] === 'string') {
                    remoteScale.pop();
                }

                // If it's an old save (8 items, no deer god), pad it to 9 items
                if (remoteScale.length === 8) {
                    genStore.ItemScale = [...remoteScale, 0];
                }
                // Restore new save (9 items)
                else if (remoteScale.length === 9) {
                    genStore.ItemScale = remoteScale;
                }
            } else {
                // Create new default
                //console.log('No session found. Creating default for:', userId);
                const defaultScale = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                const newDataInit = [userId, ...defaultScale, ""];

                await apiCreateSession(newDataInit);
                genStore.ItemScale = defaultScale; // This will trigger watch, but we can manage it
            }
        } catch (error) {
            console.error('Initialization failed:', error);
        } finally {
            // Tiny delay to ensure watch triggers are cleared or ignored if we wanted
            setTimeout(() => {
                isInitializing = false;
            }, 100);
        }
    }

    return {
        initializeSync
    };
});
