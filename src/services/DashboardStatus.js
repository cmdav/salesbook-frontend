import axios from '../axios'
import { getToken } from './Auth'

export const getDashboardStatus = async (date) => {
  const token = await getToken()

  try {
    let res = await axios.get(`dashboard-stat?start_date=${date}`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    return res.data
  } catch (error) {
    console.log(error)
  }
}
export const getDashboardAutoStatus = async () => {
  const token = await getToken()

  try {
    let res = await axios.get(`dashboard-stat`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    return res.data
  } catch (error) {
    console.log(error)
  }
}
