<template>
  <div class="w-full">
    <Label :class="labelClasses">{{ label }}</Label>
    <Select
      @update:modelValue="passInputValue"
      :value="modelValue"
      :inputClasses="inputClasses"
      :placeholder="placeholder"
      :name="name"
      :items="items"
    />
    <p v-if="error" class="text-red-600 pl-2 font-Satoshi400 text-left text-[10.24px]">
      {{ errorsMsg }}
    </p>
  </div>
</template>

<script setup>
// import { defineAsyncComponent } from "vue";

import Select from "./Select.vue";
import Label from "./Label.vue";

const emit = defineEmits(["update:modelValue"]);

defineProps({
  type: String,
  placeholder: String,
  label: String,
  name: String,
  labelClasses: String, // Optional
  inputClasses: String, // Optional
  modelValue: String | Number,
  items: Array,
  errorsMsg: String,
  error: Boolean,
});

const passInputValue = (value) => {
  emit("update:modelValue", value);
};
</script>
