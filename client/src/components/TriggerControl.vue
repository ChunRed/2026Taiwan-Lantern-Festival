<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const toggle = () => {
  emit('update:modelValue', !props.modelValue);
};
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50">
    <button 
      class="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full border border-white/30 flex items-center justify-center text-white text-xs hover:bg-white/30 transition-colors shadow-lg"
      @click="toggle"
    >
      {{ modelValue ? 'ON' : 'OFF' }}
    </button>
  </div>
</template>
