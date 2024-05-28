import { openDB } from "idb";

const dBPromise = openDB('isales-database', 1, {
    upgrade(dB){
        dB.createObjectStore('sales', { keyPath: "id" });
        dB.createObjectStore('sync-queue',{ keyPath: 'id', autoIncrement: true});
    },
});

export const getDb = async (storeName, key) => {
    const db = await dBPromise;
    return db.transaction(storeName).objectStore(storeName).get(key);
};

export const getAllDb = async (storeName) => {
    const db = await dBPromise;
    return db.transaction(storeName).objectStore(storeName).getAll();
};

export const setDb = async (storeName, value) => {
    const dB = await dBPromise;
    const tx = dB.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).put(value);
};

export const deleteDb = async (storeName, key) => {
    const db = await dBPromise;
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).delete(key);
} 