// services/indexedDBService.js
import { openDB } from 'idb';

// Function to initialize Sales DB
export async function initializeSalesDB() {
  return openDB('sales-db', 1, { // Fixed version number during development
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        db.createObjectStore('products', { keyPath: 'id' });
        db.createObjectStore('sales', { autoIncrement: true });
        db.createObjectStore('payment-methods', { keyPath: 'id' });
        db.createObjectStore('customers', {  autoIncrement: true});
        db.createObjectStore('purchases', {  autoIncrement: true});
      }
    }
  });
}
//Initialize User Db
export async function initializeUserDB() {
  return openDB('user-db', 1, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        db.createObjectStore('user', { keyPath: 'id' });
      }
    }
  });
}

// Function to add a product to IndexedDB
export async function addProduct(product) {
  const db = await initializeSalesDB();
  const tx = db.transaction('products', 'readwrite');
  const store = tx.objectStore('products');
  await store.put(product);
  await tx.done;
}

// Function to get all products from IndexedDB
export async function getAllProducts() {
  const db = await initializeSalesDB();
  const tx = db.transaction('products', 'readonly');
  const store = tx.objectStore('products');
  return store.getAll();
}

// Function to add a sale to IndexedDB
export async function addSale(saleData) {
  const db = await initializeSalesDB();
  const tx = db.transaction('sales', 'readwrite');
  const store = tx.objectStore('sales');
  await store.put(saleData);
  await tx.done;
}

// Function to get all sales from IndexedDB
export async function getAllSales() {
  const db = await initializeSalesDB();
  const tx = db.transaction('sales', 'readonly');
  const store = tx.objectStore('sales');
  return store.getAll();
}

// Function to add a customer to IndexedDB
export async function addCustomer(customerData) {
  const db = await initializeSalesDB();
  const tx = db.transaction('customers', 'readwrite');
  const store = tx.objectStore('customers');
  await store.put(customerData);
  await tx.done;
}
// Function to get all customers from IndexedDB
export async function getAllCustomers() {
  const db = await initializeSalesDB();
  const tx = db.transaction('customers', 'readonly');
  const store = tx.objectStore('customers');
  return store.getAll();
}


// Function to get a specific product by ID
export async function getProductById(productId) {
  const db = await initializeSalesDB();
  const tx = db.transaction('products', 'readonly');
  const store = tx.objectStore('products');
  return store.get(productId);
}
//Function to add paymethod to store
export async function addPaymentMethods(paymentMethods) {
  const db = await initializeSalesDB();
  const tx = db.transaction('payment-methods', 'readwrite');
  const store = tx.objectStore('payment-methods');
  paymentMethods.forEach(method => {
    store.put(method);  // Store each payment method
  });
  await tx.done;
}

// Function to get all payment methods from IndexedDB
export async function getAllPaymentMethods() {
  const db = await initializeSalesDB();
  const tx = db.transaction('payment-methods', 'readonly');
  const store = tx.objectStore('payment-methods');
  return store.getAll();
}
// Function to add purchase to the store
export async function addPurchases(purchaseData) {
  const db = await initializeSalesDB();
  const tx = db.transaction('purchases', 'readwrite');
  const store = tx.objectStore('purchases');
  await store.put(purchaseData);
  await tx.done;
}

// Function to get all payment methods from IndexedDB
export async function getPurchases() {
  const db = await initializeSalesDB();
  const tx = db.transaction('purchases', 'readonly');
  const store = tx.objectStore('purchases');
  return store.getAll();
}