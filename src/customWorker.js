importScripts('/src/decodeToken'); 
importScripts('/idb.js'); 

let encryptionKey = "RadsDashboard#$%245"; // Store the encryption key received from the main app
self.addEventListener('install', (event) => {
  console.log(event)
  console.log('Service worker installed');
  self.skipWaiting(); // Force the waiting service worker to become active
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activated');
  event.waitUntil(
    self.clients.claim() // Take control of any open clients (pages)
  );
});

// Open the sales database using idb.js
var dbPromise = idb.open('sales-db', 1, function(db) {
  if (!db.objectStoreNames.contains('sales')) {
    db.createObjectStore('sales', { keyPath: 'id', autoIncrement: true });
  }
});

// Open a database to store the encrypted token
var userDbPromise = idb.open('user-db', 1, function(db) {
  if (!db.objectStoreNames.contains('user')) {
    db.createObjectStore('user', { keyPath: 'id' });
  }
});

// Sync event listener for offline sales
self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-sales') {
    console.log('Background sync in progress 2');
    event.waitUntil(syncSalesToServer()); // Wait until the sync is complete
  }
});

// Function to sync sales from IndexedDB to the server
async function syncSalesToServer() {
  try {
   

    // Check if encryption key is set
    if (!encryptionKey) {
      console.error('No encryption key available, cannot decrypt token');
      return;
    }

    // Retrieve the encrypted token from IndexedDB
    const encryptedToken = await getTokenFromIndexedDB();
    if (!encryptedToken) {
      console.error('No token found, cannot sync sales');
      return;
    }

    // Decrypt the token using the received encryption key
    const token = decrypt(encryptedToken, encryptionKey)['token'];
   // console.log(token);

    // Open the sales database
    const db = await dbPromise;
    const tx = db.transaction('sales', 'readonly');
    const store = tx.objectStore('sales');
    
    const allSales = await store.getAll(); // Get all stored sales
    console.log(allSales)
   

    if (allSales.length > 0) {
      // Loop through all sales and sync each one to the server
      for (const sale of allSales) {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/v1/sales', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Include decrypted token in Authorization header
            },
            body: JSON.stringify(sale), // Send sale data to the server
          });

          if (response.ok) {
            // If successful, remove the sale from IndexedDB
            const deleteTx = db.transaction('sales', 'readwrite');
            const deleteStore = deleteTx.objectStore('sales');
            await deleteStore.delete(sale.id);
            await deleteTx.complete;
            console.log('Sales data synced and removed from IndexedDB:', sale.id);
          } else {
            console.log(response)
            //console.error('Failed to sync sale:', sale);
          }
        } catch (syncError) {
          console.error('Sync error for sale:', sale, syncError);
          // Continue with the next sale even if one fails
        }
      }
    }
  } catch (error) {
    console.error('Error during syncSalesToServer:', error);
  }
}

// Function to retrieve the encrypted token from IndexedDB
async function getTokenFromIndexedDB() {
  const db = await userDbPromise;
  const tx = db.transaction('user', 'readonly');
  const store = tx.objectStore('user');
 
  // Assuming the token is stored with a fixed id of 1
  const tokenEntry = await store.getAll(); 
  // console.log()
  // console.log(tokenEntry)
  return tokenEntry ? tokenEntry[0]['encryptedUser'] : null;
}
