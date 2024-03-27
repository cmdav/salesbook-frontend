import { ref } from 'vue'
import apiService from '@/services/apiService'
import { useReadComposable } from '@/composable/useReadComposable'
import { catchAxiosError, catchAxiosSuccess } from '@/services/Response'

const { fetchPage } = useReadComposable()

export function useUploadComposable(url, file, type) {
  let showUploadModal = ref(false)
  let errorMessage = ref()
  let loading = ref(false)

  const closeUploadModal = () => {
    showUploadModal.value = !showUploadModal.value
    loading.value = false
  }
  const uploadForm = async () => {
    let formData = new FormData() // Create FormData object to append the file
    formData.append('file', file.value) // Append uploadedFile to the FormData
    formData.append('type', type.value) // Append other form data as needed
    try {
      loading.value = true
      let response = await apiService.post(`process-csv`, formData,)
      await fetchPage(url.value, 1)
      loading.value = false
      catchAxiosSuccess(response)
      return response
    } catch (error) {
      catchAxiosError(error)
      loading.value = false
      closeUploadModal()
      if (error.response && error.response.data) {
        console.log(error.response.data.errors)
        console.log(error.response.data.message)
        errorMessage.value = error.response.data.message
      } else {
        console.error(error.message)
        errorMessage.value = error.message
      }
    }
  }
  return {
    // handleUpload,
    showUploadModal,
    closeUploadModal,
    // itemsId,
    uploadForm,
    loading
  }
}
