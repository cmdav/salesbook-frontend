<template>
  <DashboardLayout pageTitle="Sales Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <div class="grid lg:grid-cols-3 grid-cols-1 gap-4">
        <div class="flex flex-row justify-between rounded-[8px] bg-brand p-4">
          <div>
            <!-- <div class="icon">
                  <img src="/assets/verifiedusers-5d08be57.svg" alt="" />
                </div> -->
            <div
              class="title font-Satoshi700 text-white py-4 text-[16px] leading-[21.6px]"
            >
              <span>Total Sales</span>
            </div>
            <div class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]">
              {{ productsStore?.sales?.total }}
            </div>
          </div>
        </div>
      </div>
      <DataTableLayout
        @toggleModal="showSalesModal = !showSalesModal"
        :key="forceUpdate"
        endpoint="sales"
        searchEndpoint="search-sales"
        :additionalColumns="additionalColumns"
      >
        <button class="btn-brand" @click="closeUploadModal">Upload</button>
      </DataTableLayout>
    </div>
    <SaleFormModal
      v-if="showSalesModal"
      :buttonLable="'submit'"
      :loading="salesLoading"
      @close="closeSalesModal"
      @submitForm="handleAddSales"
      title="Add Sale"
    >
   
  <div class="mt-4">
        <span class="font-medium text-gray-700">Print Receipt:</span>
        <label class="ml-4">
          <input type="radio" value="yes" v-model="printReceipt" />
          Yes
        </label>
        <label class="ml-2">
          <input type="radio" value="no" v-model="printReceipt" />
          No
        </label>
      </div>

      <!-- Conditionally render Customer select based on printReceipt -->
      <div v-if="printReceipt === 'yes'" class="mt-4 flex items-center">
        <div class="flex-grow">
          <select
            v-model="formState.customer_id"
            class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
          >
            <option v-for="name in allCustomersNames" :key="name.id" :value="name.id">
              {{ name.customer_detail }}
            </option>
          </select>

        </div>
        <button type="button" class="ml-4 btn-brand" @click="addNewCustomer">Add Customer</button>
      
      </div>
  <div class="mt-4">
    <label class="block text-sm font-medium text-gray-700">Payment method</label>
    <select
      required
      v-model="formState.payment_method"
      class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
    >
      <option
        v-for="option in [
          { value: 'cash', label: 'Cash' },
          { value: 'pos', label: 'Pos' },
          { value: 'bank-transfer', label: 'Bank Transfer' },
        ]"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
  <div class="my-8">
    <div class="flex justify-end">
      <span class="font-medium text-gray-700">Total Price: <span v-html="'&#8358;'"></span> {{ totalPrice }}</span>
      <button
       type="button"
        @click="addProducts"
        class="btn-brand !bg-brand/[20%] !text-black !px-3"
      >
        Add product
      </button>
    </div>
    <div
    v-for="(question, index) in formState.products"
    :key="index"
    class="flex justify-between items-end mt-4"
  >
    <div class="flex-1 mr-2">
      <label class="block text-sm font-medium text-gray-700">Product</label>
      <select
        v-model="formState.products[index].product_type_id"
        class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
      >
        <option
          v-for="name in allProductTypeName"
          :key="name.id"
          :value="name.id"
        >
          {{ name.product_type_name }}
        </option>
      </select>
    </div>
    <div class="flex-1 mr-2">
      <label class="block text-sm font-medium text-gray-700">Product Batch</label>
      <select
        v-model="formState.products[index].batch_id"
        @change="updateBatchDetails(formState.products[index].batch_id, index)"
        class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm">
        <option
          v-for="batch in formState.products[index].batches"
          :key="batch.id"
          :value="batch.id"
          :disabled="isBatchSelected(formState.products[index].product_type_id, batch.id, index)">
          {{ batch.batch_no }}
        </option>
      </select>

    </div>
    <div class="w-20 mr-2">
      <label class="block text-sm font-medium text-gray-700">Qty left</label>
      <input
        type="number"
        :value="formState.products[index].available_qty"
        class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
        readonly
      />
    </div>
    <div class="w-20 mr-2">
      <label class="block text-sm font-medium text-gray-700">Price</label>
      <input
        required
        v-model="formState.products[index].price_sold_at"
        type="number"
        readonly
        class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
      />
    </div>
    <div class="w-20 mr-2">
      <label class="block text-sm font-medium text-gray-700">Qty Sold</label>
      <input
        required
        v-model="formState.products[index].quantity"
        type="number"
        class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
      />
    </div>
    <div class="w-20 mr-2">
      <label class="block text-sm font-medium text-gray-700">VAT</label>
      <select
        v-model="formState.products[index].vat"
        class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
      >
        <option
          v-for="option in vatOptions"
          :key="option.id"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>

    <div class="flex-1">
      <label class="block text-sm font-medium text-gray-700">Amount</label>
      <span>
        {{ formState.products[index].amount ? formState.products[index].amount.toFixed(2) : '0.00' }}
      </span>
    </div>



    </div>
  </div>
    </SaleFormModal>
    <CustomerFormModal  v-if="showModal" @close="closeModal"/>

    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      @updated="forceRefresh"
      :items="itemsId"
      :url="'/sales'"
      :modalTitle="modalTitle"
    />
    <EditModal
      v-if="showEditModal"
      @close="closeEditModal"
      :items="items"
      :formField="saleFormFields"
      @updated="forceRefresh"
      :url="'sales'"
    />
    <UploadModal
      v-if="showUploadModal"
      @close="closeUploadModal"
      @updated="forceRefresh"
      :url="'/sales'"
      type="Sale"
    />
  </DashboardLayout>
</template>

<script setup>
import { onMounted, watch, ref, reactive } from "vue";
import jsPDF from 'jspdf';
import { saleFormFields } from "@/formfields/formFields";
import SaleFormModal from "@/components/UI/Modal/SalesFormModal.vue";
import { useSharedComponent } from "@/composable/useSharedComponent";
import CustomerFormModal from '@/components/UI/Modal/CustomerFormModal.vue';
import { useProductStore } from "@/stores/products";
import { useCustomerstore } from "@/stores/customers";
import { storeToRefs } from "pinia";
const productsStore = useProductStore();

const customersStore = useCustomerstore();
const { allCustomersNames } = storeToRefs(customersStore);
const { allProductTypeName } = storeToRefs(productsStore);

console.log(allProductTypeName.value);
//console.log(allCustomersNames.value);

const showModal = ref(false)
const addNewCustomer = () => {
  showModal.value  = true

}
const closeModal = () => {
  showModal.value  = false

}
const salesLoading = ref(false);
const showSalesModal = ref(false);
const printReceipt = ref('no');


const isBatchSelected = (productId, batchId, currentIndex) => {
  // Check if the batch has been selected in any other product entry except the current one
  return formState.products.some((product, index) => {
    return index !== currentIndex && 
           product.product_type_id === productId && 
           product.batch_id === batchId;
  });
};

const vatOptions = reactive([
  { id: 'yes', value: 'yes', label: 'Yes' },
  { id: 'no', value: 'no', label: 'No' }
]);


const formState = reactive({
  customer_id: "",
  payment_method: "cash",
  products: [
    {
      product_type_id: "",
      price_sold_at: null,
      quantity: null,
      batch_no: '',
      available_qty:null,
      amount: 0,
    },
  ],
});
const addProducts = () => {
  const lastProduct = formState.products[formState.products.length - 1];
  if (lastProduct.product_type_id.trim() !== "" && lastProduct.quantity > 0 && lastProduct.price_sold_at > 0) {
    formState.products.push({
      product_type_id: "",
      price_sold_at: 0,
      quantity: 0,
      batch_no: '',
      available_qty: 0,
      amount: 0,
      vat: 'no'
    });
  }
};

const resetForm = () => {
  formState.customer_id = "";
  formState.payment_method = "";
  formState.products = [
    {
      product_type_id: "",
      price_sold_at: null,
      batch_no: null,
      quantity: null,
    },
  ];
};
const closeSalesModal = () => {
  showSalesModal.value = !showSalesModal.value;
  resetForm();
};

const handleAddSales = async () => {
    salesLoading.value = true;
    let products = formState.products.filter(product => product.amount > 0).map(product => ({
        product_type_id: product.product_type_id,
        batch_no: product.batch_no,
        price_sold_at: parseInt(product.price_sold_at), 
        quantity: parseInt(product.quantity), 
        vat: parseInt(product.vat === 'yes' ? 1 : 0), 
    }));

    let payload = {
        customer_id: formState.customer_id,
        payment_method: formState.payment_method,
        products: products,
    };

    try {
        let res = await productsStore.handleAddSaless(payload);
        productsStore.handleGetProducts();
        salesLoading.value = false;
        return res;
    } catch (error) {
        console.error('Failed to submit sale:', error);
    } finally {
        salesLoading.value = false;
        closeSalesModal();
        forceRefresh();
    }
};


const {
  DataTableLayout,
  usePostComposable,
  useEditComposable,
  EditModal,
  useSelectComposable,
  DeleteModal,
  useDeleteComposable,
  defineEmits,
  UploadModal,
  useUploadComposable,
  useStore,
  computed,
} = useSharedComponent("sales");
const { showUploadModal, closeUploadModal } = useUploadComposable();
const emit = defineEmits("forceRefresh");
const url = "/latest-product-type-price";
//const priceSoldAt = ref();
const {
  fetchDataForSelect,

} = useSelectComposable(
  saleFormFields,
  url,
  "product_type_id",
  "price_id",
  "selling_price"
);
const { handleEdit, showEditModal, closeEditModal, items } = useEditComposable(emit);

const { forceUpdate } = usePostComposable(
  "/sales",
  saleFormFields
);
const {
  handleDelete,
  showDeleteModal,
  itemsId,
  closeDeleteModal,
} = useDeleteComposable();

const forceRefresh = () => {
  forceUpdate.value++;
};

const totalPrice = computed(() => {
  return formState.products.reduce((sum, product, index) => {
    return sum + calculateAmount(index); // Correctly add the amount
  }, 0).toFixed(2); // Convert to string with two decimal places
});


onMounted(async () => {
  await fetchDataForSelect(
    "Product Type",
    "/all-product-type-name",
    "id",
    "product_type_name"
  );
  await fetchDataForSelect("Customer", "/user-detail", "id", "customer_id");
  await productsStore.handleGetSales();
});


onMounted(async () => {
  try {
    await customersStore.handleAllCustomersName();
    await productsStore.handleGetAllProductTypeName();
  } catch (error) {
    console.error;
  }
});

// watch quantity change
watch(() => formState.products.map(product => product.quantity), (newQuantities, oldQuantities) => {
  newQuantities.forEach((quantity, index) => {
    if (quantity !== oldQuantities[index]) {
      if (quantity > formState.products[index].available_qty) {
        // Reset the quantity to the maximum available quantity or clear it
        formState.products[index].quantity = formState.products[index].available_qty;
      }
      calculateAmount(index);
    }
  });
}, { deep: true });

// watch vat for changes
watch(() => formState.products.map(product => product.vat), (newQuantities, oldQuantities) => {
  formState.products.forEach((product, index) => {
    if (newQuantities[index] !== oldQuantities[index]) {
      calculateAmount(index);
    }
  });
}, { deep: true });

// watch price sold at change
watch(() => formState.products.map(product => product.price_sold_at), (newQuantities, oldQuantities) => {
  formState.products.forEach((product, index) => {
    if (newQuantities[index] !== oldQuantities[index]) {
      calculateAmount(index);
    }
  });
}, { deep: true });

function calculateAmount(index) {
  const product = formState.products[index];
  if (!product || product.price_sold_at === null || product.quantity === null || product.price_sold_at === "" || product.quantity === "") {
    return 0;  
  }
  
  const baseAmount = parseFloat(product.price_sold_at) * parseInt(product.quantity);
  let amount = baseAmount;
  if (product.vat === 'yes' && baseAmount > 0) {
    const vatPercentage = 7.5;  
    amount += baseAmount * (vatPercentage / 100);
  }

  product.amount = amount;
  return amount;  
}

// Function to update product details based on the selected product type
const updatePriceId = (productTypeId, index) => {
  const productInfo = allProductTypeName.value.find(product => product.id === productTypeId);
  if (productInfo) {
    formState.products[index].batches = productInfo.batches; // Update the batches array
    formState.products[index].vat = productInfo.vat === "Yes" ? 'yes' : 'no'; // Set VAT based on the product info
  } else {
    formState.products[index].batches = []; // Clear batches if product is not found
    formState.products[index].vat = 'no'; // Default VAT to 'no'
  }
};

// Watcher for product type ID changes
watch(() => formState.products.map(p => p.product_type_id), (newProductTypeIds, oldProductTypeIds) => {
  newProductTypeIds.forEach((productTypeId, index) => {
    if (productTypeId !== oldProductTypeIds[index]) {
      updatePriceId(productTypeId, index);
    }
  });
}, { deep: true });

const updateBatchDetails = (batchId, index) => {
  const productInfo = allProductTypeName.value.find(p => p.batches.some(b => b.id === batchId));
  const batchInfo = productInfo ? productInfo.batches.find(batch => batch.id === batchId) : null;

  if (batchInfo && productInfo) {
    formState.products[index].available_qty = batchInfo.batch_quantity_left;
    formState.products[index].price_sold_at = batchInfo.batch_selling_price;
    formState.products[index].batch_no = batchInfo.batch_no;
  
  } else {
    formState.products[index].available_qty = "";
    formState.products[index].price_sold_at = "";
    formState.products[index].vat = 'no';
    formState.products[index].amount = 0;
  }
};

watch(() => formState.products.map(p => p.batch_id), (newBatchIds, oldBatchIds) => {
  newBatchIds.forEach((batchId, index) => {
    if (batchId !== oldBatchIds[index]) {
      updateBatchDetails(batchId, index);
    }
  });
}, { deep: true });



const store = useStore();
const permissions = computed(() => {
  return store.getUser.user.permission.permissions.find((p) => p.page_name === "sales");
});
console.log(permissions)

const additionalColumns = computed(() => {
  const cols = [];
  if (permissions.value?.update) {
    cols.push({ name: "Edit", action: handleEdit });
  }
  if (permissions.value?.del) {
    cols.push({ name: "Delete", action: handleDelete });
  }
  if (permissions.value?.read) {
    cols.push({ name: "View Receipt", action: (row) => handleReceipt(row.transaction_id) });
    // cols.push({ name: "View Receipt", action: (transaction_id) => showReceipt(transaction_id) });
  }
  return cols;
});

const handleReceipt = async (transactionId) => {
  console.log(transactionId)
  try {
        let receiptInfo = await productsStore.handleGetReceipt(transactionId);   
        console.log(receiptInfo);
      if (receiptInfo) {
        generateReceiptPDF(receiptInfo);
          return receiptInfo; 
      } else {
        console.error('Failed to fetch receipt data');
      }
    } catch (error) {
        console.error('Failed to generate receipt:', error);
    } 
};
// Define a method to generate PDF receipt
const generateReceiptPDF = (receiptData) => {
  // Create a new jsPDF instance
  const doc = new jsPDF();

  // Define styles
  const headerStyle = { fontSize: 24, fontStyle: 'bold', textColor: '#336699' };
  const sectionHeaderStyle = { fontSize: 16, fontStyle: 'bold', textColor: '#555555' };
  const itemStyle = { fontSize: 12, textColor: '#333333' };

  // Add header
  doc.setFont(headerStyle.fontStyle, 'normal');
  doc.setFontSize(headerStyle.fontSize);
  doc.setTextColor(headerStyle.textColor);
  doc.text('Transaction Receipt', 105, 20, null, null, 'center');

  // Add transaction details section
  doc.setFont(sectionHeaderStyle.fontStyle, 'normal');
  doc.setFontSize(sectionHeaderStyle.fontSize);
  doc.setTextColor(sectionHeaderStyle.textColor);
  doc.text(`Transaction ID: ${receiptData.transaction_details.transaction_id}`, 20, 40);
  doc.text(`Date: ${receiptData.transaction_details.created_at}`, 20, 50);
  doc.text(`Total Amount: ${receiptData.transaction_details.transaction_amount}`, 20, 60);

  // Add itemized list section
  let yPosition = 80; // Initial y position
  receiptData.items.forEach((item, index) => {
    // Add item details
    doc.setFont(itemStyle.fontStyle, 'normal');
    doc.setFontSize(itemStyle.fontSize);
    doc.setTextColor(itemStyle.textColor);
    doc.text(`Products N ${item.product_type_name}`, 20, yPosition);
    doc.text(`Price: ${item.amount}`, 20, yPosition + 10);
    doc.text(`Quantity: ${item.quantity}`, 20, yPosition + 20);
    doc.text(`VAT: ${item.vat === 1 ? 'Yes' : 'No'}`, 20, yPosition + 30);
    doc.text(`Pament Type: ${item.payment_method}`, 20, yPosition + 30);
    doc.text(`Amount: ${item.total_price}`, 20, yPosition + 40);

    // Increase y position for next item
    yPosition += 60; // Adjust as needed for spacing
  });

// Convert the PDF document to a data URI
const pdfDataUri = doc.output('datauristring');

// Open the PDF in a new browser tab for viewing
const viewerWindow = window.open();
viewerWindow.document.write(`<iframe width='100%' height='100%' src='${pdfDataUri}'></iframe>`);
  // // Save or download the PDF
  // doc.save('receipt.pdf');
};

</script>
