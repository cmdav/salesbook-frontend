/* eslint-disable no-undef */
/* global idb, CryptoJS */

// Import idb from CDN and crypto-js for decryption
importScripts('https://cdn.jsdelivr.net/npm/idb@8/build/umd.js');
importScripts('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js');

let encryptionKey = "RadsDashboard#$%245";

self.addEventListener('install', (event) => {
  console.log('Service worker installed', event);
  self.skipWaiting(); // Force the waiting service worker to become active
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activated');
  event.waitUntil(self.clients.claim()); // Take control of any open clients (pages)
});
self.addEventListener('online', (event) => {
  console.log('Service worker detected online status. Syncing sales...', event);
  //syncSalesToServer(); // Directly call the sync function when back online
});

// Sync event listener for offline sales
self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-sales') {
    console.log('Background sync in progress');
    event.waitUntil(syncSalesToServer()); // Wait until the sync is complete
  }
});

// Open the sales database using idb
const dbPromise = idb.openDB('sales-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('sales')) {
      db.createObjectStore('sales', { keyPath: 'id', autoIncrement: true });
    }
  },
});

// Define the openUserDB function to open the 'user-db' IndexedDB
async function openUserDB() {
  return idb.openDB('user-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('user')) {
        db.createObjectStore('user', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

// Use the existing 'user-db' to retrieve the token (instead of 'auth-db')
async function getTokenFromIndexedDB() {
  try {
    const db = await openUserDB();
    const tx = db.transaction('user', 'readonly');
    const store = tx.objectStore('user');
    const userEntry = await store.get(1);
    return userEntry ? userEntry.encryptedUser : null;
  } catch (error) {
    console.error('Error retrieving token from IndexedDB:', error);
    return null;
  }
}

// Function to decrypt token using CryptoJS
function decryptToken(encryptedToken, key) {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedToken, key).toString(CryptoJS.enc.Utf8);
    const decryptedObject = JSON.parse(decrypted); 

    // Access the token
    return decryptedObject.token;
    
  } catch (error) {
    console.error('Error decrypting token:', error);
    return null;
  }
}

// Function to sync sales from IndexedDB to the server
async function syncSalesToServer() {
  try {
    if (!encryptionKey) {
      console.error('No encryption key available, cannot decrypt token');
      return;
    }

    const encryptedToken = await getTokenFromIndexedDB();
    if (!encryptedToken) {
      console.error('No token found, cannot sync sales');
      return;
    }

    const token = decryptToken(encryptedToken, encryptionKey); // Use the decryptToken function
    
    //console.log('Decrypted Token:', token);

    const db = await dbPromise;
    const tx = db.transaction('sales', 'readonly');
    const store = tx.objectStore('sales');
    
    const allSales = await store.getAll(); // Get all sales data
const allKeys = await store.getAllKeys(); // Get all keys for the sales

if (allSales.length > 0) {
  for (let i = 0; i < allSales.length; i++) {
    const sale = allSales[i]; // Current sale
    const saleKey = allKeys[i]; // Corresponding key for the sale

    try {
      //let url="http://127.0.0.1:8000/api/v1/sales"
      //let url ="https://staging-backend.rdas.com.ng/api/v1/sales"
      let url ="https://backend-isalesbook.isalesbook.com/api/v1"
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include decrypted token in Authorization header
        },
        body: JSON.stringify(sale), // Submit the sale data
      });

      if (response.ok) {
        const deleteTx = db.transaction('sales', 'readwrite'); // Start a transaction
        const deleteStore = deleteTx.objectStore('sales'); // Get the sales object store

        await deleteStore.delete(saleKey); // Delete the sale by key
        await deleteTx.done; // Ensure the transaction is complete

        console.log('Sales data synced and removed from IndexedDB:', saleKey);
      } else {
        console.error('Failed to sync sale:', sale);
      }
    } catch (syncError) {
      console.error('Sync error for sale:', sale, syncError);
    }
  }
}

  } catch (error) {
    console.error('Error during syncSalesToServer:', error);
  }
}
