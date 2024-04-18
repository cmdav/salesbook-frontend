import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getAllCustomer,
  getSingleCustomer,
  getAllCompanyCustomers,
  customerName
} from '@/services/Customers'

export const useCustomerstore = defineStore('Customer', () => {
  const Customers = ref({})
  const companiesCustomers = ref({})
  const singleCustomer = ref({})
  const customerNames = ref({})


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
    handleCustomerName
  }
})
