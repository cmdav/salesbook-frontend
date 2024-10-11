import axios from '../axios'
import { catchAxiosError, catchAxiosSuccess } from './Response'
import { getToken } from './Auth';
//import { setDb, getDb, getAllDb, deleteDb } from '@/utils/db';


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
     // res.data.forEach(category => setDb('product-categories', category));
      return res.data;
    } else {
      //return await getAllDb('product-categories');
    }
  } catch (error) {
    console.log(error);
  }
};

// export const addProductCategories = async (payload) => {
//   const token = await getToken()

//   try {
//     let res = await axios.post(`product-categories`, payload, {
//       headers: {
//         Authorization: 'Bearer ' + token
//       }
//     })
//     catchAxiosSuccess(res)
//     return res.data
//   } catch (error) {
//     console.log(error)
//   }
// }

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
      // await setDb('sync-queue', {
      //   url: 'product-categories',
      //   method: 'POST',
      //   data: payload,
      //   headers: {
      //     Authorization: 'Bearer ' + token
      //   }
      // });
      return payload;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getProductSubCategories = async () => {
  const token = await getToken()

  try {
    let res = await axios.get(`product-sub-categories`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    catchAxiosError(error)
    throw error
  }
}
export const addProductSubCategories = async (payload) => {
  const token = await getToken()

  try {
    let res = await axios.post(`product-sub-categories`, payload, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    catchAxiosError(error)
    throw error
  }
}
export const getAllProductSubCategories = async () => {
  const token = await getToken()

  try {
    let res = await axios.get(`all-product-sub-categories`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    catchAxiosError(error)
    throw error
  }
}
export const getAllProducts = async () => {
  const token = await getToken()

  try {
    let res = await axios.get(`all-products`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    catchAxiosError(error)
    throw error
  }
}
export const getProducts = async (page) => {
  const token = await getToken()

  try {
    let res = await axios.get(`product-types?page=${page}`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    catchAxiosError(error)
    throw error
  }
}
export const addProducts = async (payload) => {
  const token = await getToken()

  try {
    let res = await axios.post(`products`, payload, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    catchAxiosError(error)
    throw error
  }
}
export const getSupplierProducts = async () => {
  const token = await getToken()

  try {
    let res = await axios.get(`supplier-products`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    catchAxiosError(error)
    throw error
  }
}
export const getAllSupplierProducts = async () => {
  const token = await getToken()

  try {
    let res = await axios.get(`all-supplier-products`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    catchAxiosError(error)
    throw error
  }
}
export const getStores = async () => {
  const token = await getToken()

  try {
    let res = await axios.get(`stores`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    catchAxiosError(error)
    throw error
  }
}
export const addSales = async (payload) => {
  const token = await getToken()

  try {
    let res = await axios.post(`stores`, payload, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    catchAxiosError(error)
    throw error
  }
}
export const updateInventories = async (id, payload) => {
  const token = await getToken()

  try {
    let res = await axios.put(`stores/${id}`, payload, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    catchAxiosError(error)
    throw error
  }
}
export const addMeasurements = async (payload) => {
  const token = await getToken()

  try {
    let res = await axios.post(`measurements`, payload, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    catchAxiosError(error)
    throw error
  }
}
export const getMeasurements = async () => {
  const token = await getToken()

  try {
    let res = await axios.get(`measurements`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    catchAxiosError(error)
    throw error
  }
}
export const getProductType = async () => {
  const token = await getToken()

  try {
    let res = await axios.get(`product-types`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    catchAxiosError(error)
    throw error
  }
}
export const getSales = async () => {
  const token = await getToken()

  try {
    let res = await axios.get(`sales?page=1`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    catchAxiosError(error)
    throw error
  }
}
export const getAllProductTypeName = async () => {
  const token = await getToken()

  try {
    let res = await axios.get(`all-product-type-name`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    catchAxiosError(error)
    throw error
  }
}

export const addSaless = async (payload) => {
  const token = await getToken()

  try {
    let res = await axios.post(`sales`, payload, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    catchAxiosError(error)
    throw error
  }
}
export const addPurchases = async (payload) => {
  const token = await getToken()

  try {
    let res = await axios.post(`purchases`, payload, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    catchAxiosError(error)
    throw error
  }
}

export const getSupplierByProductTypeId = async (id) => {
  const token = await getToken()

  try {
    let res = await axios.get(`get-suppliers-by-product-type-id/${id}`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    console.log(res)
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    catchAxiosError(error)
  }
}

export const getReceipt = async (transaction_id) => {
  const token = await getToken()

  try {
    let res = await axios.get(`download-sales-receipts/${transaction_id}`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    console.log(res.data)
    catchAxiosSuccess(res)
    return res.data
  } catch (error) {
    catchAxiosError(error)
  }
}
