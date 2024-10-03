import idb from '@/utils/idb';

// Open or create the IndexedDB
const dbPromise = idb.open('registration-store', 1, (upgradeDB) => {
  if (!upgradeDB.objectStoreNames.contains('registrations')) {
    upgradeDB.createObjectStore('registrations', { keyPath: 'id' });
  }
});

// Store data in IndexedDB
export async function storeDataInIndexedDB(data) {
  const db = await dbPromise;
  const tx = db.transaction('registrations', 'readwrite');
  const store = tx.objectStore('registrations');
  await store.put(data);
  return tx.complete;
}

// Retrieve all data from IndexedDB
export async function getAllDataFromIndexedDB() {
  const db = await dbPromise;
  const tx = db.transaction('registrations', 'readonly');
  const store = tx.objectStore('registrations');
  return store.getAll();
}

// Delete data from IndexedDB after syncing
export async function deleteDataFromIndexedDB(id) {
  const db = await dbPromise;
  const tx = db.transaction('registrations', 'readwrite');
  const store = tx.objectStore('registrations');
  await store.delete(id);
  return tx.complete;
}
