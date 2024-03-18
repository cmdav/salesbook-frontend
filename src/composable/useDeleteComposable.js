

import { ref, computed } from 'vue'
import apiService from '@/services/apiService';
import { useReadComposable} from '@/composable/useReadComposable';

const { fetchPage } = useReadComposable();

export function useDeleteComposable(url, ItemObject) {
  let _showDeleteModal = ref(false)
  let itemsId = ref('')
  let errorMessage = ref()
  let loading = ref(false)
let deleteModal=ref(false);
  const closeDeleteModal = () => {
    _showDeleteModal.value = false
    loading.value = false
    deleteModal.value = false
  }
  const showDeleteModal = computed({
    get() {
      return _showDeleteModal.value
    },
    set(newValue) {
      _showDeleteModal.value = newValue
    }
  })

  
  const handleDelete = (item) => {
    itemsId.value = item
    showDeleteModal.value = true
        deleteModal.value = true

  }

  const deleteForm = async () => {
    try {
      loading.value = true
      let response = await apiService.delete(`${url}/${ItemObject.id}`)
      await fetchPage(url, 1)
      closeDeleteModal() // Close the modal after successful deletion
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
    loading,
    _showDeleteModal,
    deleteModal
  }
}

