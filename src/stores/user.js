import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { encrypt, decrypt } from '../services/Encrypt'
import { getUserProfile } from '@/services/Profile'

export const useStore = defineStore('user', () => {
  const user = ref(null)
  const userProfileDetails = ref(null)

  const getUser = computed(() => {
    let encryptedData = localStorage.getItem('_user_data')
    if (encryptedData) {
      user.value = decrypt(encryptedData, import.meta.env.VITE_ENCRYPT_KEY)
      return user.value
    } else {
      return null // or any other appropriate default value
    }
  })

  const saveUser = (userData) => {
    user.value = userData
    let ciphertext = encrypt(JSON.stringify(user.value), import.meta.env.VITE_ENCRYPT_KEY)
    localStorage.setItem('_user_data', ciphertext)
  }
  const handleUserProfile = async () => {
    try {
      userProfileDetails.value = await getUserProfile()
      return userProfileDetails.value
    } catch (error) {
      console.error(error)
    }
  }
  const features = computed(() => {
    const accountLowerCase = getUser?.value?.user?.type;
    
      
      if (accountLowerCase === 2) {
        return ['STORE', 'PRODUCT', 'SUPPLIER', 'RECORDS', 'REPORTS', 'CUSTOMERS', 'INVENTORY'];
      } else if (accountLowerCase === 1) {
        return ['SUPPLIER_PRODUCT'];
      } else if (accountLowerCase === 0) {
        return ['0'];
      }
    
    return null;
  });
  
 
  return {
    user,
    getUser,
    saveUser,
    userProfileDetails,
    handleUserProfile,
    features
  }
})
