import axios from '../axios'
import { catchAxiosError, catchAxiosSuccess } from './Response'
import { getToken } from './Auth'

// job-roles
export const getRole = async () => {
  const token = await getToken()

  try {
    let res = await axios.get(`job-roles`, {
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
export const getAllRole = async () => {
  const token = await getToken()

  try {
    let res = await axios.get(`all-job-roles`, {
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

export const getPages = async () => {
  const token = await getToken()

  try {
    let res = await axios.get(`pages`, {
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
export const getAllPages = async () => {
  const token = await getToken()

  try {
    let res = await axios.get(`all-pages`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    console.log(error)
        catchAxiosError(error)

  }
}
export const getPermissions = async (id,page = 1) => {
  const token = await getToken()

  try {
    let res = await axios.get(`permissions?role=${id}?page=${page}`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    console.log(error)
    catchAxiosError(error)
  }
}
export const addPermissions = async (payload) => {
  const token = await getToken()

  try {
    let res = await axios.post(`permissions`,payload, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    console.log(error)
        catchAxiosError(error)

  }
}
