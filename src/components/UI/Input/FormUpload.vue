<template>
  <div class="form__group">
    <Label :class="labelClasses">{{ label }}</Label>
    <div class="w-full">
      <Input
        @update:modelValue="passInputValue"
        :value="modelValue"
        :class="inputClasses"
        :placeholder="placeholder"
        type="file"
        :name="name"
        hidden
        ref="uploadFile"
        accept=""
        id="uploadFile"
        class="!hidden"
      />

      <label
        for="uploadFile"
        class="cursor-pointer w-full justify-between items-center !flex form__input py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none rounded text-[12px]"
        >{{ placeholder }}</label
      >
    </div>

    <label class="text-2xl text-left" :name="name" />
  </div>
</template>

<script setup>
import { defineAsyncComponent } from "vue";

const Input = defineAsyncComponent(() => import("./Input.vue"));
const Label = defineAsyncComponent(() => import("./Label.vue"));

const emit = defineEmits(["update:modelValue"]);

defineProps({
  type: String,
  placeholder: String,
  label: String,
  name: String,
  labelClasses: String, // Optional
  inputClasses: String, // Optional
  modelValue: String | Number,
});

const passInputValue = (value) => {
  emit("update:modelValue", value);
};
</script>

<style lang="scss" scoped></style>
