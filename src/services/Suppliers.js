import axios from '../axios'
import { catchAxiosError, catchAxiosSuccess } from './Response'
import { getToken } from './Auth'

export const getAllSupplier = async (page) => {
      const token = await getToken()

  try {
    let url =`users?type=supplier&page=${page}`
    console.log(url)
    let res = await axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    console.log(error)
  }
}
export const getSingleSupplier = async (id) => {
        const token = await getToken()

  try {
    let res = await axios.get(`users/${id}`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    catchAxiosError(error)
    throw error
  }
}
export const getSupplierProduct = async () => {
  const token = await getToken()

  try {
    let res = await axios.get(`supplier-products`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    catchAxiosError(error)
    throw error
  }
}
export const getAllSupplierProduct = async () => {
  const token = await getToken()

  try {
    let res = await axios.get(`all-supplier-products`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    catchAxiosError(error)
    throw error
  }
}

export const getSupplierProducts = async () => {
  const token = await getToken()

  try {
    let res = await axios.get(`auth-supplier-products`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    catchAxiosError(error)
    throw error
  }
}

export const addSupplierPrice = async (payload) => {
  const token = await getToken()

  try {
    let res = await axios.post(`price-notifications`, payload, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const getSupplierPrice = async () => {
  const token = await getToken()

  try {
    let res = await axios.get(`price-notifications`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const updateSupplierPriceStatus = async (id, payload) => {
  const token = await getToken()

  try {
    let res = await axios.put(`price-notifications/${id}`, payload, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    catchAxiosError(error)
    throw error
    
  }
}