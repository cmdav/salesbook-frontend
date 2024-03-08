import { ref } from 'vue';

export const formFields = ref([
  { label: 'Product Name', type: 'text', value: 'a', required: true, placeholder: 'Enter product name', databaseField: "product_name" },
  { label: 'Product Description', type: 'textarea', value: 'b', required: false, placeholder: 'Enter product description', databaseField: "product_description" },
  { label: 'Product Image', type: 'image', value: '', required: false, placeholder: 'Enter image URL', databaseField: "product_image" },
  { label: 'Measurement', type: 'select', value: '', required: true, placeholder: 'Select Measurement', options: [], databaseField: "measurement_id" },
  { label: 'Category', type: 'select', value: '', required: true, placeholder: 'Enter category ', options: [], databaseField: "category_id" },
  { label: 'Sub Category', type: 'select', value: '', required: true, placeholder: 'Select Sub category', options: [], showLoading: true, databaseField: "sub_category_id" },
]);