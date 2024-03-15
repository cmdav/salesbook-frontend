

import { ref } from 'vue';
import apiService from '@/services/apiService';

export function useEditComposable(formFields, url) {
    

  let showEditModal = ref(false);
  let items = ref();
  let errorMessage = ref();
  let loading = ref(false);
 


  const closeEditModal = () => {
    showEditModal.value = false;
  };
  
  const handleEdit = (item='') => {
    items.value =item;
    showEditModal.value = true;
  };

  const handleDelete = (product ='') => {
    // Your delete logic here
    console.log("Deleting product", product);
  };

  const editForm = async () => {
    
     
    try {
      loading.value = true;
      
      const formData = {};
      formFields.value.forEach(field => {
          formData[field.databaseField]= field.value;
          console.log(field.value)
      });
    
  
      // Append file data to FormData
      // const fileField = formFields.value.find(field => field.databaseField === 'product_image');
      // if (fileField && fileField.value instanceof File) {
      //   formData.append('product_image', fileField.value);
      // }
     
      // Submit FormData to the server
      //const submitUrl = postUrl || url;
     // const editUrl = items.value["id"]
       console.log(formData)
       
       const response = await apiService.update(url, formData);
     console.log("m")
      //  // await fetchPage(submitUrl, 1);
       console.log(response);
  
       // Clear form fields
       formFields.value.forEach(field => {
         field.value = ''; 
      });
      // showModal.value = false;
      // forceUpdate.value = !forceUpdate.value;
     
    } catch (error) {
      //  isError.value = true;
      if (error.response && error.response.data) {
      // //   //list all message
         console.log(error.response.data.errors)
      // //   allError.value = error.response.data.errors
      // //   //display msg error
        console.log(error.response.data.message);
        errorMessage.value = error.response.data.message; 
       } else {
           console.error(error.message);
            errorMessage.value = error.message; 
      }
    }
    loading.value = false;
  };
  return {
    handleEdit,
    handleDelete,
    showEditModal,
    closeEditModal,
    items,
    editForm,
    loading
  
  };
}

