import axios from '../axios'
import { catchAxiosError, catchAxiosSuccess } from './Response'
import { getToken } from './Auth'

export const getAllSubscriptions = async () => {
  const token = await getToken()

  try {
    let res = await axios.get(`all-subscriptions`, {
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

export const getAllSubscribers = async () => {
  const token = await getToken()

  try {
    let res = await axios.get(`subscription-statuses`, {
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