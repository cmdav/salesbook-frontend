<template>
  <div class="relative">
    <Label :class="labelClasses">{{ label }}</Label>
    <input
      :class="error ? 'border-[#DA5252]' : ' border-neutral-900'"
      class="w-full font-light font-Satoshi400 text-[14px] outline-none !p-[14px] border-[0.509px] opacity-[0.8029] rounded-[4px] text-sm"
      :placeholder="placeholder"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

const Label = defineAsyncComponent(() => import('./Label.vue'))
defineProps({
  modelValue: String | Number,
  type: String,
  placeholder: String,
  error: Boolean,
  errorsMsg: String,
  label: String,
  labelClasses: String
})

const emit = defineEmits(['update:modelValue'])
</script>
