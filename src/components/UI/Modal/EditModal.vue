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
          {{ modalTitle || "Edit Detail" }}
        </h4>
        <button class="close-button" @click="$emit('close')">&#10005;</button>
      </header>
      <form @submit.prevent="editForm">
        <ReusableForm 
            :fields="formField"  
            @handleEditCategoryChange="handleEditCategoryChange" 
            :imagePath="imagePath" 
            />
        <input type="submit" v-if="!loading" class="btn-brand" value="Submit" />

        <Loader v-else />
      </form>
    </div>
  </div>
</template>

<script setup>
import { watch, defineProps, toRefs, onMounted, defineEmits, ref} from "vue";
import { useSharedComponent } from "@/composable/useSharedComponent";
const { ReusableForm, Loader, useEditComposable } = useSharedComponent();



const props = defineProps({
  items: Object,
  formField: Object,
  modalTitle: String,
  subCategoryIdToPopulate:{
    type:String,
    default:""
  },
  url: String,
});
const emit = defineEmits(["fetchDataForSubCategory", "handleEditCategoryChange","close"]);
const { items, formField, modalTitle, url,subCategoryIdToPopulate } = toRefs(props);
const { editForm, loading } = useEditComposable(formField, url.value, items.value["id"], emit);
const imagePath = ref();

watch(items, (newItems) => {
  if (newItems) {
    //console.log(newItems)
    formField.value.forEach(field => {
      field.value = newItems[field.databaseField] || ''; 
     
        if(field.type == 'select') {
          //set the selected item
          const selectedItem = field.options.find(option => option.label === newItems[field.databaseField]);
          if (selectedItem) {
             field.value = selectedItem.value; 
             
           }
        } else {
          
          field.value = newItems[field.databaseField];
        }
    });

    
    Object.keys(newItems).forEach(key => {
       const isImageField = /.*(image|logo|file)$/.test(key); // Check if key ends with 'image', 'logo', or 'file'
       const field = formField.value.find(f => f.databaseField === key)
       
       if (isImageField && field) {
        
         imagePath.value = field.value;
        //console.log(field.value)
        } 
    });
    
  } 
}, { immediate: true, deep: true }); 

const handleEditCategoryChange = (value, field_name) => {

  emit('fetchDataForSubCategory',value, field_name);
  
};

onMounted(async () => {
  // console.log(items.value)
  emit('fetchDataForSubCategory', items.value["cat_id"], "category_id",items.value[subCategoryIdToPopulate.value]);
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
