<template>
  <div
    class="modal backdrop-blur z-[100] fixed animate__zoomIn animate__rubberBand animate__fadeOut min-h-screen h-full"
  >
    <div
      class="modal__body relative w-full md:max-w-[600px] bg-white m-0 md:px-5 py-4 px-4"
    >
      <header
        class="flex flex-row items-center justify-between border-b-[#000000] pb-[5px] mb-[35px] border-b-[1px]"
      >
        <h4 class="text-[32px] font-EBGaramond500 text-[#244034]">
         {{ title || "Edit Detail" }} 
        </h4>
        <button class="close-button" @click="$emit('close')">&#10005;</button>
      </header>
         <form @submit.prevent="editForm">
            <ReusableForm :fields="formField"/>
            <input type="submit"  v-if="!loading"  value="Submit">
              
              <Loader v-else />
        </form>
    </div>
  </div>
</template>

<script setup>
  
import { watch, defineProps, toRefs, ref} from 'vue';
import ReusableForm from "@/components/Form/ReusableForm.vue"; 
import Loader from "@/components/UI/Loader.vue";
import { useEditComposable} from '@/composable/useEditComposable';

const title = ref();

const props = defineProps({
  items: Object,
  formField: Object,
  modalTitle:String
});

const { items, formField, modalTitle } = toRefs(props); 
const { editForm, loading} = useEditComposable()

watch(items, (newItems) => {
  if (newItems) {
    formField.value.forEach(field => {
      field.value = newItems[field.databaseField] || ''; 
    });
   
    title.value = "Edit currency name:" + newItems[modalTitle.value]
    
  } 
}, { immediate: true, deep: true }); 
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
