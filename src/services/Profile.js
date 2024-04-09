import axios from '../axios'
import { catchAxiosError, catchAxiosSuccess } from './Response'
import { getToken } from './Auth'

export const getUserProfile = async () => {
  const token = await getToken()

  try {
    let res = await axios.get(`users?type=profile`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res.data)
    return res.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const uploadCompanyLogo = async (org_id, payload) => {
  const token = await getToken()

  try {
    let res = await axios.put(`organizations/${org_id}`, payload, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res.data)
    return res.data
  } catch (error) {
    console.log(error)
    catchAxiosError(error)
    throw error
  }
}
