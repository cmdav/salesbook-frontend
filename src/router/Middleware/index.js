import { decrypt } from '@/services/Encrypt'
import { logout } from '@/services/Auth'

const getUserFromSessionStorage = () => {
  const encryptedData = sessionStorage.getItem('_user_data')
  return encryptedData ? decrypt(encryptedData, import.meta.env.VITE_ENCRYPT_KEY) : null
}

const redirectLogin = () => {
  const user = getUserFromSessionStorage()
  return user && user.token ? undefined : { name: 'login' }
}

const redirectDashboard = () => {
  const user = getUserFromSessionStorage()
  return user && user.token ? { name: 'welcome' } : undefined
}

const redirectSupplierDashboard = () => {
  const user = getUserFromSessionStorage()
  return user && user.token ? { name: 'supplier-dashboard' } : undefined
}

const deleteSession = async () => {
  if (sessionStorage.getItem('_user_data')) {
    logout()
    sessionStorage.removeItem('_user_data')
    return { name: 'login' }
  }
}
const deleteSupplierSession = async () => {
  if (sessionStorage.getItem('_user_data')) {
    logout()
    sessionStorage.removeItem('_user_data')
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

