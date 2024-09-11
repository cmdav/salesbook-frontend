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
  return user && user.token ? { name: 'welcome' } : undefined
}

const redirectSupplierDashboard = () => {
  const user = getUserFromLocalStorage()
  return user && user.token ? { name: 'supplier-dashboard' } : undefined
}

const deleteSession = async () => {
  if (localStorage.getItem('_user_data')) {
    logout()
    localStorage.removeItem('_user_data')
    return { name: 'login' }
  }
}
const deleteSupplierSession = async () => {
  if (localStorage.getItem('_user_data')) {
    logout()
    localStorage.removeItem('_user_data')
    return { name: 'supplier-login' }
  }
}
export default {
  redirectLogin,
  redirectDashboard,
  redirectSupplierDashboard,
  deleteSession,
  deleteSupplierSession
}

