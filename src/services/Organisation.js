import axios from '../axios'
import { catchAxiosError, catchAxiosSuccess } from './Response'
import { getToken } from './Auth'

export const getAllOrganisation = async () => {
      const token = await getToken()

  try {
    let res = await axios.get(`organizations`, {
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
export const addOrganisation = async (payload) => {
  const token = await getToken()

  try {
    let res = await axios.post(`organizations`, payload, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res.data)
    return res.data
  } catch (error) {
    catchAxiosError(error)
    throw error
  }
}
