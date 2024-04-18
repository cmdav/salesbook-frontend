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
export const customerName = async () => {
   const token = await getToken()

  try {
    let res = await axios.get(`customers?type=individual`, {
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
export const addCustomer = async (payload) => {
  const token = await getToken()

  try {
    let res = await axios.post(`customers`, payload, {
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




export const companyName = async () => {
  const token = await getToken()

  try {
    let res = await axios.get(`customers?type=company`, {
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





export const allCustomersName = async () => {
  const token = await getToken()

  try {
    let res = await axios.get(`customer-names`, {
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