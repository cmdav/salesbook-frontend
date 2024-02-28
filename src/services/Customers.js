import axios from '../axios'
import { catchAxiosError, catchAxiosSuccess } from './Response'
import { getToken } from './Auth'

export const getAllCustomer = async () => {
  const token = await getToken()

  try {
    let res = await axios.get(`users?type=customer`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res.data)
    return res.data
  } catch (error) {
    console.log(error)
  }
}
export const getAllCompanyCustomers = async () => {
  const token = await getToken()

  try {
    let res = await axios.get(`users?type=company_customer`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res.data)
    return res.data
  } catch (error) {
    console.log(error)
  }
}
export const getSingleCustomer = async (id) => {
   const token = await getToken()

  try {
    let res = await axios.get(`users/${id}`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res.data)
    return res.data
  } catch (error) {
    console.log(error)
  }
}
