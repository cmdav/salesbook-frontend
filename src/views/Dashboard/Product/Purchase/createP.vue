<template>
    <DashboardLayout pageTitle="Add Purchase">
      <div class="container">
        <div class="top-buttons">
          <router-link to="/purchase" class="button back-btn">Back</router-link>
          <button type="button" @click="addPurchase" class="button add-purchase-button">Add Purchase</button>
        </div>
        <div v-if="isLoading" class="loading-icon">Loading...</div>
        <form v-else @submit.prevent="handleSubmit">
          <div class="batch-container">
            <label for="batch_no">Batch No</label>
            <input type="text" v-model="batchNo" readonly />
          </div>
          <div v-for="(purchase, index) in purchases" :key="index" class="purchase-form">
            <div v-if="index !== 0" class="top-buttons">
              <button type="button" @click="addPurchase" class="button add-purchase-button">Add Purchase</button>
            </div>
            <div class="form-row">
              <div>
                <label for="supplier_id">Supplier <span class="required">*</span></label>
                <select v-model="purchase.supplier_id" @change="() => handleSupplierChange(index)">
                  <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                    {{ supplier.supplier_detail }}
                  </option>
                </select>
              </div>
              <div>
                <label for="product_type_id">Product Type <span class="required">*</span></label>
                <select v-model="purchase.product_type_id" @change="() => handleSupplierChange(index)">
                  <option v-for="productType in productTypes" :key="productType.id" :value="productType.id" :disabled="isDuplicatePurchase(purchase.supplier_id, productType.id)">
                    {{ productType.product_type_name }}
                  </option>
                </select>
              </div>
              <div>
                <label for="cost_price">Cost Price <span class="required">*</span></label>
                <input type="number" v-model="purchase.cost_price" :readonly="purchase.isCostPriceReadonly" maxlength="9" required />
              </div>
              <div>
                <label for="selling_price">Selling Price <span class="required">*</span></label>
                <input type="number" v-model="purchase.selling_price" @change="handleSellingPriceChange(index)" maxlength="9" :readonly="purchase.isSellingPriceReadonly" required />
              </div>
              <div>
                <label for="quantity">Qty <span class="required">*</span></label>
                <input type="number" v-model="purchase.quantity" maxlength="5" required />
              </div>
              <div>
                <label for="product_identifier">Product Identifier</label>
                <input type="text" v-model="purchase.product_identifier" />
              </div>
              <div>
                <label for="expiry_date">Expiry Date</label>
                <input type="date" v-model="purchase.expiry_date" :min="minExpiryDate" class="expiry-date" />
              </div>
              <input type="hidden" v-model="purchase.price_id" />
            </div>
            <hr class="separator" />
          </div>
          <button type="submit" class="button submit-button">Submit</button>
        </form>
      </div>
    </DashboardLayout>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from '@/services/axios';
  import { catchAxiosError, catchAxiosSuccess } from '@/services/Response';
 
  
  const router = useRouter();
  const suppliers = ref([]);
  const productTypes = ref([]);
  const batchNo = ref('');
  const isLoading = ref(false);
  const error = ref(null);
  const purchases = ref([
    {
      supplier_id: '',
      product_type_id: '',
      price_id: '',
      cost_price: '',
      selling_price: '',
      batch_no: '',
      quantity: '',
      product_identifier: '',
      expiry_date: '',
      isCostPriceReadonly: false,
      isSellingPriceReadonly: false
    }
  ]);
  
  const minExpiryDate = new Date().toISOString().split('T')[0];
  
  const isOnline = () => navigator.onLine;
  
  const fetchData = async () => {
    try {
      isLoading.value = true;
      if (isOnline()) {
        const [suppliersResponse, productTypesResponse, lastBatchNumberResponse] = await Promise.all([
          axios.get('all-suppliers'),
          axios.get('all-product-type'),
          axios.get('last-batch-number')
        ]);
  
        if (suppliersResponse.data) {
          suppliers.value = suppliersResponse.data;
          suppliers.value.forEach(supplier => setDb('suppliers', supplier));
          purchases.value[0].supplier_id = suppliers.value[0].id;
        } else {
          error.value = 'No suppliers found';
        }
  
        if (productTypesResponse.data) {
          productTypes.value = productTypesResponse.data;
          productTypes.value.forEach(productType => setDb('productTypes', productType));
        } else {
          error.value = 'No product types found';
        }
  
        if (lastBatchNumberResponse.data && lastBatchNumberResponse.data.batch_no) {
          const lastBatchNo = parseInt(lastBatchNumberResponse.data.batch_no);
          batchNo.value = String(lastBatchNo + 1).padStart(5, '0');
          purchases.value.forEach(purchase => purchase.batch_no = batchNo.value);
          await setDb('batchNumbers', { batch_no: batchNo.value });
        } else {
          batchNo.value = '00001';
          purchases.value.forEach(purchase => purchase.batch_no = batchNo.value);
          await setDb('batchNumbers', { batch_no: batchNo.value });
        }
      } else {
        suppliers.value = await getAllDb('suppliers');
        productTypes.value = await getAllDb('productTypes');
        const batchNumber = await getDb('batchNumbers', 'batch_no');
        batchNo.value = batchNumber ? batchNumber.batch_no : '00001';
        purchases.value.forEach(purchase => purchase.batch_no = batchNo.value);
      }
    } catch (err) {
      catchAxiosError(err);
    } finally {
      isLoading.value = false;
    }
  };
  
  const handleSupplierChange = async (index) => {
    const purchase = purchases.value[index];
    if (!purchase.product_type_id || !purchase.supplier_id) {
      catchAxiosError({ message: 'Please select both supplier and product type.' });
      return;
    }
    if (isOnline()) {
      try {
        const response = await axios.get(`latest-supplier-price/${purchase.product_type_id}/${purchase.supplier_id}`);
        if (response.data) {
          purchase.price_id = response.data.id;
          purchase.cost_price = response.data.cost_price;
          purchase.selling_price = response.data.selling_price;
          purchase.isCostPriceReadonly = true;
          purchase.isSellingPriceReadonly = true;
          // Store the supplier price in IndexedDB
          await setDb('latestSupplierPrices', {
            id: `${purchase.product_type_id}-${purchase.supplier_id}`,
            ...response.data
          });
        } else {
          purchase.price_id = '';
          purchase.cost_price = '';
          purchase.selling_price = '';
          purchase.isCostPriceReadonly = false;
          purchase.isSellingPriceReadonly = false;
        }
      } catch (err) {
        catchAxiosError(err);
      }
    } else {
      const cachedData = await getDb('latestSupplierPrices', `${purchase.product_type_id}-${purchase.supplier_id}`);
      if (cachedData) {
        purchase.price_id = cachedData.id;
        purchase.cost_price = cachedData.cost_price;
        purchase.selling_price = cachedData.selling_price;
        purchase.isCostPriceReadonly = true;
        purchase.isSellingPriceReadonly = true;
      } else {
        purchase.price_id = '';
        purchase.cost_price = '';
        purchase.selling_price = '';
        purchase.isCostPriceReadonly = false;
        purchase.isSellingPriceReadonly = false;
      }
    }
  };
  
  const addPurchase = () => {
    const lastPurchase = purchases.value[purchases.value.length - 1];
    if (lastPurchase.supplier_id && lastPurchase.product_type_id && lastPurchase.quantity && lastPurchase.cost_price && lastPurchase.selling_price) {
      purchases.value.push({
        supplier_id: suppliers.value.length > 0 ? suppliers.value[0].id : '',
        product_type_id: '',
        price_id: '',
        cost_price: '',
        selling_price: '',
        batch_no: batchNo.value,
        quantity: '',
        product_identifier: '',
        expiry_date: '',
        isCostPriceReadonly: false,
        isSellingPriceReadonly: false
      });
    } else {
      catchAxiosError({ message: 'Please fill out all required fields before adding a new purchase.' });
    }
  };
  
  const isDuplicatePurchase = (supplier_id, product_type_id) => {
    return purchases.value.some(purchase => purchase.supplier_id === supplier_id && purchase.product_type_id === product_type_id);
  };
  
  const handleSellingPriceChange = (index) => {
    const purchase = purchases.value[index];
    if (purchase.selling_price < purchase.cost_price) {
      purchase.selling_price = '';
    }
  };
  
  const handleSubmit = async () => {
    const lastPurchase = purchases.value[purchases.value.length - 1];
    if (!lastPurchase.supplier_id || !lastPurchase.product_type_id || !lastPurchase.quantity || !lastPurchase.cost_price || !lastPurchase.selling_price) {
      purchases.value.pop();
    }
  
    try {
      const formattedPurchases = purchases.value.map(purchase => {
        if (purchase.price_id) {
          return {
            ...purchase,
            cost_price: undefined,
            selling_price: undefined
          };
        } else {
          return {
            ...purchase,
            price_id: undefined
          };
        }
      });
  
      if (navigator.onLine) {
        const response = await axios.post('purchases', { purchases: formattedPurchases });
        catchAxiosSuccess(response);
        router.push('/purchase');
      } else {
        await setDb('sync-queue', { method: 'POST', url: 'purchases', data: { purchases: formattedPurchases }, headers: { 'Content-Type': 'application/json' } });
        router.push('/purchase');
        alert('You are offline. Your data will be synced once you are back online.');
      }
    } catch (err) {
      catchAxiosError(err);
    }
  };
  
  onMounted(() => {
    fetchData();
  });
  </script>
  