import { decrypt } from '@/services/Encrypt'
import { logout } from '@/services/Auth'

const getUserFromLocalStorage = () => {
  const encryptedData = localStorage.getItem('_user_data')
  return encryptedData ? decrypt(encryptedData, import.meta.env.VITE_ENCRYPT_KEY) : null
}

const redirectLogin = () => {
  const user = getUserFromLocalStorage()
  return user && user.token ? undefined : { name: 'login' }
}

const redirectDashboard = () => {
  const user = getUserFromLocalStorage()
  return user && user.token ? { name: 'dashboard' } : undefined
}

const deleteSession = async () => {
  if (localStorage.getItem('_user_data')) {
    logout()
    localStorage.removeItem('_user_data')
    return { name: 'login' }
  }
}
export default {
  redirectLogin,
  redirectDashboard,
  deleteSession
}

// import { decrypt } from '@/services/Encrypt'

// const redirectLogin = () => {

//     let encryptedData  = localStorage.getItem("_user_data");
//     if(encryptedData){
//         let user = decrypt(encryptedData,import.meta.env.VITE_ENCRYPT_KEY)

//         if(user.token){
//             return ;
//         }

//         return { name: 'login' }

//     }

//     return { name: 'login' }
// }

// const redirectDashboard = () => {

//     let encryptedData  = localStorage.getItem("_user_data");
//     if(encryptedData){
//         let user = decrypt(encryptedData,import.meta.env.VITE_ENCRYPT_KEY)
//         if(user.token){

//             return { name: 'dashboard' }
//         }
//     }

// }
// const deleteSession = () => {

//     let encryptedData  = localStorage.getItem("_user_data");
//     if(encryptedData){
//         localStorage.removeItem("_user_data");
//         return { name: 'login' }
//     }

// }

// export default{
//     redirectLogin,
//     redirectDashboard,
//     deleteSession
// }
