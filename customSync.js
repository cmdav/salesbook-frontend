// customSync.js

import CryptoJS from 'crypto-js';
import { initializeSalesDB, initializeUserDB} from '@/services/indexedDbService'

const encryptionKey = "RadsDashboard#$%245";

export async function syncCustomersToServer() {
  try {
    const db = await initializeSalesDB(); 
    const customersTx = db.transaction('customers', 'readonly');
    const customersStore = customersTx.objectStore('customers');
    const allCustomers = await customersStore.getAll();
    console.log('processing customer')
    //console.log(allCustomers)
    const allKeys = await customersStore.getAllKeys();
    //console.log(allKeys)
    const token = await getDecryptedToken();
    if (!token) {
      console.error("No valid token found");
      return;
    }

    if (allCustomers.length > 0) {
      for (let i = 0; i < allCustomers.length; i++) {
        const customer = allCustomers[i];
        const customerKey = allKeys[i];
       
        console.log(customer)
        try {
          const url = import.meta.env.VITE_BACKEND_BASEURL+"customers"
          
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(customer),
          });

          if (response.ok) {
            const deleteTx = db.transaction('customers', 'readwrite');
            const deleteStore = deleteTx.objectStore('customers');
            await deleteStore.delete(customerKey);
            await deleteTx.done;
            console.log(`Customer ${customerKey} synced and removed from IndexedDB`);
          } else {
            console.error('Failed to sync customer:', customer);
          }
        } catch (syncError) {
          console.error('Sync error:', syncError);
        }
      }
    }
  } catch (error) {
    console.error('Error during syncCustomersToServer:', error);
  }
}

// Open sales and user DB
export async function syncSalesToServer() {
  try {
    const db = await initializeSalesDB(); 
    const salesTx = db.transaction('sales', 'readonly');
    const salesStore = salesTx.objectStore('sales');
    const allSales = await salesStore.getAll();
    const allKeys = await salesStore.getAllKeys();
    const token = await getDecryptedToken();
    if (!token) {
      console.error("No valid token found");
      return;
    }


    if (allSales.length > 0) {
      for (let i = 0; i < allSales.length; i++) {
        const sale = allSales[i];
        const saleKey = allKeys[i];
       
        try {
          const url = import.meta.env.VITE_BACKEND_BASEURL+"sales"
          
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(sale),
          });

          if (response.ok) {
            const deleteTx = db.transaction('sales', 'readwrite');
            const deleteStore = deleteTx.objectStore('sales');
            await deleteStore.delete(saleKey);
            await deleteTx.done;
            console.log(`Sale ${saleKey} synced and removed from IndexedDB`);
          } else {
            console.error('Failed to sync sale:', sale);
          }
        } catch (syncError) {
          console.error('Sync error:', syncError);
        }
      }
    }
  } catch (error) {
    console.error('Error during syncSalesToServer:', error);
  }
}

// Function to open the user DB and get the decrypted token
async function getDecryptedToken() {
  const db = await initializeUserDB();
  const tx = db.transaction('user', 'readonly');
  const store = tx.objectStore('user');
  const userEntry = await store.get(1);

  if (userEntry) {
    const encryptedToken = userEntry.encryptedUser;
    return decryptToken(encryptedToken, encryptionKey);
  }

  return null;
}

function decryptToken(encryptedToken, key) {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedToken, key).toString(CryptoJS.enc.Utf8);
    const decryptedObject = JSON.parse(decrypted);
    return decryptedObject.token;
  } catch (error) {
    console.error('Error decrypting token:', error);
    return null;
  }
}
