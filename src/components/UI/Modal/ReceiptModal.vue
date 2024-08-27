<template>
  <div class="modal backdrop-blur z-[100] fixed min-h-screen h-full flex items-center justify-center">
    <div class="modal__body w-full max-w-md bg-white px-5 py-4 relative">
      <header class="flex justify-between items-center mb-5">
        <h4 class="text-2xl font-semibold text-gray-800">Confirmation</h4>
        <button class="close-button" @click="handleNoClick">&#10005;</button>
      </header>
      <p class="text-lg text-gray-700">Do you want a receipt?</p>
      <div class="flex justify-end mt-6">
        <button
          class="button no-btn bg-gray-300 text-gray-700 px-4 py-2 rounded mr-3"
          @click="handleNoClick"
        >
          No
        </button>
        <button
          class="button yes-btn bg-blue-500 text-white px-4 py-2 rounded"
          @click="handleYesClick"
        >
          Yes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';

const emits = defineEmits(['close']);

const handleYesClick = () => {
  emits('close', 'yes'); // Emit 'yes' when the user clicks "Yes"
};

const handleNoClick = () => {
  emits('close', 'no'); // Emit 'no' when the user clicks "No"
};
</script>


<style lang="scss" scoped>
.modal {
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
}

.modal__body {
  position: relative;
  max-width: 400px;
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.close-button {
  position: absolute;
  right: 15px;
  top: 15px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.button {
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.no-btn {
  background-color: #ccc;
}

.yes-btn {
  background-color: #007bff;
}
</style>
