<template>
  <div>
    <Label :class="labelClasses">{{ label }}</Label>
    <div class="relative">
      <input
        :type="showPassword ? 'text' : 'password'"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        :value="modelValue"
        :class="error ? 'border-[#ef4b4b]' : 'border-neutral-900/[40%]'"
        class="w-full font-light font-Satoshi400 text-[14px] !p-[12px] outline-none border-[1px] opacity-[0.8029] rounded-[4.074px] text-sm"
      />
      <div class="absolute right-3 top-3 text-[#D1D1D6]">
        <button type="button" @click="toggleShowPassword()" v-if="showPassword">
          <PasswordEyeIcon />
        </button>
        <button type="button" @click="toggleShowPassword()" v-if="!showPassword">
          <PasswordSlashEyeIcon class="text-[]" />
        </button>
      </div>
      <span v-if="error" class="text-red-600 font-Satoshi400 text-sm">{{
        errorsMsg
      }}</span>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { defineAsyncComponent } from "vue";
const Label = defineAsyncComponent(() => import("./Label.vue"));
import PasswordEyeIcon from "@/components/icons/PasswordEyeIcon.vue";
import PasswordSlashEyeIcon from "@/components/icons/PasswordSlashEyeIcon.vue";
defineProps({
  placeholder: String,
  modelValue: String,
  error: Boolean,
  errorsMsg: String,
  label: String,
  labelClasses: String,
});
const emit = defineEmits(["update:modelValue"]);

const showPassword = ref(false);

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};
</script>
