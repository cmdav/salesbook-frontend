

import { ref } from 'vue';

export function useEditComposable() {
    

  let showEditModal = ref(false);
  let items = ref();
  let loading = ref(false);


  const closeEditModal = () => {
    showEditModal.value = false;
  };
  
  const handleEdit = (item='') => {
    console.log("Editing product", item);
    items.value =item;
    showEditModal.value = true;
  };

  const handleDelete = (product ='') => {
    // Your delete logic here
    console.log("Deleting product", product);
  };

  const editForm = async () => {
     loading.value = true;
      alert('Okay');
    // try {
    //   loading.value = true;
      
    //   //override form fields
    //   const modifiedFields = formFields.value.map(field => {
    //     if (Object.prototype.hasOwnProperty.call(fieldsOverride, field.databaseField)) {
    //         return { ...field, value: fieldsOverride[field.databaseField] };
    //     }
    //     return field;
    //   });
      
    //   const formData = new FormData();
    //   modifiedFields.forEach(field => {
    //       formData.append(field.databaseField, field.value);
    //   });
    
  
    //   // Append file data to FormData
    //   const fileField = formFields.value.find(field => field.databaseField === 'product_image');
    //   if (fileField && fileField.value instanceof File) {
    //     formData.append('product_image', fileField.value);
    //   }
  
    //   // Submit FormData to the server
    //   const submitUrl = postUrl || url;
    //   const response = await apiService.post(submitUrl, formData);
     
    //   await fetchPage(submitUrl, 1);
    //   console.log(response);
  
    //    // Clear form fields
    //    formFields.value.forEach(field => {
    //      field.value = ''; 
    //   });
    //   showModal.value = false;
    //   forceUpdate.value = !forceUpdate.value;
     
    // } catch (error) {
    //    isError.value = true;
    //   if (error.response && error.response.data) {
    //     //list all message
    //     //console.log(error.response.data.errors)
    //     allError.value = error.response.data.errors
    //     //display msg error
    //     // console.log(error.response.data.message);
    //     errorMessage.value = error.response.data.message; 
    //   } else {
    //     console.error(error.message);
    //     errorMessage.value = error.message; 
    //   }
    // }
    // loading.value = false;
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

