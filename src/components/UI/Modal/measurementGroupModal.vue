<template>
  <div class="modal backdrop-blur z-[100] fixed animate__zoomIn animate__rubberBand animate__fadeOut min-h-screen h-full">
    <div class="modal__body relative w-full md:max-w-[600px] bg-white m-0 md:px-5 py-4 px-4">
      <header class="flex flex-row items-center justify-between border-b-[#000000] mb-[0.6em] border-b-[1px]">
        <h4 class="text-[32px] font-EBGaramond500 text-[#244034]">
          {{ isEditing ? 'Edit Measurement Group' : 'Add Measurement Group' }}
        </h4>
        <button class="close-button" @click="$emit('close')">&#10005;</button>
      </header>

      <div v-if="isLoading" class="loader-overlay">
        <div class="loader"></div>
      </div>

      <form @submit.prevent="submitForm" class="max-w-4xl mx-auto p-2">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 pb-1">Group Name</label>
          <input
            type="text"
            v-model="groupName"
            placeholder="Enter Group Name"
            required
            class="mt-1 block w-[90%] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

      

        <button
          type="submit"
          class="px-4 py-2 bg-[#c35214] hover:bg-[#d67b0d] text-white font-bold rounded"
        >
          {{ isEditing ? 'Update Group' : 'Add Group' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { defineProps, watch, defineEmits, ref } from 'vue'
import apiService from "@/services/apiService"
import { catchAxiosSuccess, catchAxiosError } from '@/services/Response'

const props = defineProps({
  group: {
    type: Object,
    default: null
  }
})

const emits = defineEmits(['close', 'group-added', 'group-updated'])

const isEditing = ref(!!props.group)
const groupName = ref(isEditing.value ? props.group.name : '')

const isLoading = ref(false)

watch(() => props.group, (newVal) => {
  if (newVal) {
    groupName.value = newVal.name
   
  }
})

const submitForm = async () => {
  isLoading.value = true

  try {
    if (isEditing.value) {
      const response = await apiService.update(`/measurement-groups/${props.group.id}`, {
        group_name: groupName.value,
        
      })
      emits('group-updated', response.data)
      catchAxiosSuccess(response)
    } else {
      const response = await apiService.post('/measurement-groups', {
        group_name: groupName.value,
        
      })
      emits('group-added', response.data)
      catchAxiosSuccess(response)
    }
    
    emits('close')
  } catch (error) {
    console.error('Error submitting form:', error)
    catchAxiosError(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.modal {
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
}

.modal__body {
  position: relative;
  max-width: 600px;
  background-color: #fff;
  border-radius: 12px;
  animation: slidedown 0.8s ease;
  max-height: 90vh;
  overflow-y: auto;
}

.close-button {
  position: absolute;
  right: 20px;
  top: 20px;
  background: none;
  border: none;
  font-size: 25px;
  cursor: pointer;
}

.loader-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 10;
}

.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>