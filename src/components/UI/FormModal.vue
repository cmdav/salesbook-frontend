<template>
  <div class="modal backdrop-blur z-[100] fixed animate__zoomIn animate__rubberBand animate__fadeOut min-h-screen h-full">
    <div class="modal__body relative w-full md:max-w-[600px] bg-white m-0 md:px-5 py-4 px-4">
      <h3>{{ formTitle }}</h3>
      <button class="close-button" @click="$emit('close')">&#10005;</button>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
  const { formTitle } = defineProps({
    formTitle: String
  });
</script>

<style lang="scss" scoped>
.modal {
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; 
  background: rgba(0, 0, 0, 0.3);
}

.modal__body {
  position: relative;
  max-width: 600px; // Consider using max-width for better responsiveness
  background-color: #fff;
  border-radius: 12px;
  animation: slidedown 0.8s ease;
  max-height: 90vh; // Set a maximum height
  overflow-y: auto; // Enable vertical scrolling
}

.close-button {
  position: absolute;
  right: 20px;
  top: 20px;
  background: none;
  border: none;
  font-size: 25px;
  cursor: pointer;
}
</style>
