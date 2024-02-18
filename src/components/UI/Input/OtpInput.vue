<template>
  <div
    ref="otpCont"
    class="flex flex-row w-full lg:justify-normal justify-between gap-2 lg:gap-[12px]"
  >
    <input
      :type="type"
      :class="error ? 'border-[#DA5252]' : ' border-[#254035AB]'"
      class="border-[1px] lg:w-[60px] lg:h-[66px] h-[55px] w-[50px] password-input text-center flex flex-row rounded-[8px] p-4 py-1.5"
      v-for="(el, ind) in digits"
      :key="el + ind"
      v-model="digits[ind]"
      :autofocus="ind === 0"
      maxlength="1"
      @input="handleInput($event, ind)"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

const props = defineProps({
  modelValue: String,
  type: String,
  error: Boolean,

  digitCount: {
    type: Number,
    required: true,
  },
});

const digits = reactive([]);

if (props.modelValue && props.modelValue.length === props.digitCount) {
  for (let i = 0; i < props.digitCount; i++) {
    digits[i] = props.modelValue.charAt(i);
  }
} else {
  for (let i = 0; i < props.digitCount; i++) {
    digits[i] = null;
  }
}

const otpCont = ref(null);

const emit = defineEmits(["update:modelValue"]);

const handleInput = function (event, index) {
  const input = event.target.value;

  if (input.length === 1 && new RegExp("^([0-9])$").test(input)) {
    digits[index] = input;

    if (index !== props.digitCount - 1) {
      otpCont.value.children[index + 1].focus();
    } else {
      // Emit the entered digits on each input
      emit("update:modelValue", digits.join(""));
    }
  }
};
</script>
<style scoped>
.digit-box {
  height: 4rem;
  width: 2rem;
  border: 2px solid black;
  display: inline-block;
  border-radius: 5px;
  margin: 5px;
  padding: 15px;
  font-size: 3rem;
  color: black;
}

.digit-box:focus {
  outline: 3px solid black;
}
.password-input::part(eye)::before {
  /* change the default password eye from . to * */
  content: "*";
}
.password-input::part(eye)::after {
  /* change the default password eye from . to * */
  content: "*";
}
input[type="password"] {
  -webkit-text-security: square !important;
}
</style>
