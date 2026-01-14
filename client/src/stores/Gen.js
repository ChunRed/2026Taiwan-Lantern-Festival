import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGenStore = defineStore('gen', () => {

    const gen = ref([]);
    const ItemScale = ref([20, 0, 30, 30, 40, 40, 50, 50]);
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
        SetGen
    }
})
