<template>
  <DashboardLayout pageTitle="Create Product Type">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <!-- Navigation buttons at the top -->
      <div class="top-buttons">
        <router-link to="/product-type" class="button back-btn">Back</router-link>
      </div>

      <!-- Form for adding a new sale -->
      <form @submit.prevent="">
        <!-- Section for selecting a customer if printing a receipt -->

        <div class="input-group w-[70%]">
          <label class="block text-sm font-medium text-gray-700">Product</label>
          <select v-model="formState.products" class="select-input">
            <option selected>Select Product...</option>
            <option v-for="name in allCustomersNames" :key="name.id" :value="name.id">
              {{ name.customer_detail }}
            </option>
          </select>
        </div>

        <div class="input-group w-[70%]">
          <label class="block text-sm font-medium text-gray-700">Product Type Name</label>
          <input required type="text" class="input" placeholder="Enter Product Type Name" />
        </div>
        <div class="input-group w-[70%]">
          <label class="block text-sm font-medium text-gray-700">Product Type Image</label>
          <input ref="fileInput" type="file" placeholder="Select Image" />
          <img
            :src="newImage"
            @click="triggerFileInput"
            class="mb-4 max-h-40 w-full rounded-md object-cover"
            alt="Current Image"
          />
        </div>
        <div class="input-group w-[70%]">
          <label class="block text-sm font-medium text-gray-700">Product Type Description</label>
          <input required type="text" placeholder="Enter Product Type Description" class="input" />
        </div>
        <div class="input-group w-[70%]">
          <label class="block text-sm font-medium text-gray-700">Barcode</label>
          <input type="password" class="input" />
        </div>
        <div class="input-group w-[70%]">
          <label class="block text-sm font-medium text-gray-700">Measurement</label>
          <select v-model="formState.customer_id" class="select-input">
            <option v-for="name in allCustomersNames" :key="name.id" :value="name.id">
              {{ name.customer_detail`` }}
            </option>
          </select>
        </div>
        <div class="input-group w-full">
          <label class="block text-sm font-medium text-gray-700">Container Type </label>
          <div class="flex">
            <div class="w-[70%]">
              <select v-model="formState.customer_id" class="select-input">
                <option v-for="name in allCustomersNames" :key="name.id" :value="name.id">
                  {{ name.customer_detail }}
                </option>
              </select>
            </div>
            <button type="button" class="button btn-brand ml-4" @click="addNewProduct">
              Add Container Type
            </button>
          </div>
        </div>
        <div class="input-group w-full">
          <label class="block text-sm font-medium text-gray-700">Container Type Capacity</label>
          <div class="flex">
            <div class="w-[70%]">
              <select v-model="formState.customer_id" class="select-input">
                <option v-for="name in allCustomersNames" :key="name.id" :value="name.id">
                  {{ name.customer_detail }}
                </option>
              </select>
            </div>
            <button type="button" class="button btn-brand ml-4" @click="addNewProduct">
              Add Container Capacity
            </button>
          </div>
        </div>

        <!-- Submit button for the form -->
        <button type="submit" class="button submit-button" :disabled="isSubmitting">
          {{ isSubmitting ? 'Submitting...' : 'Submit' }}
        </button>
      </form>
    </div>

    <!-- Modal for adding a new customer -->
    <CustomerFormModal v-if="showModal" @close="closeModal" />
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// import { useProductStore } from '@/stores/products'
// import { useCustomerstore } from '@/stores/customers'
import CustomerFormModal from '@/components/UI/Modal/CustomerFormModal.vue'
// import { storeToRefs } from 'pinia'

const router = useRouter()
const showModal = ref(false)
const isSubmitting = ref(false) // Reactive variable for submission state

const fileInput = ref(null);

const addNewCustomer = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  } else {
    console.error('File input is not correctly referenced.')
  }
}

const formState = reactive({
  product: '',
  product_type: '',
  product_type_img: '',
  product_type_desc: '',
  barcode: '',
  measurement: '',
  container_type_capacity: ''
})
//const salesLoading = ref(false);
// const printReceipt = ref('no')

// const vatOptions = reactive([
//   { id: 'yes', value: 'yes', label: 'Yes' },
//   { id: 'no', value: 'no', label: 'No' }
// ])

// const formState = reactive({
//   customer_id: '',
//   payment_method: 'cash',
//   products: [
//     {
//       product_type_id: '',
//       price_sold_at: null,
//       quantity: null,
//       batch_no: '',
//       available_qty: null,
//       amount: 0,
//       vat: 'no'
//     }
//   ]
// })

// // const addProducts = () => {
// //   const lastProduct = formState.products[formState.products.length - 1]
// //   if (
// //     lastProduct.product_type_id.trim() !== '' &&
// //     lastProduct.quantity > 0 &&
// //     lastProduct.price_sold_at > 0
// //   ) {
// //     formState.products.push({
// //       product_type_id: '',
// //       price_sold_at: 0,
// //       quantity: 0,
// //       batch_no: '',
// //       available_qty: 0,
// //       amount: 0,
// //       vat: 'no'
// //     })
// //   }
// // }

// // Function to remove a product from the formState.products array
// // const removeProduct = (index) => {
// //   if (index > 0) {
// //     formState.products.splice(index, 1)
// //   }
// // }

// // const resetForm = () => {
// //   formState.customer_id = ''
// //   formState.payment_method = ''
// //   formState.products = [
// //     {
// //       product_type_id: '',
// //       price_sold_at: null,
// //       batch_no: null,
// //       quantity: null
// //     }
// //   ]
// // }

// // const handleAddSales = async () => {
// //   isSubmitting.value = true // Set submitting state to true
// //   let products = formState.products
// //     .filter((product) => product.amount > 0)
// //     .map((product) => ({
// //       product_type_id: product.product_type_id,
// //       batch_no: product.batch_no,
// //       price_sold_at: parseInt(product.price_sold_at),
// //       quantity: parseInt(product.quantity),
// //       vat: parseInt(product.vat === 'yes' ? 1 : 0)
// //     }))

// //   let payload = {
// //     customer_id: formState.customer_id,
// //     payment_method: formState.payment_method,
// //     products: products
// //   }

// //   try {
// //     let res = await productsStore.handleAddSaless(payload)
// //     productsStore.handleGetProducts()
// //     router.push('/sale')
// //     return res
// //   } catch (error) {
// //     console.error('Failed to submit sale:', error)
// //   } finally {
// //     isSubmitting.value = false // Set submitting state to false
// //     resetForm()
// //   }
// // }

// // const totalPrice = computed(() => {
// //   return formState.products
// //     .reduce((sum, product, index) => {
// //       return sum + calculateAmount(index)
// //     }, 0)
// //     .toFixed(2)
// // })

// // const isBatchSelected = (productId, batchId, currentIndex) => {
// //   return formState.products.some((product, index) => {
// //     return (
// //       index !== currentIndex &&
// //       product.product_type_id === productId &&
// //       product.batch_id === batchId
// //     )
// //   })
// // }

// // const updatePriceId = (productTypeId, index) => {
// //   const productInfo = allProductTypeName.value.find((product) => product.id === productTypeId)
// //   if (productInfo) {
// //     formState.products[index].batches = productInfo.batches
// //     formState.products[index].vat = productInfo.vat === 'Yes' ? 'yes' : 'no'
// //   } else {
// //     formState.products[index].batches = []
// //     formState.products[index].vat = 'no'
// //   }
// // }

// const updateBatchDetails = (batchId, index) => {
//   const productInfo = allProductTypeName.value.find((p) => p.batches.some((b) => b.id === batchId))
//   const batchInfo = productInfo ? productInfo.batches.find((batch) => batch.id === batchId) : null

//   if (batchInfo && productInfo) {
//     formState.products[index].available_qty = batchInfo.batch_quantity_left
//     formState.products[index].price_sold_at = batchInfo.batch_selling_price
//     formState.products[index].batch_no = batchInfo.batch_no
//   } else {
//     formState.products[index].available_qty = ''
//     formState.products[index].price_sold_at = ''
//     formState.products[index].vat = 'no'
//     formState.products[index].amount = 0
//   }
// }

// const calculateAmount = (index) => {
//   const product = formState.products[index]
//   if (
//     !product ||
//     product.price_sold_at === null ||
//     product.quantity === null ||
//     product.price_sold_at === '' ||
//     product.quantity === ''
//   ) {
//     return 0
//   }

//   const baseAmount = parseFloat(product.price_sold_at) * parseInt(product.quantity)
//   let amount = baseAmount
//   if (product.vat === 'yes' && baseAmount > 0) {
//     const vatPercentage = 7.5
//     amount += baseAmount * (vatPercentage / 100)
//   }

//   product.amount = amount
//   return amount
// }

// watch(
//   () => formState.products.map((p) => p.product_type_id),
//   (newProductTypeIds, oldProductTypeIds) => {
//     newProductTypeIds.forEach((productTypeId, index) => {
//       if (productTypeId !== oldProductTypeIds[index]) {
//         updatePriceId(productTypeId, index)
//       }
//     })
//   },
//   { deep: true }
// )

// watch(
//   () => formState.products.map((p) => p.batch_id),
//   (newBatchIds, oldBatchIds) => {
//     newBatchIds.forEach((batchId, index) => {
//       if (batchId !== oldBatchIds[index]) {
//         updateBatchDetails(batchId, index)
//       }
//     })
//   },
//   { deep: true }
// )

// watch(
//   () => formState.products.map((product) => product.quantity),
//   (newQuantities, oldQuantities) => {
//     newQuantities.forEach((quantity, index) => {
//       if (quantity !== oldQuantities[index]) {
//         if (quantity > formState.products[index].available_qty) {
//           formState.products[index].quantity = formState.products[index].available_qty
//         }
//         calculateAmount(index)
//       }
//     })
//   },
//   { deep: true }
// )

// watch(
//   () => formState.products.map((product) => product.vat),
//   (newVats, oldVats) => {
//     formState.products.forEach((product, index) => {
//       if (newVats[index] !== oldVats[index]) {
//         calculateAmount(index)
//       }
//     })
//   },
//   { deep: true }
// )

// watch(
//   () => formState.products.map((product) => product.price_sold_at),
//   (newPrices, oldPrices) => {
//     formState.products.forEach((product, index) => {
//       if (newPrices[index] !== oldPrices[index]) {
//         calculateAmount(index)
//       }
//     })
//   },
//   { deep: true }
// )

// onMounted(async () => {
//   try {
//     await customersStore.handleAllCustomersName()
//     await productsStore.handleGetAllProductTypeName()
//   } catch (error) {
//     console.error
//   }
// })
</script>

<style scoped>
.container {
  padding: 20px;
}

.top-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.radio-label {
  margin-left: 10px;
}

.input-group {
  flex: 1;
  margin-right: 20px;
  height: 5em;
}

.select-input,
.input {
  display: block;
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.readonly-input {
  background-color: #f5f5f5;
}

button {
  margin-right: 10px;
}

.submit-button {
  background-color: #28a745;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:disabled {
  background-color: #218838;
  cursor: not-allowed;
  opacity: 0.65;
}

.btn-brand {
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-brand:disabled {
  background-color: #007bff;
  cursor: not-allowed;
  opacity: 0.65;
}

.btn-brand:hover:not(:disabled) {
  background-color: #0056b3;
}

.back-btn {
  background-color: #6c757d;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.back-btn:hover {
  background-color: #5a6268;
}

.product-group {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.priceView {
  font-size: 0.8em;
  border: 2px solid rgb(195 82 20 / 50%);
  background-color: rgb(195 82 20 / 50%);
  color: #fff;
  padding: 0.3%;
  border-radius: 4px;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1em;
}

.btn-danger:hover {
  background-color: #c82333;
}
</style>
