import axios from '../axios'
import { catchAxiosError, catchAxiosSuccess } from './Response'
import { getToken } from './Auth'

export const getAllSupplier = async () => {
      const token = await getToken()

  try {
    let res = await axios.get(`users?type=supplier`, {
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
