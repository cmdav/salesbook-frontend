<template>
  <DashboardLayout pageTitle="Purchase page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <DataTableLayout @toggleModal="showPurchaseModal = !showPurchaseModal" :key="forceUpdate" endpoint="purchases"
        searchEndpoint="search-purchases" :additionalColumns="additionalColumns">
        <button class="btn-brand" @click="closeUploadModal">Upload</button>
      </DataTableLayout>
    </div>
    <SaleFormModal v-if="showPurchaseModal" :buttonLable="'submit'" :loading="pruchaseLoading"
      @close="closePruchaseModal" @submitForm="handleAddPurchase" title="Add Purchases">
      <div class="my-8 flex flex-col gap-2">
        <div class="flex flex-row justify-end items-end">
          <button @click="addPurchases" class="btn-brand !bg-brand/[20%] !text-black !px-3">
            Add purchases
          </button>
        </div>

        <div class="overflow-y-auto flex flex-col gap-2 max-h-[340px]">
          <div v-for="(question, index) in formState.purchases" :key="index" class="flex flex-col gap-2">
            <div class="bg-brand/[50%] rounded-full px-4 py-2">
              <h4 class="text-[#fff] text-[15px] font-bold">
                {{ index + 1 }}
              </h4>
            </div>

            <div class="flex flex-col gap-2">
              <div class="w-full">
                <label class="block text-sm font-medium text-gray-700"> Product </label>
                <select required v-model="formState.purchases[index].product_type_id" :label="`Product ${index + 1}`"
                  :name="`Product ${index + 1}`" :placeholder="`Add Product ${index + 1}`"
                  class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm">
                  <option v-for="product in allProductTypeName" :key="product.id" :value="product.id">
                    {{ product.product_type_name }}
                  </option>
                </select>
              </div>
              <div class="w-full">

                <div class="flex flex-row w-full gap-2">
                  <div class="w-full">
                    <label class="block text-sm font-medium text-gray-700"> Supplier </label>

                    <select required v-model="formState.purchases[index].supplier_id" :label="`Supplier ${index + 1}`"
                      :name="`Supplier ${index + 1}`" :placeholder="`Add Supplier ${index + 1}`"
                      class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm">
                      <option v-for="supplier in suppliersByProductId" :key="supplier.id" :value="supplier.id">
                        {{ supplier.supplier_detail }}
                      </option>
                    </select>
                  </div>
                  <div class="w-full">
                    <label class="block text-sm font-medium text-gray-700"> Cost Price </label>

                    <input required type="number" v-model="formState.purchases[index].cost_price"
                      @input="updateSellingPrice($event.target.value)"
                      class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
                      :readonly="isReadonly" />
                    <!-- Hidden input to hold the actual price_id for submission -->
                    <input type="hidden" v-model="formState.purchases[index].price_id" />
                  </div>

                  <div class="w-full">
                    <label class="block text-sm font-medium text-gray-700"> Selling Price </label>

                    <input required type="number" :value="formState.purchases[index].selling_price"
                      class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm" />
                  </div>

                </div>
                <div class="flex flex-row w-full gap-2">
                  <div class="w-full">
                    <label class="block text-sm font-medium text-gray-700"> Batch no </label>

                    <input :label="`batch no ${index + 1}`" :name="`batch no ${index + 1}`"
                      :placeholder="`batch no ${index + 1}`" v-model="formState.purchases[index].batch_no" type="text"
                      class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm" />
                  </div>
                  <div class="w-full">
                    <label class="block text-sm font-medium text-gray-700"> Quantity </label>

                    <input required :label="`quantity ${index + 1}`" :name="`quantity ${index + 1}`"
                      :placeholder="`quantity ${index + 1}`" v-model="formState.purchases[index].quantity" min="0"
                      type="number"
                      class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm" />
                  </div>
                </div>
                <div class="flex flex-row w-full gap-2">
                  <div class="w-full">
                    <label class="block text-sm font-medium text-gray-700">
                      Product Identifier
                    </label>

                    <input :label="`product identifier ${index + 1}`" :name="`product identifier ${index + 1}`"
                      :placeholder="`product identifier ${index + 1}`"
                      v-model="formState.purchases[index].product_identifier" type="text"
                      class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm" />
                  </div>
                  <div class="w-full">
                    <label class="block text-sm font-medium text-gray-700"> Expired Date </label>

                    <input :label="`expired date ${index + 1}`" :name="`expired date ${index + 1}`"
                      :placeholder="`expired date ${index + 1}`" v-model="formState.purchases[index].expiry_date"
                      type="date" :min="minDate"
                      class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SaleFormModal>

    <DeleteModal v-if="showDeleteModal" @close="closeDeleteModal" @updated="forceRefresh" :items="itemsId"
      :url="'purchases'" :modalTitle="modalTitle" />
    <EditModal v-if="showEditModal" @close="closeEditModal" :items="items"
      @fetchDataForSubCategory="fetchDataForSubCategory" :formField="purchaseFormFields" @updated="forceRefresh"
      :url="'purchases'" :minDate="true" />
    <UploadModal v-if="showUploadModal" @close="closeUploadModal" @updated="forceRefresh" :url="'/purchases'"
      type="Purchase" />
  </DashboardLayout>
</template>

<script setup>
import { onMounted, watch, ref, reactive } from 'vue'
import { purchaseFormFields } from '@/formfields/formFields'
import SaleFormModal from '@/components/UI/Modal/SalesFormModal.vue'
import { useSharedComponent } from '@/composable/useSharedComponent'
import { useProductStore } from '@/stores/products'
import apiService from '@/services/apiService'
import { catchAxiosError, catchAxiosSuccess } from '@/services/Response'

import { storeToRefs } from 'pinia'
const productsStore = useProductStore()
const pruchaseLoading = ref(false)
const showPurchaseModal = ref(false)
const getProductId = ref();
let errorMessage = ref()
let loading = ref(false)
const getShowSupplierPrice = ref()
const isReadonly = ref(true)
const systemValue = ref()

const { allProductTypeName, suppliersByProductId } = storeToRefs(productsStore)


console.log("allProductTypeName", allProductTypeName.value)
const minDate = ref(getMinDate())

function getMinDate() {
  const today = new Date()
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  // Return the minimum date in the format required by the input[type=date] field
  return minDate.toISOString().split('T')[0]
}


const formState = reactive({
  purchases: [
    {
      product_type_id: '',
      supplier_id: '',
      price_id: '',
      selling_price: '',
      cost_price: '',
      batch_no: '',
      quantity: '',
      product_identifier: '',
      expiry_date: ''
    }
  ]
})
const addPurchases = () => {
  const lastPurchases = formState.purchases[formState.purchases.length - 1]
  if (lastPurchases.product_type_id.trim() !== '') {
    formState.purchases.push({
      product_type_id: '',
      supplier_id: '',
      price_id: '',
      batch_no: '',
      quantity: '',
      product_identifier: '',
      expiry_date: ''
    })
  }
}
const resetForm = () => {
  formState.purchases = [
    {
      product_type_id: '',
      supplier_id: '',
      price_id: '',
      batch_no: '',
      quantity: '',
      product_identifier: '',
      expiry_date: ''
    }
  ]
}
const closePruchaseModal = () => {
  showPurchaseModal.value = !showPurchaseModal.value
  resetForm()
}
const handleAddPurchase = async () => {
  pruchaseLoading.value = true
  let payload = {
    purchases: formState.purchases
  }
  try {
    let res = await productsStore.handleAddPurchases(payload)
    pruchaseLoading.value = false
    return res
  } catch (error) {
    console.log(error)
  } finally {
    pruchaseLoading.value = false
    closePruchaseModal()
    forceRefresh()
  }
}

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
  useStore,
  computed,
  useUploadComposable
} = useSharedComponent('purchases')
const { showUploadModal, closeUploadModal } = useUploadComposable()

const url = '/all-price-by-product-type'
const emit = defineEmits('forceRefresh', 'handleFieldChanged')
const modalTitle = "Edit Purchase"

const { handleDelete, showDeleteModal, itemsId, closeDeleteModal } = useDeleteComposable()

const { fetchDataForSelect, fetchDataForSubCategory } = useSelectComposable(
  purchaseFormFields,
  url,
  'Product Type',
  'Price',
  'cost_price'
)
const { forceUpdate } = usePostComposable('/purchases', purchaseFormFields)

const { handleEdit, showEditModal, closeEditModal, items } = useEditComposable(emit)

const forceRefresh = () => {
  forceUpdate.value++
}

const checkDate = (fieldDatabase, value) => {
  if (fieldDatabase === 'expiry_date') {
    console.log(fieldDatabase, 'Field')
    const selectedDate = new Date(value)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time part to compare only date parts

    if (selectedDate < today) {
      alert('Invalid date: Date cannot be in the past.')
      // Find the field and reset its value
      const expiredDateField = purchaseFormFields.value.find(
        (field) => field.databaseField === 'expiry_date'
      )
      if (expiredDateField) {
        expiredDateField.value = '' // Clear the input field
      }
    }
  }
}

// Call this function whenever the related fields change.
watch(
  () => purchaseFormFields.value.find((field) => field.databaseField === 'expired_at')?.value,
  checkDate
)
// Fetch data for select options on component mount
onMounted(async () => {
  await fetchDataForSelect('Product Type', '/all-product-type-name', 'id', 'product_type_name')
  // await fetchDataForSelect(;)
})
onMounted(async () => {
  try {
    await productsStore.handleGetAllProductTypeName()
  } catch (error) {
    console.error
  }
})

const fetchSupplierByProductId = async (id) => {
  try {
    let res = await productsStore.handleGetSupplierByProductId(id)
    return res;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

// const fetchSuppliersPrice = async (productId, supplierId) => {
//   try {
//     let res = await productsStore.handleGetSuppliersPrice(productId, supplierId)
//     return res;
//   } catch (error) {
//     console.error("Error fetching products:", error);
//   }
// }

// const updatePriceId = (productTypeId, index) => {
//   const productInfo = allProductTypeName.value.find((product) => product.id === productTypeId)

//   // console.log("supplier by product, ID", suppliersByProductId.value)
//   console.log('Product info', productInfo)
//   if (productInfo) {
//     formState.purchases[index].price_id = productInfo.price_id
//     formState.purchases[index].cost_price = productInfo.cost_price
//   } else {
//     formState.purchases[index].price_id = ''
//     formState.purchases[index].cost_price = ''
//   }
// }

const updatePriceId = () => {

  console.log("Index", 0)
  console.log("price", getShowSupplierPrice.value)
  console.log("Supplier", suppliersByProductId.value.length)
  console.log("form purchase", formState.purchases)
  console.log("form with INDEX", formState.purchases[0].price_id)

  if (getShowSupplierPrice.value.cost_price !== 0) {
    console.log("Entered the if")
    formState.purchases[0].price_id = getShowSupplierPrice.value.id
    formState.purchases[0].cost_price = getShowSupplierPrice.value.cost_price
  }
  else if (getShowSupplierPrice.value.cost_price === 0) {
    isReadonly.value = false
    formState.purchases[0].price_id = getShowSupplierPrice.value.id
    formState.purchases[0].cost_price = ''
  }
  else {
    console.log("Entered the else")
    isReadonly.value = false
    formState.purchases[0].price_id = ''
    formState.purchases[0].cost_price = ''
  }
}

const fetchSystemSellingPrice = async () => {
  try {
    let response = await apiService.get('auto-generate-system-selling-price')
    catchAxiosSuccess(response)
    systemValue.value = response;
    return response
  }
  catch (error) {
    catchAxiosError(error)
    loading.value = false
    //  isError.value = true;
    if (error.response && error.response.data) {
      console.log(error.response.data.errors)
      console.log(error.response.data.message)
      errorMessage.value = error.response.data.message
    } else {
      console.error(error.message)
      errorMessage.value = error.message
    }
  }
}


const updateSellingPrice = (costPrice) => {
  console.log("System Selling Price", systemValue.value)
  console.log("Cost Price", costPrice)
  console.log("Selling Price", formState.purchases[0].selling_price)
  if (systemValue.value && !isReadonly.value) {
    let cost_price = parseFloat(costPrice)
    const auto_generated_selling_price = parseFloat(systemValue.value)
    let totalPriceField = Math.floor(cost_price + cost_price * (auto_generated_selling_price / 100))
    console.log("Total Price Field", totalPriceField)
    formState.purchases[0].selling_price = totalPriceField
  }
}

const updateSellingPriceWhenPriceSet = () => {
  console.log("System Selling Price", systemValue.value)
  console.log("Cost Price", formState.purchases[0].cost_price)
  console.log("Selling Price", formState.purchases[0].selling_price)
  if (systemValue.value && !isReadonly.value) {
    let cost_price = parseFloat(formState.purchases[0].cost_price)
    const auto_generated_selling_price = parseFloat(systemValue.value)
    let totalPriceField = Math.floor(cost_price + cost_price * (auto_generated_selling_price / 100))
    console.log("Total Price Field", totalPriceField)
    formState.purchases[0].selling_price = totalPriceField
  }
}



const fetchSuppliersPriceByProduct = async (getProductId, supplierId) => {
  try {
    loading.value = true
    let response = await apiService.get(`latest-supplier-price/${getProductId}/${supplierId}`)

    console.log("API Response", response)

    loading.value = false
    catchAxiosSuccess(response)
    getShowSupplierPrice.value = response
    updatePriceId()
    console.log("Response", response)
    return response
  } catch (error) {
    catchAxiosError(error)
    loading.value = false
    //  isError.value = true;
    if (error.response && error.response.data) {
      console.log(error.response.data.errors)
      console.log(error.response.data.message)
      errorMessage.value = error.response.data.message
    } else {
      console.error(error.message)
      errorMessage.value = error.message
    }
  }
}

watch(
  () => formState.purchases.map((p) => p.supplier_id),
  (supplierId) => {
    console.log("Supplier ID", supplierId)
    fetchSuppliersPriceByProduct(getProductId.value, supplierId[0])
    updateSellingPriceWhenPriceSet()
    console.log("Product, Supplier", getProductId.value, supplierId[0]);
  },
  { deep: true }
)

watch(
  () => formState.purchases.map((p) => p.product_type_id),
  (newProductTypeIds) => {
    newProductTypeIds.forEach((productTypeId) => {
      getProductId.value = productTypeId;
      if (suppliersByProductId.value.length === 0) {
        console.log("Entered")
        isReadonly.value = false
      }
      fetchSupplierByProductId(productTypeId)
    })
  },
  { deep: true }
)

onMounted(async () => {
  fetchSystemSellingPrice()
})

const store = useStore()
const permissions = computed(() => {
  return store.getUser.user.permission.permissions.find((p) => p.page_name === 'purchases')
})

const additionalColumns = computed(() => {
  const cols = []
  if (permissions.value?.update) {
    cols.push({ name: 'Edit', action: handleEdit })
  }
  if (permissions.value?.del) {
    cols.push({ name: 'Delete', action: handleDelete })
  }
  return cols
})
</script>
