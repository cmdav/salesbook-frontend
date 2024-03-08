// useProductTable.js

import { ref } from 'vue';
import apiService from '@/services/apiService';
import { useReadComposable} from '@/composable/useReadComposable';

const { fetchPage } = useReadComposable();

export function usePostComposable(url,formFields){
     let showModal = ref(false);
     let isLoadingMsg = ref(" ");
     let loading = ref(false);
     let allError= ref({});
     const forceUpdate = ref(true);
     let errorMessage = ref(""); 
    let isError = ref(false); 
    const closeModal = () => {
      showModal.value = false;
    };

 
const submitForm = async () => {
  try {
    loading.value = true;
    const formData = new FormData();
    formFields.value.forEach(field => {
      formData.append(field.databaseField, field.value);
    });

    // Append file data to FormData
    const fileField = formFields.value.find(field => field.databaseField === 'product_image');
    if (fileField && fileField.value instanceof File) {
      formData.append('product_image', fileField.value);
    }

    // Submit FormData to the server
    const response = await apiService.post(url, formData);
    await fetchPage(url, 1);
    console.log(response);

     // Clear form fields
     formFields.value.forEach(field => {
       field.value = ''; 
    });
    showModal.value = false;
    forceUpdate.value = !forceUpdate.value;
   
  } catch (error) {
     isError.value = true;
    if (error.response && error.response.data) {
      //list all message
      //console.log(error.response.data.errors)
      allError.value = error.response.data.errors
      //display msg error
      // console.log(error.response.data.message);
      errorMessage.value = error.response.data.message; 
    } else {
      console.error(error.message);
      errorMessage.value = error.message; 
    }
  }
  loading.value = false;
};

  return {
     showModal, 
     isLoadingMsg,
     loading, 
     allError,
     forceUpdate,
     errorMessage, 
     isError, 
     closeModal,
     submitForm
    // products,
    // uniqueKeys,
    // currentPage,
    // itemsPerPage,
    // totalPage,
    // lastPage,
    // isLoading,
    // hasError,
    // displayKeys,
    // formatKey,
    // isMediaKey,
    // fetchPage,
    // paginationArray
  };
}
