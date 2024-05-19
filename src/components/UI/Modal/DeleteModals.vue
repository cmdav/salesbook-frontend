<template>
  <div class="modal backdrop-blur z-[100] fixed animate__zoomIn animate__rubberBand animate__fadeOut min-h-screen h-full">
    <div class="modal__body relative w-full md:max-w-[600px] bg-white m-0 md:px-5 py-4 px-4">
      <header class="flex flex-row items-center justify-between border-b-[#000000] pb-[5px] mb-[35px] border-b-[1px]">
        <h4 class="text-[22px] font-EBGaramond500 text-[#244034]">
          {{ title || "Delete Detail" }}
        </h4>
        <button class="close-button" @click="$emit('close')">&#10005;</button>
      </header>
      <p class="text-center py-4">Are you sure you want to delete this item?</p>
      <form @submit.prevent="handleDelete">
        <div class="flex justify-center">
          <input type="submit" v-if="!loading" class="btn-brand !bg-red-600" value="Delete" />
          <Loader v-else />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { watch, defineProps, toRefs, ref } from "vue";
import Loader from "@/components/UI/Loader.vue";
import { useDeleteComposable } from "@/composable/useDeleteComposable";

const emit = defineEmits(["close", "updated"]);
const title = ref();

const props = defineProps({
  items: Object,
  modalTitle: String,
  url: String,
});
const { items, url } = toRefs(props);

const { deleteForm, loading, showDeleteModal } = useDeleteComposable(url.value, items.value);

const handleDelete = async () => {
  await deleteForm();
  if (!showDeleteModal.value) {
    emit("updated");
    emit("close");
  }
};

watch(
  items,
  (newItems) => {
    if (newItems) {
      title.value = props.modalTitle || "Delete Detail";
    }
  },
  { immediate: true, deep: true }
);
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
  max-width: 600px;
  background-color: #fff;
  border-radius: 12px;
  animation: slidedown 0.8s ease;
  max-height: 90vh;
  overflow-y: auto;
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
