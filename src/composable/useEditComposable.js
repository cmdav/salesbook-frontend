

import { ref} from 'vue';
import apiService from '@/services/apiService';
//import { useReadComposable} from '@/composable/useReadComposable';
import { catchAxiosError, catchAxiosSuccess } from '@/services/Response'



//const { fetchPage } = useReadComposable();

export function useEditComposable(formFields, url,itemId,emit) {
    

  let showEditModal = ref(false);
  let items = ref();
  let errorMessage = ref();
  let loading = ref(false);

  
 


  const closeEditModal = () => {
    showEditModal.value = false;
    console.log("closing modal")
  };
  
  const handleEdit = (item='') => {
    // console.log('before value')
    // console.log(showEditModal.value)
    console.log(item)
    items.value =item;
    showEditModal.value = true;
    // console.log('after value')
    // console.log(showEditModal.value)
    
  };

  const handleDelete = (product ='') => {
  
    console.log("Deleting product", product);
  };

  const editForm = async () => {
    
     
    try {
      loading.value = true;
      
  
      const formData = new FormData();
     

      formFields.value.forEach(field => {
           console.log(field.value)
      
          if (field.databaseField === 'product_image') {
            
              formData.append(field.databaseField, field.value);
              
          } else {
              formData.append(field.databaseField, field.value); 
             // console.log(field.value)
          }
      });


      console.log(url);
      console.log(itemId)
      //itemId = "9bd85113-1189-42b9-8f10-7c4c3c1bc967";
       const Url = `${url}/${itemId}`
        
      
       formData.append('_method', 'PUT')
       const response = await apiService.post(Url, formData);
      
      // console.log(response);
  
       // Clear form fields
       formFields.value.forEach(field => {
         field.value = ''; 
      });
      // console.log(url);
      //  fetchPage(url, 1)
       
    
      emit("close")
      emit('updated');
        catchAxiosSuccess(response)
        return response;
     
    } catch (error) {
              catchAxiosError(error)

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
    loading,
    
  
  };
}

