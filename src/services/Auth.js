import axios from "../axios";
import { catchAxiosError, catchAxiosSuccess }  from "./Response"
import { encrypt,decrypt } from "./Encrypt"

export const login = async (email, password, organization_code) => {
  let data = {
    email,
    password,
    organization_code
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
export const resendEmail = async (email ) => {
  let data = {
    email
  }

  try {
    let res = await axios.post('email-verification', data)
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
        return user.data.token;
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


