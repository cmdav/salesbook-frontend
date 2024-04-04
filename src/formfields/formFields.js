import { ref } from 'vue';



export const measurementFormFields = ref([
  { label: 'Measurement Name', type: 'text', value: '', required: true, placeholder: 'Enter measurement name', databaseField: "measurement_name" },
  { label: 'Unit', type: 'text', value: '', required: true, placeholder: 'Enter unit', maxLength: 5, databaseField: "unit" },
  
]);


export const currenciesFormFields = ref([
  { label: 'Currency Name', type: 'text', value: '', required: true, placeholder: 'Enter currency name', databaseField: "currency_name" },
  { label: 'Currency Symbol', type: 'text', value: '', required: true, placeholder: 'Enter currency symbol', databaseField: "currency_symbol" }
]);

export const productCategoryFormFields = ref([
  { label: 'Category Name', type: 'text', value: '', required: true, placeholder: 'Enter category name', databaseField: "category_name" },
  { label: 'Category Description', type: 'textarea', value: '', required: true, placeholder: 'Enter category description', databaseField: "category_description" }
]);

export const productSubCategoryFormFields = ref([
  { label: 'Category', type: 'select', value: '', required: true, placeholder: 'Enter category ', options: [], databaseField: "category_id"},
  { label: 'Sub Category Name', type: 'text', value: '', required: true, placeholder: 'Enter sub category name', databaseField: "sub_category_name" },
  { label: 'Sub Category Description', type: 'textarea', value: '', required: true, placeholder: 'Enter sub category description', databaseField: "sub_category_description" }
]);

export const formFields = ref([
  { label: 'Product Name', type: 'text', value: '', required: true, placeholder: 'Enter product name', databaseField: "product_name" },
  { label: 'Product Description', type: 'textarea', value: '', required: true, placeholder: 'Enter product description', databaseField: "product_description" },
  { label: 'Product Image', type: 'image', value: '', required: false, placeholder: 'Enter image URL', databaseField: "product_image" },
  // // { label: 'Purchasing price', type: 'text', value: '', required: false, placeholder: 'Enter purchasing price', databaseField: "purchasing_price" },
  // // { label: 'Selling Price', type: 'text', value: '', required: false, placeholder: 'Enter selling price', databaseField: "selling_price" },
  // { label: 'Actual Price', type: 'text', value: '', required: false, placeholder: 'Enter actual price', databaseField: "actual_price" },
  { label: 'Measurement', type: 'select', value: '', required: true, placeholder: 'Select Measurement', options: [], databaseField: "measurement_id" },
  { label: 'Category', type: 'select', value: '', required: true, placeholder: 'Enter category ', options: [], databaseField: "category_id" },
  { label: 'Sub Category', type: 'select', value: '', required: true, placeholder: 'Select Sub category', options: [], showLoading: true, databaseField: "sub_category_id" },
]);

export const productTypeFormFields = ref([
  { label: 'Product Name', type: 'select', value: '', required: false, placeholder: 'Enter product type', options: [], databaseField: "product_id" },
  { label: 'Product Type', type: 'text', value: '', required: true, placeholder: 'Enter product type', databaseField: "product_type_name" },
  { label: 'Product Type Image', type: 'image', value: '', required: false, placeholder: 'Enter image URL', databaseField: "product_type_image" },
  { label: 'Product Type Description', type: 'textarea', value: '', required: true, placeholder: 'Enter product type description', databaseField: "product_type_description" },
  // { label: 'Organization ID', type: 'text', value: '', required: false, placeholder: 'Enter organization ID', databaseField: "organization_id" },
  { label: 'Supplier', type: 'select', value: '', required: false, placeholder: 'Enter supplier ID', databaseField: "supplier_id" },
]);

export const purchaseFormFields = ref([
  { label: 'Product Type', type: 'select', value: '', required: true, placeholder: 'Enter product type ID', databaseField: "product_type_id" },
  { label: 'Supplier ID', type: 'text', value: '', required: false, placeholder: 'Enter supplier ID', databaseField: "supplier_id" },
  { label: 'Price', type: 'text', value: '', required: true, placeholder: 'Enter price ', databaseField: "price" },
  //{ label: 'Currency', type: 'select', value: '', required: true, placeholder: 'Enter currency ID', databaseField: "currency_id" },
  //{ label: 'Discount', type: 'number', value: 0, required: false, placeholder: 'Enter discount', databaseField: "discount" },
  { label: 'Batch Number', type: 'text', value: '', required: true, placeholder: 'Enter batch number', databaseField: "batch_no" },
  { label: 'Quantity', type: 'number', value: 0, required: true, placeholder: 'Enter quantity', databaseField: "quantity" },
  //{ label: 'Product Identifier', type: 'text', value: '', required: false, placeholder: 'Enter product identifier', databaseField: "product_identifier" },
  { label: 'Expiry Date', type: 'date', value: null, required: false, placeholder: 'Select expired date', databaseField: "expired_date" },
  // { label: 'Organization ID', type: 'text', value: '', required: false, placeholder: 'Enter organization ID', databaseField: "organization_id" },
  // { label: 'Purchase By', type: 'text', value: '0', required: true, placeholder: 'Enter purchase by', databaseField: "purchase_by" },
  // { label: 'Status', type: 'number', value: 0, required: false, placeholder: 'Enter status', databaseField: "status" },

]);

export const priceFormFields = ref([
  {
    label: 'Product Type',
    type: 'select',
    value: '',
    required: false,
    placeholder: 'Enter product type ID',
    options: [],
    databaseField: 'product_type_id'
  },
  // { label: 'Supplier ID', type: 'text', value: '', required: false, placeholder: 'Enter supplier ID', databaseField: "supplier_id" },
  { label: 'Cost Price', type: 'number', value: null, required: true, placeholder: 'Enter cost price', databaseField: "cost_price" },
  { label: 'Allow system to generate price', type: 'number', value:null, required: false, placeholder: 'Enter percentage increase', databaseField: "auto_generated_selling_price", min:0},
  { label: 'Selling Price', type: 'number', value: null, required: false, placeholder: 'Enter selling price', databaseField: "selling_price",min:0 },
 
  { label: 'Currency Name', type: 'select', value: '', required: true, placeholder: 'Enter currency ID', databaseField: "currency_id" },
  // { label: 'Discount', type: 'number', value: 0, required: false, placeholder: 'Enter discount', databaseField: "discount" },
  { label: 'Status', type: 'select', value: '1', required: false, placeholder: 'Enter status', databaseField: "status" ,options:[
                                                                                                                      {value:"1",label:"Active Price"},
                                                                                                                      {value:"0",label:"Inactive Price"}
                                                                                                                      ]},
  //{ label: 'Organization ID', type: 'text', value: '', required: false, placeholder: 'Enter organization ID', databaseField: "organization_id" },
])

export const saleFormFields = ref([
  { label: 'Product Type', type: 'select', value: '', required: true, placeholder: 'Enter product type ID', databaseField: "product_type_id" },
  { label: 'Selling Price', type: 'select', value: null, required: true, placeholder: 'Selling', databaseField: "price_id"},
  { label: 'Price Sold At', type: 'number', value: null, required: true, placeholder: 'Enter price sold at', databaseField: "price_sold_at" },
  { label: 'Quantity', type: 'number', value:null, required: true, placeholder: 'Enter quantity', databaseField: "quantity"},
  { label: 'Total Price', type: 'number', value: null, required: true, placeholder: 'Total price', databaseField: "total_price", "readonly":true},
  
  { label: 'Customer', type: 'select', value: '', required: true, placeholder: 'Enter customer ID', databaseField: "customer_id" },
  { label: 'Payment Method', type: 'select', value: 'Cash', required: true, placeholder: 'select payment', databaseField: "payment_method" ,options:[
                                                                                                                      {value:"Cash",label:"Cash"},
                                                                                                                      {value:"Pos",label:"Pos"},
                                                                                                                      {value:"Bank Transfer",label:"Bank Transfer"}
                                                                                                                      ]},
  // { label: 'Customer Fullname', type: 'text', value: '', required: false, placeholder: 'Enter sales owner', databaseField: "sales_owner" },
  // { label: 'Customer Phone Number', type: 'text', value: '', required: false, placeholder: 'Enter created by', databaseField: "created_by" },
  // { label: 'Customer Address', type: 'text', value: '', required: false, placeholder: 'Enter updated by', databaseField: "updated_by" }
]);
 
  


export const storeFormFields = ref([
  { label: 'Product Type ID', type: 'text', value: '', required: true, placeholder: 'Enter product type ID', databaseField: "product_type_id" },
  { label: 'Price ID', type: 'text', value: '', required: true, placeholder: 'Enter price ID', databaseField: "price_id" },
  { label: 'Store Owner', type: 'text', value: '', required: true, placeholder: 'Enter store owner', databaseField: "store_owner" },
  { label: 'Quantity Available', type: 'number', value: 0, required: false, placeholder: 'Enter quantity available', databaseField: "quantity_available" },
  { label: 'Store Type', type: 'select', value: 0, required: true, placeholder: 'Select store type', options: [{ label: 'Supplier', value: 0 }, { label: 'Company', value: 1 }], databaseField: "store_type" },
  { label: 'Status', type: 'number', value: 0, required: false, placeholder: 'Enter status', databaseField: "status" },
  { label: 'Created By', type: 'text', value: '', required: false, placeholder: 'Enter created by', databaseField: "created_by" },
  { label: 'Updated By', type: 'text', value: '', required: false, placeholder: 'Enter updated by', databaseField: "updated_by" }
]);

