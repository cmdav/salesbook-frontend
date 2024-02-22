import axios from '../axios'
import { catchAxiosError, catchAxiosSuccess } from './Response'
import { getToken } from './Auth'

export const getAllCustomer = async () => {
      const token = await getToken()

  try {
    let res = await axios.get(`/users?type=customer`, {
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
// export const getSingleTalent = async (uuid) => {
//   try {
//     let res = await axios.get(`talent/${uuid}`)
//     catchAxiosSuccess(res.data)
//     return res.data
//   } catch (error) {
//     catchAxiosError(error)
//     throw error
//   }
// }
