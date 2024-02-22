import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getAllCustomer } from '@/services/Customers'

export const useCustomerstore = defineStore('Customer', () => {
  const Customers = ref({})
  const singleCustomer = ref({})

  const allCustomer = async () => {
    try {
      Customers.value = await getAllCustomer()
      return Customers.value
    } catch (error) {
      console.error(error)
    }
  }
  // const handleGetSingleCustomer = async (uuid) => {
  //   try {
  //     singleCustomer.value = await getSingleCustomer(uuid)
  //     return singleCustomer.value
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }


  return {
    Customers,
    allCustomer,
    singleCustomer
  }
})
