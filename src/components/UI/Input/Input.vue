<template>
  <input
    v-bind="$attrs"
    class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none rounded"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
defineProps({
  modelValue: String | Number,
});

const emit = defineEmits(["update:modelValue"]);
</script>
