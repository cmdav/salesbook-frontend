<template>
  <div>
    <div
      @drop.prevent="handleUploadFile"
      class="bg-brand/10 p-4 rounded-lg flex cursor-pointer flex-col gap-4 border-dashed border-[#254035AB] border-[1.789px]"
    >
      <input
        type="file"
        name="image"
        ref="image"
        @input="uploadImage"
        class="hidden"
        id="image"
      />
      <div class="flex justify-center">
        <CloudUploadIcon />
      </div>

      <div>
        <h4 class="text-sm text-center font-semibold mb-2">
          Drag & drop files or <label for="image" class="text-brand">Browse</label>
        </h4>

        <div class="text-gray-500 text-center text-[10px]">
          Supported formates: JPEG, PNG,
        </div>
      </div>
    </div>

    <div v-if="previewImage" class="my-4">
      <img :src="previewImage" class="h-12 w-12 rounded-md object-cover" alt="" />
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from "vue";
import CloudUploadIcon from "@/components/icons/cloudUploadIcon.vue";

const prop = defineProps(["title", "modelValue"]);

const emit = defineEmits(["defaultImage"]);

const previewImage = ref(null);

const image = ref(null);

watch(
  () => prop.modelValue,
  () => {
    previewImage.value = prop.modelValue;
  }
);

const handleUploadFile = async (e) => {
  let dt = e.dataTransfer;
  let files = dt.files;
  let file = files[0];

  previewImage.value = URL.createObjectURL(file);

  emit("defaultImage", file);
};

const uploadImage = async () => {
  let formData = new FormData();
  let file = image.value.files[0];
  previewImage.value = URL.createObjectURL(file);

  emit("defaultImage", file);
};
</script>
