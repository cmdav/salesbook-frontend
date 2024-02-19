import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { encrypt,decrypt } from "../services/Encrypt"

export const useStore = defineStore('user', () => {

  const user = ref(null)

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


  return {
    user,
    getUser,
    saveUser,
  }
})