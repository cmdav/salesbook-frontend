import { ref } from 'vue'

export const userFormFields = ref([
  {
    label: 'First Name',
    type: 'text',
    value: '',
    required: true,
    placeholder: 'Enter first name',
    databaseField: 'first_name'
  },
  {
    label: 'Last Name',
    type: 'text',
    value: '',
    required: true,
    placeholder: 'Enter last name',
    databaseField: 'last_name'
  },
  {
    label: 'Email',
    type: 'email',
    value: '',
    required: true,
    placeholder: 'Enter email',
    databaseField: 'email'
  },
  {
    label: 'Branch',
    type: 'select',
    value: '',
    required: true,
    placeholder: 'Select Branch',
    options: [],
    databaseField: 'branch_id'
  },
  {
    label: 'Role',
    type: 'select',
    value: '',
    required: true,
    placeholder: 'Select Role',
    options: [],
    databaseField: 'role_id'
  },
  {
    label: 'Password',
    type: 'password',
    value: '',
    required: false,
    placeholder: 'Enter password',
    databaseField: 'password'
  },
  {
    label: 'Confirm Password',
    type: 'password',
    value: '',
    required: false,
    placeholder: 'Confirm password',
    databaseField: 'password_confirmation'
  }
]);
export const userEditFormFields = ref([
  {
    label: 'First Name',
    type: 'text',
    value: '',
    required: true,
    placeholder: 'Enter first name',
    databaseField: 'first_name'
  },
  {
    label: 'Last Name',
    type: 'text',
    value: '',
    required: true,
    placeholder: 'Enter last name',
    databaseField: 'last_name'
  },
  {
    label: 'Email',
    type: 'email',
    value: '',
    required: true,
    placeholder: 'Enter email',
    databaseField: 'email'
  },
  {
    label: 'Branch',
    type: 'select',
    value: '',
    required: true,
    placeholder: 'Select Branch',
    options: [],
    databaseField: 'branch_id'
  },
  {
    label: 'Role',
    type: 'select',
    value: '',
    required: true,
    placeholder: 'Select Role',
    options: [],
    databaseField: 'role_id'
  }
  
])

export const subscriptionFormFields = ref([
  {
    label: 'Plan Name',
    type: 'text',
    value: '',
    required: true,
    placeholder: 'Enter a Plan',
    databaseField: 'plan_name'
  },
  {
    label: 'Description',
    type: 'text',
    value: '',
    required: true,
    placeholder: 'Enter a Description',
    databaseField: 'description'
  },
])

export const measurementFormFields = ref([
  {
    label: 'Measurement Name',
    type: 'text',
    value: '',
    required: true,
    placeholder: 'Enter measurement name',
    databaseField: 'measurement_name'
  },
  {
    label: 'Unit',
    type: 'text',
    value: '',
    required: true,
    placeholder: 'Enter unit',
    maxLength: 5,
    databaseField: 'unit'
  }
])

export const currenciesFormFields = ref([
  {
    label: 'Currency Name',
    type: 'text',
    value: '',
    required: true,
    placeholder: 'Enter currency name',
    databaseField: 'currency_name'
  },
  {
    label: 'Currency Symbol',
    type: 'text',
    value: '',
    required: true,
    placeholder: 'Enter currency symbol',
    databaseField: 'currency_symbol'
  }
])

export const productCategoryFormFields = ref([
  {
    label: 'Category Name',
    type: 'text',
    value: '',
    required: true,
    placeholder: 'Enter category name',
    databaseField: 'category_name'
  },
  {
    label: 'Category Description',
    type: 'textarea',
    value: '',
    required: true,
    placeholder: 'Enter category description',
    databaseField: 'category_description'
  }
])

export const productSubCategoryFormFields = ref([
  {
    label: 'Category',
    type: 'select',
    value: '',
    required: true,
    placeholder: 'Enter category ',
    options: [],
    databaseField: 'category_id'
  },
  {
    label: 'Sub Category Name',
    type: 'text',
    value: '',
    required: true,
    placeholder: 'Enter sub category name',
    databaseField: 'sub_category_name'
  },
  {
    label: 'Sub Category Description',
    type: 'textarea',
    value: '',
    required: true,
    placeholder: 'Enter sub category description',
    databaseField: 'sub_category_description'
  }
])

export const formFields = ref([
  {
    label: 'Product Name',
    type: 'text',
    value: '',
    required: true,
    placeholder: 'Enter product name',
    databaseField: 'product_name'
  },
  {
    label: 'Product Description',
    type: 'textarea',
    value: '',
    required: true,
    placeholder: 'Enter product description',
    databaseField: 'product_description'
  },
  {
    label: 'Product Image',
    type: 'image',
    value: '',
    required: false,
    placeholder: 'Enter image URL',
    databaseField: 'product_image'
  },
  {
    label: 'VAT',
    type: 'select',
    value: '1',
    required: true,
    placeholder: 'Select VAT',
    databaseField: 'vat',
    options: [
      { value: '1', label: 'Yes' },
      { value: '0', label: 'No' }
    ]
  },
  // // { label: 'Purchasing price', type: 'text', value: '', required: false, placeholder: 'Enter purchasing price', databaseField: "purchasing_price" },
  // // { label: 'Selling Price', type: 'text', value: '', required: false, placeholder: 'Enter selling price', databaseField: "selling_price" },
  // { label: 'Actual Price', type: 'text', value: '', required: false, placeholder: 'Enter actual price', databaseField: "actual_price" },
  
  {
    label: 'Category',
    type: 'select',
    value: '',
    required: true,
    placeholder: 'Enter category ',
    options: [],
    databaseField: 'category_id'
  },
  {
    label: 'Sub Category',
    type: 'select',
    value: '',
    required: true,
    placeholder: 'Select Sub category',
    options: [],
    showLoading: true,
    databaseField: 'sub_category_id'
  }
])

export const productTypeFormFields = ref([
  {
    label: 'Product Name',
    type: 'text',
    value: '',
    required: false,
    placeholder: 'Choose Product Name',
    options: [],
    databaseField: 'product_type_name'
  },
  {
    label: 'Product Image',
    type: 'image',
    value: '',
    required: true,
    placeholder: 'Choose Image Url',
    databaseField: 'product_type_image'
  },
  {
    label: 'Product Description',
    type: 'text',
    value: '',
    required: false,
    placeholder: 'Enter Product Description',
    databaseField: 'product_type_description'
  },
  {
    label: 'Barcode',
    type: 'text',
    value: '',
    required: true,
    placeholder: 'Enter Barcode',
    databaseField: 'barcode'
  },
  {
    label: 'Vat',
    type: 'text',
    value: '',
    required: true,
    placeholder: 'Enter VAT',
    // options: [],
    databaseField: 'vat'
  },
  {
    label: 'Product Category',
    type: 'select',
    value: '',
    required: true,
    option: [],
    placeholder: 'Select Product Category',
    databaseField: 'category_id'
  },
  {
    label: 'Product Sub Category',
    type: 'select',
    value: '',
    required: true,
    option: [],
    placeholder: 'Select Product Sub Category',
    databaseField: 'sub_category_id'
  },
   {
    label: 'Purchase Unit',
    type: 'select',
    value: '',
    required: true,
    placeholder: 'Select Purchase Unit ',
    options: [],
    databaseField: 'purchase_unit_id'
  },
  {
    label: 'Selling Unit',
    type: 'select',
    value: '',
    required: true,
    placeholder: 'Select Selling Unit ',
    options: [],
    databaseField: 'selling_unit_id'
  },
  {
    label: 'How many selling unit equal a purchasing unit',
    type: 'select',
    value: '',
    required: true,
    placeholder: 'Select Selling Capacity Unit ',
    options: [],
    databaseField: 'selling_unit_capacity_id'
  },
 
])

export const purchaseFormFields = ref([
  {
    label: 'Product Type',
    type: 'select',
    value: '',
    required: true,
    placeholder: 'Enter product type ID',
    databaseField: 'product_type_id'
  },
  {
    label: 'Supplier ID',
    type: 'text',
    value: '',
    required: false,
    placeholder: 'Enter supplier ID',
    databaseField: 'supplier_id'
  },
  {
    label: 'Price',
    type: 'number',
    value: '',
    required: true,
    placeholder: 'Enter price',
    databaseField: 'price'
  },
  {
    label: 'Selling Price',
    type: 'number',
    value: '',
    required: true,
    placeholder: 'Enter Selling Price',
    databaseField: 'selling_price'
  },
  //{ label: 'Currency', type: 'select', value: '', required: true, placeholder: 'Enter currency ID', databaseField: "currency_id" },
  //{ label: 'Discount', type: 'number', value: 0, required: false, placeholder: 'Enter discount', databaseField: "discount" },
  {
    label: 'Batch Number',
    type: 'text',
    value: '',
    required: false,
    placeholder: 'Enter batch number',
    databaseField: 'batch_no'
  },
  {
    label: 'Quantity',
    type: 'number',
    value: 0,
    required: true,
    placeholder: 'Enter quantity',
    databaseField: 'quantity'
  },
  //{ label: 'Product Identifier', type: 'text', value: '', required: false, placeholder: 'Enter product identifier', databaseField: "product_identifier" },
  {
    label: 'Expiry Date',
    type: 'date',
    value: null,
    required: false,
    placeholder: 'Select expired date',
    databaseField: 'expiry_date'
  }
  // { label: 'Organization ID', type: 'text', value: '', required: false, placeholder: 'Enter organization ID', databaseField: "organization_id" },
  // { label: 'Purchase By', type: 'text', value: '0', required: true, placeholder: 'Enter purchase by', databaseField: "purchase_by" },
  // { label: 'Status', type: 'number', value: 0, required: false, placeholder: 'Enter status', databaseField: "status" },
])

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
  {
    label: 'Cost Price',
    type: 'number',
    value: null,
    required: true,
    placeholder: 'Enter cost price',
    databaseField: 'cost_price'
  },
  // {
  //   label: 'Allow system to generate price',
  //   type: 'number',
  //   value: null,
  //   required: false,
  //   placeholder: 'Enter percentage increase',
  //   databaseField: 'auto_generated_selling_price',
  //   min: 0
  // },
  {
    label: 'Selling Price',
    type: 'number',
    value: null,
    required: false,
    placeholder: 'Enter selling price',
    databaseField: 'selling_price',
    min: 0
  },

  // {
  //   label: 'Currency Name',
  //   type: 'select',
  //   value: '',
  //   required: true,
  //   placeholder: 'Enter currency ID',
  //   databaseField: 'currency_id'
  // },
  // { label: 'Discount', type: 'number', value: 0, required: false, placeholder: 'Enter discount', databaseField: "discount" },
  {
    label: 'Status',
    type: 'select',
    value: '1',
    required: false,
    placeholder: 'Enter status',
    databaseField: 'status',
    options: [
      { value: '1', label: 'Active Price' },
      { value: '0', label: 'Inactive Price' }
    ]
  }
  //{ label: 'Organization ID', type: 'text', value: '', required: false, placeholder: 'Enter organization ID', databaseField: "organization_id" },
])

export const saleFormFields = ref([
  {
    label: 'Product Type',
    type: 'select',
    value: '',
    required: true,
    placeholder: 'Enter product type ID',
    databaseField: 'product_type_id'
  },
  {
    label: 'Selling Price',
    type: 'select',
    value: null,
    required: true,
    placeholder: 'Selling',
    databaseField: 'price_id'
  },
  {
    label: 'Price Sold At',
    type: 'number',
    value: null,
    required: true,
    placeholder: 'Enter price sold at',
    databaseField: 'price_sold_at'
  },
  {
    label: 'Quantity',
    type: 'number',
    value: null,
    required: true,
    placeholder: 'Enter quantity',
    databaseField: 'quantity'
  },
  {
    label: 'Total Price',
    type: 'number',
    value: null,
    required: true,
    placeholder: 'Total price',
    databaseField: 'total_price',
    readonly: true
  },

  {
    label: 'Customer',
    type: 'select',
    value: '',
    required: true,
    placeholder: 'Enter customer ID',
    databaseField: 'customer_id'
  },
  {
    label: 'Payment Method',
    type: 'select',
    value: 'Cash',
    required: true,
    placeholder: 'select payment',
    databaseField: 'payment_method',
    options: [
      { value: 'Cash', label: 'Cash' },
      { value: 'Pos', label: 'Pos' },
      { value: 'Bank Transfer', label: 'Bank Transfer' }
    ]
  }
  // { label: 'Customer Fullname', type: 'text', value: '', required: false, placeholder: 'Enter sales owner', databaseField: "sales_owner" },
  // { label: 'Customer Phone Number', type: 'text', value: '', required: false, placeholder: 'Enter created by', databaseField: "created_by" },
  // { label: 'Customer Address', type: 'text', value: '', required: false, placeholder: 'Enter updated by', databaseField: "updated_by" }
])

export const storeFormFields = ref([
  {
    label: 'Product Type ID',
    type: 'text',
    value: '',
    required: true,
    placeholder: 'Enter product type ID',
    databaseField: 'product_type_id'
  },
  {
    label: 'Price ID',
    type: 'text',
    value: '',
    required: true,
    placeholder: 'Enter price ID',
    databaseField: 'price_id'
  },
  {
    label: 'Store Owner',
    type: 'text',
    value: '',
    required: true,
    placeholder: 'Enter store owner',
    databaseField: 'store_owner'
  },
  {
    label: 'Quantity Available',
    type: 'number',
    value: 0,
    required: false,
    placeholder: 'Enter quantity available',
    databaseField: 'quantity_available'
  },
  {
    label: 'Store Type',
    type: 'select',
    value: 0,
    required: true,
    placeholder: 'Select store type',
    options: [
      { label: 'Supplier', value: 0 },
      { label: 'Company', value: 1 }
    ],
    databaseField: 'store_type'
  },
  {
    label: 'Status',
    type: 'number',
    value: 0,
    required: false,
    placeholder: 'Enter status',
    databaseField: 'status'
  },
  {
    label: 'Created By',
    type: 'text',
    value: '',
    required: false,
    placeholder: 'Enter created by',
    databaseField: 'created_by'
  },
  {
    label: 'Updated By',
    type: 'text',
    value: '',
    required: false,
    placeholder: 'Enter updated by',
    databaseField: 'updated_by'
  }
])

export const permissionFormFields = ref([
  {
    label: 'User Role',
    type: 'select',
    value: '',
    required: true,
    options: [],
    placeholder: 'Enter user role',
    databaseField: 'role_id'
  },
  {
    label: 'Select Page',
    type: 'select',
    value: '',
    required: true,
    options: [],
    placeholder: 'Enter Select Page',
    databaseField: 'page_id'
  },
  {
    label: 'View Access',
    type: 'select',
    value: 0,
    required: true,
    options: [
      { label: 'Remove access', value: 0 },
      { label: 'Grant access', value: 1 }
    ],
    placeholder: 'Enter price ID',
    databaseField: 'read'
  },
  {
    label: 'Add Access',
    type: 'select',
    value: 0,
    required: true,
    options: [
      { label: 'Remove access', value: 0 },
      { label: 'Grant access', value: 1 }
    ],
    placeholder: 'Enter store owner',
    databaseField: 'write'
  },
  {
    label: 'Edit Access',
    type: 'select',
    value: 0,
    required: false,
    options: [
      { label: 'Remove access', value: 0 },
      { label: 'Grant access', value: 1 }
    ],
    placeholder: 'Enter quantity available',
    databaseField: 'update'
  },
  {
    label: 'Delete Access',
    type: 'select',
    value: 0,
    required: true,
    placeholder: 'Select store type',
    options: [
      { label: 'Remove access', value: 0 },
      { label: 'Grant access', value: 1 }
    ],
    databaseField: 'delete'
  }
])

export const roleFormFields = ref([
  {
    label: 'Role name',
    type: 'text',
    value: '',
    required: true,
    placeholder: 'Enter role',
    databaseField: 'role_name'
  }
])

export const paymentFormFields = ref([
  {
    label: 'Payment Method',
    type: 'select',
    value: '',
    required: true,
    option: [],
    // placeholder: 'Ekc',
    databaseField: 'payment_method_id'
  },
  {
    label: 'Account Name',
    type: 'text',
    value: '',
    required: true,
    placeholder: 'Enter Account Name',
    databaseField: 'account_name'
  },
  {
    label: 'Account Number',
    type: 'num',
    value: '',
    required: true,
    placeholder: 'Enter Account Number',
    databaseField: 'account_number'
  },
  {
    label: 'Payment Identifier',
    type: 'text',
    value: '',
    required: true,
    placeholder: 'Enter Payment Identifier',
    databaseField: 'payment_identifier'
  }
])
export const payMethodFormFields = ref([
  {
    label: 'Payment Method',
    type: 'text',
    value: '',
    required: true,
    placeholder: 'Enter Payment Method',
    databaseField: 'payment_name'
  }
])

export const branchFormFields = ref([
  {
    label: 'Branch Name',
    type: 'text',
    value: '',
    required: true,
    placeholder: 'Enter first name',
    databaseField: 'name'
  },
  {
    label: 'Country',
    type: 'select',
    option: [],
    value: '',
    required: true,
    placeholder: 'Enter country',
    databaseField: 'country_id'
  },
  {
    label: 'State',
    type: 'select',
    option: [],
    required: true,
    placeholder: 'Enter State',
    databaseField: 'state_id'
  },
  {
    label: 'City',
    type: 'text',
    value: '',
    required: true,
    placeholder: 'Enter City',
    databaseField: 'city'
  },
  {
    label: 'Address',
    type: 'text',
    value: '',
    required: true,
    placeholder: 'Enter Address',
    databaseField: 'address'
  },
  {
    label: 'Postal Code',
    type: 'text',
    value: '',
    required: true,
    placeholder: 'Enter Postal Code',
    databaseField: 'postal_code'
  },
  {
    label: 'Contact Person',
    type: 'text',
    value: '',
    required: true,
    placeholder: 'Enter contact person name',
    databaseField: 'contact_person'
  },
  {
    label: 'Email',
    type: 'email',
    value: '',
    required: true,
    placeholder: 'Enter email',
    databaseField: 'email'
  },
  {
    label: 'Phone Number',
    type: 'num',
    value: '',
    required: true,
    placeholder: 'Enter Phone Number',
    databaseField: 'phone_number'
  }
])