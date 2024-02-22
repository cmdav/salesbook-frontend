import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getAllSupplier } from '@/services/Suppliers'

export const useSupplierStore = defineStore('Supplier', () => {
  const Supplier = ref({})
  const singleSupplier = ref({})

  const allSupplier = async () => {
    try {
      Supplier.value = await getAllSupplier()
      return Supplier.value
    } catch (error) {
      console.error(error)
    }
  }
  // const handleGetSingleSupplier = async (uuid) => {
  //   try {
  //     singleSupplier.value = await getSingleSupplier(uuid)
  //     return singleSupplier.value
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }


  return {
    Supplier,
    allSupplier,
    singleSupplier,
  }
})
