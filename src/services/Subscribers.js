// import axios from '../axios'
// import { catchAxiosError, catchAxiosSuccess } from './Response'
// import { getToken } from './Auth'

// export const getAllSubscription = async () => {
//   const token = await getToken()

//   try {
//     let res = await axios.get(`all-subscription`, {
//       headers: {
//         Authorization: 'Bearer ' + token
//       }
//     })
//     catchAxiosSuccess(res.data)
//     return res.data
//   } catch (error) {
//     console.log(error)
//   }
// }
