import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getAllSupplier,
  getSingleSupplier,
  getSupplierProduct,
  getAllSupplierProduct,
  getSupplierProducts,
  addSupplierPrice,
  getSupplierPrice,
  updateSupplierPriceStatus
} from '@/services/Suppliers'

export const useSupplierStore = defineStore('Supplier', () => {
  const Supplier = ref({})
  const singleSupplier = ref({})
  const allSupplierProduct = ref({})
  const supplierProduct = ref({})
  const supplierProducts = ref({})
  const supplierPrice = ref({})

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

  const handleAddSupplierPrice = async (payload) => {
    try {
      let res = await addSupplierPrice(payload)
      return res
    } catch (error) {
      console.error(error)
    }
  }

  const handleGetSupplierPrice = async () => {
    try {
      supplierPrice.value = await getSupplierPrice()
      return supplierPrice.value 
    }catch (error){
      console.error(error)
    }
  }

  const handleUpdateSupplierPriceStatus = async (id, payload) => {
    try {
      let res = await updateSupplierPriceStatus(id, payload)
      return res
    } catch (error) {
      console.error(error)
    }
  }

  return {
    Supplier,
    allSupplier,
    singleSupplier,
    supplierProducts,
    handleGetSingleSupplier,
    allSupplierProduct,
    supplierProduct,
    supplierPrice,
    handleAllSupplierProduct,
    handleGetSupplierProduct,
    handleGetSupplierProducts,
    handleAddSupplierPrice,
    handleGetSupplierPrice,
    handleUpdateSupplierPriceStatus
  }
})
