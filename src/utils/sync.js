// src/utils/sync.js
import { getAllDb, deleteDb } from '@/utils/db';

const syncData = async () => {
  if (navigator.onLine) {
    const unsyncedData = await getAllDb('unsynced');
    unsyncedData.forEach(async (data) => {
      // Send data to your backend
      await fetch('/api/sync', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Remove synced data from IndexedDB
      await deleteDb('unsynced', data.id);
    });
  }
};

window.addEventListener('online', syncData);

export default syncData;
