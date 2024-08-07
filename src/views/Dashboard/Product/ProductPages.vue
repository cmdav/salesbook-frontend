<template>
  <DashboardLayout pageTitle="Product Page">
    <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <!-- <div class="grid lg:grid-cols-3 grid-cols-1 gap-4">
        <div class="flex flex-row justify-between rounded-[8px] bg-brand p-4">
          <div>
            <div class="title font-Satoshi700 text-white py-4 text-[16px] leading-[21.6px]">
              <span>Total Products</span>
            </div>
            <div class="amount font-Satoshi700 text-white text-[32px] leading-[43.2px]">
              {{ productsStore?.products?.total }}
            </div>
          </div>
        </div>
      </div> -->

      <!-- Button to Open Modal -->
      <DataTableLayout
        :key="forceUpdate"
        endpoint="products"
        :pageName="'product-types'"
        searchEndpoint="search-products"
        @toggleModal="showModal = !showModal"
        toggleButtonLabel="Add Product"
        :excludedKeys="[
          'id',
          'product_id',
          'product_ids',
          'category_ids',
          'product_category',
          'sub_category_id',
          'product_type_description'
        ]"
        :clickableKeys="{
          view_price: navigateToProductTypePrice,
        }"
        :additionalColumns="additionalColumns"
      >
        <!-- <button @click="togglePriceModal" class="btn-brand !text-sm !px-1.5">Add Price</button> -->
        <!-- <div v-if="canUploadPermission">
        <button @click="toggleProductTypeModal" class="btn-brand !px-1.5 !text-[14px]">
          Add Product Type
        </button>
      </div> -->
        <div v-if="canUploadPermission">
        <button class="btn-brand !px-1.5 !text-[14px]" @click="closeUploadModal">
          Upload Product
        </button>
      </div>
      </DataTableLayout>
    </div>
    <!--Modal to add product-->
    <FormModal
      v-if="showModal"
      @close="closeModal"
      :formTitle="'Add Product'"
      :fields="formFields"
      @fetchDataForSubCategory="fetchDataForSubCategory"
      :isLoadingMsg="isOptionLoadingMsg"
      :url="'/products'"
    />
    <!-- Modal to add product type-->
    <!-- <FormModal
      v-if="showProductTypeModal"
      @close="toggleProductTypeModal('close')"
      @updated="forceRefresh"
      :formTitle="'Add Product Type'"
      :fields="productTypeFormFields"
      @fetchDataForSubCategory="fetchDataForSubCategory"
      :isLoadingMsg="isOptionLoadingMsg"
      :url="'/product-types'"
    /> -->
    <!-- Modal for Price Type-->
    <!-- <FormModal
      v-if="showPriceModal"
      @close="togglePriceModal('close')"
      :formTitle="'Add Price'"
      :fields="priceFormFields"
      @fieldChanged="updateSellingPrice"
      @fetchDataForSubCategory="fetchDataForSubCategory"
      :isLoadingMsg="isOptionLoadingMsg"
      :url="'/prices'"
    /> -->
    <ViewModal v-if="showViewModal" @close="closeViewModal" :modalTitle="modalTitle">
      <ViewModalDetail :products="products" />
    </ViewModal>

    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
      @updated="forceRefresh"
      :items="itemsId"
      :url="'/products'"
      :modalTitle="modalTitle"
    />
    <!-- Modal to edit  product types -->
    <EditModal
      v-if="showEditModal"
      @close="closeEditModal"
      @fetchDataForSubCategory="fetchDataForSubCategory"
      :items="items"
      @updated="forceRefresh"
      :formField="formFields"
      :url="'/products'"
    />
    <UploadModal
      v-if="showUploadModal"
      @close="closeUploadModal"
      :url="'/products'"
      type="Product"
      @updated="forceRefresh"
    />
  </DashboardLayout>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/products'
const productsStore = useProductStore()
console.log(productsStore)
import { formFields, priceFormFields, productTypeFormFields } from '@/formfields/formFields'
import { useSharedComponent } from '@/composable/useSharedComponent'

const {
  DataTableLayout,
  FormModal,
  usePostComposable,
  useEditComposable,
  EditModal,
  useSelectComposable,
  useDeleteComposable,
  ViewModal,
  ViewModalDetail,
  //defineEmits,
  DeleteModal,
  UploadModal,
  useUploadComposable,
  useStore
} = useSharedComponent('products')
const { showUploadModal, closeUploadModal } = useUploadComposable()

const modalTitle = 'View Product'
const router = useRouter()
const url = '/all-product-sub-categories-by-category-id'
const products = ref()
const showProductTypeModal = ref(false)
const showPriceModal = ref(false)

const { handleDelete, showDeleteModal, itemsId, closeDeleteModal } = useDeleteComposable()
//const emit = defineEmits(['forceRefresh'])
const { showModal, showViewModal, forceUpdate, closeModal, closeViewModal } = usePostComposable(
  '/products',
  formFields
)
const { handleEdit, showEditModal, closeEditModal, items } = useEditComposable()

const { fetchDataForSelect, fetchDataForSubCategory, isOptionLoadingMsg } = useSelectComposable(
  formFields,
  url,
  'category_id',
  'sub_category_id',
  'sub_category_name'
)

const navigateToProductTypePrice = (product) => {
  router.push({ name: 'price', params: { id: product.id } })
}

const toggleProductTypeModal = async (action = null) => {
  if (action == 'close') {
    productTypeFormFields.value.forEach((field) => {
      field.value = ''
    })
  }
  await fetchDataForSelect(
    'Product Name',
    '/all-products',
    'id',
    'product_name',
    productTypeFormFields.value
  )
  showProductTypeModal.value = !showProductTypeModal.value
}

const togglePriceModal = async (action = null) => {
  if (action == 'close') {
    priceFormFields.value.forEach((field) => {
      field.value = ''
    })
  }

  await fetchDataForSelect(
    'Product Type',
    '/all-product-type-name',
    'id',
    'product_type_name',
    priceFormFields.value
  )
  showPriceModal.value = !showPriceModal.value
}

const forceRefresh = () => {
  forceUpdate.value++
}

onMounted(async () => {
  await fetchDataForSelect('Measurement', '/measurements', 'id', 'measurement_name')
  await fetchDataForSelect('Category', '/product-categories', 'id', 'category_name')
  await fetchDataForSelect(
    'Product Name',
    '/all-products',
    'id',
    'product_name',
    productTypeFormFields.value
  )
  await fetchDataForSelect(
    'Currency Name',
    '/currencies',
    'id',
    'currency_name',
    priceFormFields.value
  )
  await productsStore.handleGetProductType()
})

const updateSellingPrice = (fieldDatabase, value) => {
  console.log(value)
  if (fieldDatabase === 'auto_generated_selling_price' || fieldDatabase === 'cost_price') {
    const costPrice =
      parseFloat(
        priceFormFields.value.find((field) => field.databaseField === 'cost_price')?.value
      ) || 0
    const auto_generated_selling_price =
      parseFloat(
        priceFormFields.value.find(
          (field) => field.databaseField === 'auto_generated_selling_price'
        )?.value
      ) || 0
    const totalPriceField = priceFormFields.value.find(
      (field) => field.databaseField === 'selling_price'
    )
    if (totalPriceField) {
      totalPriceField.value = Math.floor(
        costPrice + costPrice * (auto_generated_selling_price / 100)
      )
    }
  }
}

watch(
  () =>
    priceFormFields.value.find((field) => field.databaseField === 'auto_generated_selling_price')
      ?.value,
  updateSellingPrice
)
watch(
  () => priceFormFields.value.find((field) => field.databaseField === 'cost_price')?.value,
  updateSellingPrice
)

const dynamicFormFields = computed(() => {
  if (items.value && items.value.product_name) {
    if (items.value.product_name == items.value.product_type_name) {
      return formFields
    }
  }
  return productTypeFormFields
})

const dynamicUrl = computed(() => {
  if (items.value && items.value.product_name) {
    
      return `/products/${items.value.product_ids}`
    }
  })

const store = useStore()
const permissions = computed(() => {
  return store.getUser.user.permission.permissions.find((p) => p.page_name === 'products')
})

const additionalColumns = computed(() => {
  const cols = [];
  if (permissions.value?.update == 1 ) {
   
    cols.push({ name: 'Edit', action: handleEdit });
  }
  if (permissions.value?.del  == 1) {
    
    cols.push({ name: 'Delete', action: handleDelete });
  }
 
  return cols;
});

//check upload permission
const canUploadPermission = computed(() => {

return permissions.value?.write == 1;
});
</script>
