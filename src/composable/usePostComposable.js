// useProductTable.js

import { ref } from 'vue';
import apiService from '@/services/apiService';
import { useReadComposable} from '@/composable/useReadComposable';
import { catchAxiosError, catchAxiosSuccess } from '@/services/Response'

const { fetchPage } = useReadComposable();

export function usePostComposable(
  url,
  formFields,
  postUrl = null,
  fieldsOverride ={},
  emit
) {
  let showModal = ref(false)
  let showViewModal = ref(false)
  let isLoadingMsg = ref(' ')
  let loading = ref(false)
  let allError = ref({})
  const forceUpdate = ref(0)
  let errorMessage = ref('')
  let isError = ref(false)
  const closeModal = () => {
    showModal.value = false
    forceUpdate.value++
  }
  const closeViewModal = () => {
    showViewModal.value = false
  }

  const submitForm = async () => {
    
    try {
      loading.value = true

      if (!formFields) {
        throw new Error('Form fields are undefined.')
      }

      // Check if fieldsOverride is not null or undefined before overriding
      const modifiedFields = formFields.map((field) => {
        if (
          fieldsOverride &&
          Object.prototype.hasOwnProperty.call(fieldsOverride, field.databaseField)
        ) {
          return { ...field, value: fieldsOverride[field.databaseField] }
        }
        return field
      })

      const formData = new FormData()
      modifiedFields.forEach((field) => {
        formData.append(field.databaseField, field.value)
      })

      // Append file data to FormData
      const fileField = formFields.find((field) => field.type === 'file')
      if (fileField && fileField.value instanceof File) {
        formData.append(fileField.databaseField, fileField.value)
      }

      // Submit FormData to the server
      const submitUrl = postUrl || url
      const response = await apiService.post(submitUrl, formData)

      // Assume fetchPage updates some data relevant to the page where form is used
      await fetchPage(submitUrl, 1)

      // Clear form fields
      formFields.forEach((field) => {
        // Reset fields but maintain their structure for file types
        field.value = field.type === 'file' ? null : ''
      })

      showModal.value = false
      forceUpdate.value++
      loading.value = false
      emit('close')
      console.log(response)
      catchAxiosSuccess(response)
      return response
    } catch (error) {
      catchAxiosError(error)
      console.error(error)
      loading.value = false
      isError.value = true
      if (error.response && error.response.data) {
        // Handle structured error messages from the server
        allError.value = error.response.data.errors
        errorMessage.value = error.response.data.message
      } else {
        // Handle general errors
        console.error(error.message)
        errorMessage.value = error.message
      }
    }
  }

  return {
    showModal,
    showViewModal,
    isLoadingMsg,
    loading,
    allError,
    forceUpdate,
    errorMessage,
    isError,
    closeModal,
    closeViewModal,
    submitForm
  }
}
