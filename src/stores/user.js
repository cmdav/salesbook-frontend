import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { encrypt, decrypt } from '../services/Encrypt'
import { getUserProfile, uploadCompanyLogo } from '@/services/Profile'
import { openDB } from 'idb'; // IndexedDB helper


// Open the IndexedDB database
async function openUserDB() {
  return await openDB('user-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('user')) {
        db.createObjectStore('user', { keyPath: 'id' });
      }
    }
  });
}

// Store encrypted user data in IndexedDB
async function storeUserInIndexedDB(userData) {
  const db = await openUserDB();
  const tx = db.transaction('user', 'readwrite');
  const store = tx.objectStore('user');
  await store.put({ id: 1, encryptedUser: userData });
  await tx.done;
}



// Delete user data from IndexedDB
async function deleteUserFromIndexedDB() {
  const db = await openUserDB();
  const tx = db.transaction('user', 'readwrite');
  const store = tx.objectStore('user');
  await store.delete(1);
  await tx.done;
}


export const useStore = defineStore('user', () => {
  const user = ref(null)
  const userProfileDetails = ref(null)

  const getUser = computed(() => {
    // let encryptedData = localStorage.getItem('_user_data')
    let encryptedData = sessionStorage.getItem('_user_data')
    if (encryptedData) {
      user.value = decrypt(encryptedData, import.meta.env.VITE_ENCRYPT_KEY)
      return user.value
    } else {
      return null
    }
  })

  const saveUser = async (userData) => {
    user.value = userData
    let ciphertext = encrypt(JSON.stringify(user.value), import.meta.env.VITE_ENCRYPT_KEY)
    // localStorage.setItem('_user_data', ciphertext)
    sessionStorage.setItem('_user_data', ciphertext)
    await storeUserInIndexedDB(ciphertext);
  }

  const clearUser = async () => {
    sessionStorage.removeItem('_user_data')
    await deleteUserFromIndexedDB();
    user.value = null
  }

  const handleUserProfile = async () => {
    try {
      userProfileDetails.value = await getUserProfile()
      return userProfileDetails.value
    } catch (error) {
      console.error(error)
    }
  }
  const handleUploadCompanyLogo = async (org_id, payload) => {
    try {
      let res = await uploadCompanyLogo(org_id, payload)
      return res
    } catch (error) {
      console.error(error)
    }
  }
 
  return {
    user,
    getUser,
    clearUser,
    saveUser,
    userProfileDetails,
    handleUserProfile,
    handleUploadCompanyLogo
  }
})