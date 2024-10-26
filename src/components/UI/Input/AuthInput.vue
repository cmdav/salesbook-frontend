<template>
  <div class="relative">
    <Label :class="labelClasses">{{ label }}</Label>
    <input
      :class="error ? 'border-[#DA5252]' : ' border-neutral-900/[40%]'"
      class="w-full font-light font-Satoshi400 text-[14px] outline-none !p-[12px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
      :placeholder="placeholder"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :min="min"
      :max="max"
    />
    <errorInputIcon v-if="error" class="absolute top-8 right-2" />
    <span v-if="error" class="text-red-600 font-Satoshi400 text-sm">{{ errorsMsg }}</span>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
import errorInputIcon from "@/components/icons/errorInputIcon.vue";

const Label = defineAsyncComponent(() => import("./Label.vue"));
defineProps({
  modelValue: String | Number,
  type: String,
  placeholder: String,
  error: Boolean,
  errorsMsg: String,
  label: String,
  labelClasses: String,
  min: String,
  max: String,
});

const emit = defineEmits(["update:modelValue"]);
</script>
