<template>
  <select
    v-bind="$attrs"
    class="form__input block w-full p-2 px-1 text-sm font-Satoshi400 text-gray-800 transition duration-500 focus:outline-none rounded"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    :class="inputClasses"
  >
    <option disabled value="">Select {{ placeholder }}</option>

    <option v-for="item in items" :key="item.id" :value="item.id">
      {{ item }}
    </option>
  </select>
</template>

<script setup>
defineProps({
  modelValue: String | Number,
  items: Array,
  placeholder: String,
  inputClasses: String,
});

const emit = defineEmits(["update:modelValue"]);
</script>
