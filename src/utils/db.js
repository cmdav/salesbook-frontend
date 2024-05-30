// import { openDB } from "idb";

// const dBPromise = openDB('isales-database', 1, {
//     upgrade(dB){
//         // dB.createObjectStore('sales', { keyPath: "id" });
//         dB.createObjectStore('purchases', { keyPath: 'id', autoIncrement: true });
//         dB.createObjectStore('sync-queue',{ keyPath: 'id', autoIncrement: true});
//         dB.createObjectStore('suppliers', { keyPath: 'id' });
//         dB.createObjectStore('productTypes', { keyPath: 'id' });
//         dB.createObjectStore('batchNumbers', { keyPath: 'batch_no' });
//         dB.createObjectStore('sales', { keyPath: 'id' });
//         dB.createObjectStore('customers', { keyPath: 'id', autoIncrement: true });
//     },
// });

// export const getDb = async (storeName, key) => {
//     const db = await dBPromise;
//     return db.transaction(storeName).objectStore(storeName).get(key);
// };

// export const getAllDb = async (storeName) => {
//     const db = await dBPromise;
//     return db.transaction(storeName).objectStore(storeName).getAll();
// };

// export const setDb = async (storeName, value) => {
//     const db = await dBPromise;
//     const tx = db.transaction(storeName, 'readwrite');
//     tx.objectStore(storeName).put(value);
//     return tx.done;
// };

// export const deleteDb = async (storeName, key) => {
//     const db = await dBPromise;
//     const tx = db.transaction(storeName, 'readwrite');
//     tx.objectStore(storeName).delete(key);
// };

import { openDB } from "idb";

const dBPromise = openDB('isales-database', 1, {
    upgrade(db) {
        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains('sales')) {
            db.createObjectStore('sales', { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains('purchases')) {
            db.createObjectStore('purchases', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('sync-queue')) {
            db.createObjectStore('sync-queue', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('suppliers')) {
            db.createObjectStore('suppliers', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('productTypes')) {
            db.createObjectStore('productTypes', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('batchNumbers')) {
            db.createObjectStore('batchNumbers', { keyPath: 'batch_no' });
        }
        if (!db.objectStoreNames.contains('customers')) {
            db.createObjectStore('customers', { keyPath: 'id', autoIncrement: true });
        }
    },
});

export const getDb = async (storeName, key) => {
    try {
        const db = await dBPromise;
        return db.transaction(storeName).objectStore(storeName).get(key);
    } catch (error) {
        console.error('Failed to get data from IndexedDB:', error);
    }
};

export const getAllDb = async (storeName) => {
    try {
        const db = await dBPromise;
        return db.transaction(storeName).objectStore(storeName).getAll();
    } catch (error) {
        console.error('Failed to get all data from IndexedDB:', error);
    }
};

export const setDb = async (storeName, value) => {
    try {
        const db = await dBPromise;
        const tx = db.transaction(storeName, 'readwrite');
        tx.objectStore(storeName).put(value);
        await tx.done;
    } catch (error) {
        console.error('Failed to set data in IndexedDB:', error);
    }
};

export const deleteDb = async (storeName, key) => {
    try {
        const db = await dBPromise;
        const tx = db.transaction(storeName, 'readwrite');
        tx.objectStore(storeName).delete(key);
        await tx.done;
    } catch (error) {
        console.error('Failed to delete data from IndexedDB:', error);
    }
};
