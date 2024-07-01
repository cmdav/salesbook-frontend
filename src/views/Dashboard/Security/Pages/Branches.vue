<!-- eslint-disable vue/multi-word-component-names
<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { branchFormFields } from "@/formfields/formFields";
import { useSharedComponent } from "@/composable/useSharedComponent";
const emit = defineEmits("forceRefresh");


const url = ref("business-branches");

const showModal = ref(false);

const formState = reactive({ role_name: "" });
const {
  useSelectComposable,
  DataTableLayout,
  usePostComposable,
  useEditComposable,
  EditModal,
  DeleteModal,
  useDeleteComposable,
  FormModal, 
  defineEmits,
} = useSharedComponent('business-branches');

const { handleEdit, showEditModal, closeEditModal, items } = useEditComposable(emit);
const { forceUpdate } = usePostComposable(
  "/business-branches",
  branchFormFields
);
// const link = ref(`states?country_id=${id}`)

const { fetchDataForSelect, fetchDataForSubCategory, isOptionLoadingMsg, }
  = useSelectComposable();


const forceRefresh = () => {
  forceUpdate.value++;
};

const closeModal = () => {
  showModal.value = !showModal.value;
  formState.role_name = "";
};


const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal,
} = useDeleteComposable();

const handleCountryChange = async (countryId) => {
  await fetchDataForSubCategory(countryId, "country_id", "state_id");
};

onMounted(async () => {
  await fetchDataForSelect("Country", "/countries", "id", "name");
  // Trigger fetching states when country is selected
  watch(
    () => branchFormFields.value.find(field => field.databaseField === 'country_id').value,
    (newCountryId) => {
      if (newCountryId) {
        handleCountryChange(newCountryId);
      }
    }
  );
});

// onMounted(async () => {
//   await fetchDataForSelect("Country", "/countries", "id", "name");
//   // await fetchDataForSelect("State", "/countries/id", "id", "name");
// });

</script> -->

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { branchFormFields } from "@/formfields/formFields";
import { useSharedComponent } from "@/composable/useSharedComponent";
import apiService from "@/services/apiService"; // Ensure this import is correct based on your project structure

const emit = defineEmits("forceRefresh");

const url = ref("business-branches");

const showModal = ref(false);

const formState = reactive({ role_name: "" });
const {
  useSelectComposable,
  DataTableLayout,
  usePostComposable,
  useEditComposable,
  EditModal,
  DeleteModal,
  useDeleteComposable,
  FormModal, 
  defineEmits,
} = useSharedComponent('business-branches');

const { handleEdit, showEditModal, closeEditModal, items } = useEditComposable(emit);
const { forceUpdate } = usePostComposable(
  "/business-branches",
  branchFormFields
);

const { fetchDataForSelect, isOptionLoadingMsg } = useSelectComposable(branchFormFields);

const forceRefresh = () => {
  forceUpdate.value++;
};

const closeModal = () => {
  showModal.value = !showModal.value;
  formState.role_name = "";
};

const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal,
} = useDeleteComposable();

const fetchStatesForCountry = async (countryId) => {
  const stateField = branchFormFields.value.find(field => field.databaseField === 'state_id');
  if (stateField) {
    try {
      const response = await apiService.get(`/states?country_id=${countryId}`);
      stateField.options = [
        { value: '', label: 'Select an option', disabled: true },
        ...response.map(item => ({ value: item.id, label: item.name }))
      ];
      stateField.value = '';
    } catch (error) {
      console.error('Error fetching states:', error);
      stateField.options = [{ value: '', label: 'Error fetching states' }];
    }
  }
};

onMounted(async () => {
  await fetchDataForSelect("Country", "/countries", "id", "name");
});

watch(() => branchFormFields.value.find(field => field.databaseField === 'country_id').value, async (newValue) => {
  if (newValue) {
    await fetchStatesForCountry(newValue);
  }
});
</script>




<template>
  
   
    <DataTableLayout 
      :key="forceUpdate"
       @toggleModal="showModal = !showModal"
       :excludedKeys="[ 'created_at', 'updated_at', 'id' ]"
       toggleButtonLabel="Add Branches" 
       :endpoint="url" 
       :pageName="'settings'"
      searchEndpoint="business-branches" 
      :additionalColumns="[{ name: 'Edit', action: handleEdit}, { name: 'Delete', action: handleDelete },]">
    </DataTableLayout>

    

    <EditModal 
        v-if="showEditModal" 
        @close="closeEditModal" 
        :items="items" 
        :formField="branchFormFields"
        @updated="forceRefresh" 
        :url="'/business-branches'" 
        />

    <DeleteModal 
        v-if="showDeleteModal" 
        @close="closeDeleteModal" 
        @updated="forceRefresh" 
        :items="itemsId"
        :url="url" 
    />

   <FormModal 
        v-if="showModal"
         @close="closeModal"
        :key="forceUpdate"
        @updated="forceRefresh"  
        :formTitle="'Add Branch'"
         :fields="branchFormFields" 
      :isLoadingMsg="isOptionLoadingMsg"
       @fetchDataForSubCategory="fetchDataForSubCategory" 
      :url="url">
    </FormModal>

  
</template>