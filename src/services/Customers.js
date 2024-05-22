import axios from '../axios'
import { catchAxiosError } from './Response'
import { getToken } from './Auth'

export const getAllCustomer = async () => {
  const token = await getToken()

  try {
    let res = await axios.get(`customers?type=individual`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    //catchAxiosSuccess(res.data)
    return res.data
  } catch (error) {
    console.log(error)
  }
}
export const getAllCompanyCustomers = async () => {
  const token = await getToken()

  try {
    let res = await axios.get(`customers?type=company`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    //catchAxiosSuccess(res.data)
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
    //catchAxiosSuccess(res.data)
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
   // catchAxiosSuccess(res.data)
   console.log(res.data)
    return res.data
  } catch (error) {
    console.log(error)
  }
}
export const addCustomer = async (payload) => {
  //console.log(payload);
  const token = await getToken()
  try {
    let res = await axios.post(`customers`, payload, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
   
    //catchAxiosSuccess(res.data)
    return res.data
  } catch (error) {
    //alert('error')
    catchAxiosError(error)
   // console.log(error)
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
    //catchAxiosSuccess(res.data)
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
    //catchAxiosSuccess(res.data)
    return res.data
  } catch (error) {
    console.log(error)
  }
}

