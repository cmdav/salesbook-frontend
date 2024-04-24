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
      <!--Pass the formField and  value(value is gotten onclick from the datatable) as props from the parent to this modal-->
      <form @submit.prevent="editForm">
        <ReusableForm 
            :fields="formField"  
            @handleEditCategoryChange="handleEditCategoryChange" 
            @fieldChanged="handleFieldChanged"
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

//console.log(items.value)
const { editForm, loading } = useEditComposable(formField, url.value, items.value["id"], emit);
const imagePath = ref();

watch(items, (newItems) => {
  if (newItems) {
    console.log(newItems)
    formField.value.forEach(field => {
        console.log(field)
      
      if(field.databaseField == 'expiry_date'){
        console.log('okay')
        console.log(field)
      } 
          
        if(field.type == 'select' && Array.isArray(field.options)) {

        //   console.log(field.options) 
        //   console.log(field.databaseField) 
        //   console.log(newItems) 
        //  console.log(newItems[field.databaseField]) 

        //  field.options.forEach(option => {
        //       console.log(`Value: ${option.value}, Label: ${option.label}`);
        //   });

          //set the selected item remove spaces and case sensitivity
          const selectedItem = field.options.find(option => 
                option.label.replace(/\s+/g, '').toLowerCase() === newItems[field.databaseField].replace(/\s+/g, '').toLowerCase()
            );

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

const handleFieldChanged = (fieldDatabase, value) => {
  emit('fieldChanged', fieldDatabase, value); // Re-emit upwards
};

onMounted(async () => {
  //console.log('emitting data from modal')
  //console.log(items.value["category_ids"])
  emit('fetchDataForSubCategory', items.value["category_ids"], "category_id",items.value[subCategoryIdToPopulate.value], items.value["sub_category_id"]);
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
