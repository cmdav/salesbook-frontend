import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getAllSupplier,
  getSingleSupplier,
  getSupplierProduct,
  getAllSupplierProduct,
  getSupplierProducts
} from '@/services/Suppliers'

export const useSupplierStore = defineStore('Supplier', () => {
  const Supplier = ref({})
  const singleSupplier = ref({})
  const allSupplierProduct = ref({})
  const supplierProduct = ref({})
  const supplierProducts = ref({})
  const allSupplier = async () => {
    try {
      Supplier.value = await getAllSupplier()
      return Supplier.value
    } catch (error) {
      console.error(error)
    }
  }
  const handleGetSingleSupplier = async (id) => {
    try {
      singleSupplier.value = await getSingleSupplier(id)
      return singleSupplier.value
    } catch (error) {
      console.error(error)
    }
  }
  const handleAllSupplierProduct = async () => {
    try {
      allSupplierProduct.value = await getAllSupplierProduct()
      return allSupplierProduct.value
    } catch (error) {
      console.error(error)
    }
  }
  const handleGetSupplierProduct = async () => {
    try {
      supplierProduct.value = await getSupplierProduct()
      return supplierProduct.value
    } catch (error) {
      console.error(error)
    }
  }
  const handleGetSupplierProducts = async () => {
    try {
      supplierProducts.value = await getSupplierProducts()
      return supplierProducts.value 
    }catch (error){
      console.error(error)
    }
  }


  return {
    Supplier,
    allSupplier,
    singleSupplier,
    handleGetSingleSupplier,
    allSupplierProduct,
    supplierProduct,
    handleAllSupplierProduct,
    handleGetSupplierProduct,
    handleGetSupplierProducts
  }
})
