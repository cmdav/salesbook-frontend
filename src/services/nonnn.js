import axios from '../axios';
import { catchAxiosError, catchAxiosSuccess } from './Response';
import { getToken } from './Auth';
import { setDb, getAllDb, deleteDb } from '@/utils/db';

const isOnline = () => navigator.onLine;

export const getProductCategories = async () => {
  const token = await getToken();

  try {
    if (isOnline()) {
      let res = await axios.get('product-categories', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
      catchAxiosSuccess(res);
      res.data.forEach(category => setDb('product-categories', category));
      return res.data;
    } else {
      return await getAllDb('product-categories');
    }
  } catch (error) {
    console.log(error);
  }
};

export const addProductCategories = async (payload) => {
  const token = await getToken();

  try {
    if (isOnline()) {
      let res = await axios.post('product-categories', payload, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
      catchAxiosSuccess(res);
      return res.data;
    } else {
      await setDb('sync-queue', {
        url: 'product-categories',
        method: 'POST',
        data: payload,
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
      return payload;
    }
  } catch (error) {
    console.log(error);
  }
};

// Implement similar changes for other service functions...

export const syncData = async () => {
  if (!isOnline()) return;

  const syncQueue = await getAllDb('sync-queue');

  for (const item of syncQueue) {
    try {
      const response = await axios({
        method: item.method,
        url: item.url,
        data: item.data,
        headers: item.headers
      });

      if (response.status === 200 || response.status === 201) {
        await deleteDb('sync-queue', item.id);
      }
    } catch (error) {
      console.log('Failed to sync item:', item, error);
    }
  }
};

window.addEventListener('online', syncData);
