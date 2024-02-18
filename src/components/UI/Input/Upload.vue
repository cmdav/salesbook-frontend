<template>
  <div class="upload_container">
    <label class="upload" for="upload_file">
      <p class="">Drag and Drop file or <span class="underline">Browse</span> CV</p>
      <p class="">max 10MB each.</p>
      <CloudUploadIcon class="mx-auto mt-4" />
      <img
        v-for="(imageUrl, index) in imageUrls"
        :key="index"
        :src="imageUrl"
        alt="Uploaded Image"
        class="image_container"
      />
    </label>
    <input
      type="file"
      multiple
      accept="image/*"
      hidden
      id="upload_file"
      @change="handleFiles"
      ref="fileInput"
    />
  </div>
</template>

<script setup>
import CloudUploadIcon from '@/components/icons/cloudUploadIcon.vue'
import { ref, defineProps, defineEmits } from 'vue';

const { imageUrls } = defineProps(['imageUrls']);
const emits = defineEmits(['file-uploaded']); // Define the custom event

const handleFiles = (event) => {
  const files = event.target.files;
  const uploadedFiles = [];

  Array.from(files).forEach((file) => {
    uploadedFiles.push(file);
    previewFile(file);
    uploadFile(file);
  });

const imageUrls = ref([]);

const handleFiles = (event) => {
  const files = event.target.files;
  Array.from(files).forEach((file) => {
    previewFile(file);
    uploadFile(file);
  });
};

const previewFile = (file) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    imageUrls.value.push(reader.result); // Push the image URL directly
  };
};

const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  // You can add your upload logic here
};

onMounted(() => {
  // Access the file input element and trigger the file selection dialog
  const fileInput = $refs.fileInput;
  fileInput.addEventListener("click", () => {
    fileInput.value = null; // Reset the input to allow selecting the same file
  });
});
</script>

<style scoped>
.upload {
  border: 1.5px solid var(--primary-color);
  border-style: dashed;
  cursor: pointer;
  padding: 20px;
  width: 60%;
  margin: 100px auto;
  border-radius: 20px;
  min-height: 40vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
}
.upload_container {
  display: flex;
  align-items: center;
}
.image_container {
  width: 60%;
}
</style>
