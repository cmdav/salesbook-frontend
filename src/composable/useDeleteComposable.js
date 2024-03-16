

import { ref } from 'vue';
import apiService from '@/services/apiService';
import { useReadComposable} from '@/composable/useReadComposable';

const { fetchPage } = useReadComposable();

export function useDeleteComposable(url, ItemObject) {
  let showDeleteModal = ref(false)
  let itemsId = ref('')
  let errorMessage = ref()
  let loading = ref(false)

  const closeDeleteModal = () => {
    showDeleteModal.value = false
  }

  const handleDelete = (item) => {
    itemsId.value = item
    showDeleteModal.value = true
  }

  const deleteForm = async () => {
    try {
      loading.value = true;
      const response = await apiService.delete(`${url}/${ItemObject.id}`)
      await fetchPage(url, 1)
      closeDeleteModal()
      return response
    } catch (error) {
      //  isError.value = true;
      if (error.response && error.response.data) {
        // //   //list all message
        console.log(error.response.data.errors)
        // //   allError.value = error.response.data.errors
        // //   //display msg error
        console.log(error.response.data.message)
        errorMessage.value = error.response.data.message
      } else {
        console.error(error.message)
        errorMessage.value = error.message
      }
    }
    loading.value = false
  }
  return {
    handleDelete,
    showDeleteModal,
    closeDeleteModal,
    itemsId,
    deleteForm,
    loading
  }
}

