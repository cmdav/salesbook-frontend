import axios from 'axios'
import { useRouter } from 'vue-router'
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_BASEURL
import { useToast } from 'vue-toastification'

const toast = useToast()

/*
 Axios Interceptor to log user out
*/

axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
        if (error.response.status === 401) {
            toast.error(error?.response?.data?.message, {
              timeout: 4000
            })
            localStorage.clear()
            useRouter.push('/logout')
        }
        return Promise.reject(error);
    }
  );

export default axios
