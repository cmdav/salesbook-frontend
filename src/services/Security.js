import axios from '../axios'
import { catchAxiosError, catchAxiosSuccess } from './Response'
import { getToken } from './Auth'

// job-roles
export const getAllJobRole = async () => {
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

export const getAllJobRole = async () => {
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
