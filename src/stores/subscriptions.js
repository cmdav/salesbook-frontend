import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getAllSubscriptions, getAllSubscribers } from '@/services/Subscription'

export const useSubscriptions = defineStore('Subscriptions', () => {
  const allSubscriptions = ref({})
  const allSubscribers = ref({})


  const handleGetAllSubscriptions = async () => {
    try {
       allSubscriptions.value = await getAllSubscriptions()
      return allSubscriptions.value
    } catch (error) {
      console.error(error)
    }
  }
  
  const handleGetAllSubscribers = async () => {
    try {
      allSubscribers.value = await getAllSubscribers()

      return allSubscribers.value
    } catch (error) {
      console.error(error)
    }
  }

  return {
    handleGetAllSubscriptions,
    allSubscriptions,
    handleGetAllSubscribers,
    allSubscribers
  }
})

