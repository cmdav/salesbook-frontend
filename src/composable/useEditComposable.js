import { ref } from 'vue'
import apiService from '@/services/apiService'
//import { useReadComposable} from '@/composable/useReadComposable';
import { catchAxiosError, catchAxiosSuccess } from '@/services/Response'

//const { fetchPage } = useReadComposable();

export function useEditComposable(formFields, url, itemId, emit) {
  let showEditModal = ref(false)
  let items = ref()
  let errorMessage = ref()
  const forceUpdate = ref(0)
  let loading = ref(false)

  function constructUrl(url, itemId) {
    const segments = url.split('/')

    const segmentCount = segments.filter((segment) => segment.length > 0).length
    //console.log(segmentCount)
    if (segmentCount > 1) {
      return url
    } else {
      return url.endsWith('/') ? `${url}${itemId}` : `${url}/${itemId}`
    }
  }

  const closeEditModal = () => {
    showEditModal.value = false
    console.log('closing modal')
  }

  const handleEdit = (item = '') => {
    // console.log('before value')
    // console.log(showEditModal.value)
    items.value = item
    console.log(`Item : ${item}`)
    showEditModal.value = true
    // console.log('after value')
    // console.log(showEditModal.value)
  }

  const handleDelete = (product = '') => {
    console.log('Deleting product', product)
  }

  const editForm = async () => {
    try {
      loading.value = true

      const formData = new FormData()

      formFields.value.forEach((field) => {
        //console.log(field.databaseField)
        //console.log(field.value)
        formData.append(field.databaseField, field.value)
      })

      const Url = constructUrl(url, itemId)

      //console.log(Url)

      formData.append('_method', 'PUT')
      const response = await apiService.post(Url, formData)

      // console.log(response);

      // Clear form fields
      formFields.value.forEach((field) => {
        field.value = ''
      })
      // console.log(url);
      //  fetchPage(url, 1)

      emit('close')
      emit('updated')
      catchAxiosSuccess(response)
      forceUpdate.value++
      return response
    } catch (error) {
      catchAxiosError(error)

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
    handleEdit,
    handleDelete,
    showEditModal,
    closeEditModal,
    items,
    editForm,
    loading
  }
}
