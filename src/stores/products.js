import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getProductCategories,
  getProductSubCategories,
  getAllProductSubCategories,
  getAllProducts,
  getProducts,
  getSupplierProducts,
  getAllSupplierProducts,
  getStores,
  addSales,
  updateInventories
} from '@/services/Products'

export const useProductStore = defineStore('Products', () => {
  const productCategories = ref({})
  const productSubCategories = ref({})
  const allProductSubCategories = ref({})
  const allProduct = ref({})
  const products = ref({})
  const supplierProducts = ref({})
  const allSupplierProducts = ref({})
  const stores = ref({})

  const handleGetProductCategories = async () => {
    try {
      productCategories.value = await getProductCategories()
      return productCategories.value
    } catch (error) {
      console.error(error)
    }
  }
  const handleGetProductSubCategories = async () => {
    try {
      productSubCategories.value = await getProductSubCategories()
      return productSubCategories.value
    } catch (error) {
      console.error(error)
    }
  }
  const handleGetAllProductSubCategories = async () => {
    try {
      allProductSubCategories.value = await getAllProductSubCategories()
      return allProductSubCategories.value
    } catch (error) {
      console.error(error)
    }
  }
  const handleGetAllProduct = async () => {
    try {
      allProduct.value = await getAllProducts()
      return allProduct.value
    } catch (error) {
      console.error(error)
    }
  }
  const handleGetProducts = async () => {
    try {
      products.value = await getProducts()
      return products.value
    } catch (error) {
      console.error(error)
    }
  }

  const handleGetSupplierProducts = async () => {
    try {
      supplierProducts.value = await getSupplierProducts()
      return supplierProducts.value
    } catch (error) {
      console.error(error)
    }
  }
  const handleGetAllSupplierProducts = async () => {
    try {
      allSupplierProducts.value = await getAllSupplierProducts()
      return allSupplierProducts.value
    } catch (error) {
      console.error(error)
    }
  }
  const handleGetStores = async () => {
    try {
      stores.value = await getStores()
      return stores.value
    } catch (error) {
      console.error(error)
    }
  }
  const handleAddSales = async (payload) => {
    try {
      let res = await addSales(payload)
      return res
    } catch (error) {
      console.error(error)
    }
  }
  const handleUpdateInventories = async (id, payload) => {
    try {
      let res = await updateInventories(id, payload)
      return res
    } catch (error) {
      console.error(error)
    }
  }

  return {
    handleGetProductCategories,
    productCategories,
    handleGetProductSubCategories,
    productSubCategories,
    handleGetAllProductSubCategories,
    allProductSubCategories,
    handleGetAllProduct,
    allProduct,
    handleGetProducts,
    handleGetSupplierProducts,
    supplierProducts,
    handleGetAllSupplierProducts,
    allSupplierProducts,
    handleGetStores,
    handleAddSales,
    handleUpdateInventories,
    products,
    stores
  }
})
