<script setup>
import { type } from "jquery";

const props = defineProps({
  Name: {
    type: String,
    default: "XXX",
  },
  Age: {
    type: String,
    default: "XXX",
  },
  Contry: {
    type: String,
    default: "XXX",
  },

  Bool: {
    type: Boolean,
    default: false,
  },

  Obj: {
    type: Object,
    default: () => ({}),
  },
  Array: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div>
    <h3 class="text-white">
      hello {{ props.Name }}, you are {{ props.Age }} years old. Your contry is
      {{ props.Contry }}
    </h3>
  </div>
</template>

<style></style>
