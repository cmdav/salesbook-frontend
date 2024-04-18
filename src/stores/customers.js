import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getAllCustomer,
  getSingleCustomer,
  getAllCompanyCustomers,
  customerName,
  addCustomer,
  companyName,
  allCustomersName
} from '@/services/Customers'

export const useCustomerstore = defineStore('Customer', () => {
  const Customers = ref({})
  const companiesCustomers = ref({})
  const singleCustomer = ref({})
  const customerNames = ref({})
const companyNames = ref({})
const allCustomersNames = ref({})
const handleAllCustomersName = async () => {
    try {
      allCustomersNames.value = await allCustomersName()
      return allCustomersNames.value
    } catch (error) {
      console.error(error)
    }
  
    }
const handleCompanyName = async () => {
    try {
      companyNames.value = await companyName()
      return companyNames.value
    } catch (error) {
      console.error(error)
    }
  }
const handleAddCustomer = async (payload) => {
  try {
    const response = await addCustomer(payload)
    return response
  } catch (error) {
    console.error(error)
  }
}
  const handleCustomerName = async () => {
    try {
      customerNames.value = await customerName()
      return customerNames.value
    } catch (error) {
      console.error(error)
    }
  }

  const allCustomer = async () => {
    try {
      Customers.value = await getAllCustomer()
      return Customers.value
    } catch (error) {
      console.error(error)
    }
  }
  const allCompanyCustomers = async () => {
    try {
      companiesCustomers.value = await getAllCompanyCustomers()
      return companiesCustomers.value
    } catch (error) {
      console.error(error)
    }
  }
  const handleGetSingleCustomer = async (id) => {
    try {
      singleCustomer.value = await getSingleCustomer(id)
      return singleCustomer.value
    } catch (error) {
      console.error(error)
    }
  }

  return {
    Customers,
    allCustomer,
    singleCustomer,
    handleGetSingleCustomer,
    allCompanyCustomers,
    companiesCustomers,
    customerNames,
    handleCustomerName,
    handleAddCustomer,
    handleCompanyName,
    companyNames,
    allCustomersNames,
    handleAllCustomersName
  }
})
