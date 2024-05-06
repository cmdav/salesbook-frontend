<template>
  <div
    class="modal backdrop-blur z-[100] fixed animate__zoomIn animate__rubberBand animate__fadeOut min-h-screen h-full"
  >
    <div
      class="modal__body relative w-full md:max-w-[66%] bg-white m-0 md:px-5 py-4 px-4"
    >
      <header
        class="flex flex-row items-center justify-between border-b-[#000000] pb-[5px] mb-[35px] border-b-[1px]"
      >
        <h4 class="text-[32px] font-EBGaramond500 text-[#244034]">{{ title }}</h4>
        <button class="close-button" @click="$emit('close')">&#10005;</button>
      </header>
      <form @submit.prevent="submitForm">
        <div><slot></slot></div>
        <div class="flex justify-center">
          <input
            type="submit"
            v-if="!props.loading"
            class="btn-brand"
            :value="props.buttonLabel"
          />
          <Loader v-else />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useProductStore } from "@/stores/products";

import { storeToRefs } from "pinia";
const productsStore = useProductStore();


const { allProductTypeName } = storeToRefs(productsStore);
console.log(allProductTypeName)

const emits = defineEmits(["submitForm"]);

const submitForm = () => {
  emits("submitForm");
};
const props = defineProps({
  buttonLabel: String,
  title: String,
  loading: {
    type: Boolean,
    default: false,
  },
});

onMounted(async () => {

  await productsStore.handleGetAllProductTypeName();
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
  max-width: 65%; // Updated width to two-thirds of the screen width
  background-color: #fff;
  border-radius: 12px;
  animation: slidedown 0.8s ease;
  max-height: 95vh; // Set a maximum height
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
