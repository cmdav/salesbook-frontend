import axios from "../axios";
import { catchAxiosError, catchAxiosSuccess }  from "./Response"
import { encrypt,decrypt } from "./Encrypt"

export const login = async (email, password) => {
  let data = {
    email,
    password,
  }
  try {
    let res = await axios.post('login', data)
    catchAxiosSuccess(res)
    return res
  } catch (error) {
    catchAxiosError(error)
    throw error
  }
}


export const register = async (payload) => {
    try {
        let res = await axios.post('users', payload)
        let ciphertext = encrypt(JSON.stringify(payload),import.meta.env.VITE_ENCRYPT_KEY)
        localStorage.setItem('_register_data', ciphertext);        
        catchAxiosSuccess(res)   
        return res;
    } catch (error) {
        catchAxiosError(error)   
        throw error;
    }
  
}
// resend email
export const resendEmail = async (data) => {

  try {
    let res = await axios.post('send-user-email', data)
    catchAxiosSuccess(res)
    return res
  } catch (error) {
    catchAxiosError(error)
    throw error
  }
}
export const verifyEmail = async (token) => {

  try {
    let res = await axios.put(`email-verification/${token}`)
    catchAxiosSuccess(res)
    return res
  } catch (error) {
    catchAxiosError(error)
    throw error
  }
}

// forgot password
// export const forgottenPassword = async (email) => {
//   let data = {
//     email
//   }

//   try {
//     let res = await axios.post('forgot-password', data)
//     catchAxiosSuccess(res)
//     return res
//   } catch (error) {
//     catchAxiosError(error)
//     throw error
//   }
// }

export const getToken = () => {

    let encryptedData  = localStorage.getItem("_user_data");
    if(encryptedData){
        let user  = decrypt(encryptedData,import.meta.env.VITE_ENCRYPT_KEY)
        return user.token;
    }
    return null;
}
export const getUser = () => {

    let encryptedData  = localStorage.getItem("_user_data");
    if(encryptedData){
        let user  = decrypt(encryptedData,import.meta.env.VITE_ENCRYPT_KEY)
        return user;
    }
    return null;
}


export const logout = async () => {
        const token = await getToken()
  try {
    let res = await axios.post(`log-out`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res
  } catch (error) {
    catchAxiosError(error)
    throw error
  }
}
