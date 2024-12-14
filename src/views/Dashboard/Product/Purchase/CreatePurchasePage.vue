<template>
  <DashboardLayout pageTitle="Add Purchase">
    <div class="container">
      <div class="top-buttons">
        <router-link to="/purchase" class="button back-btn">Back</router-link>
        <div class="total-and-add">
          <span class="total-cost-price">Total Cost Price: &#8358; {{ totalCostPrice }}</span>
          <button type="button" @click="addPurchase" class="button add-purchase-button">
            Add Purchase
          </button>
        </div>
      </div>
      <div v-if="isLoading" class="loading-icon">Loading...</div>
      <form v-else @submit.prevent="handleSubmit">
        <div class="batch-container">
          <label for="batch_no">Batch No</label>
          <input class="batch_input" type="text" v-model="batchNo" readonly />
        </div>
        <div v-for="(purchase, index) in purchases" :key="index" class="purchase-form">
          <div v-if="index !== 0" class="top-buttons">
            <button type="button" @click="addPurchase" class="button add-purchase-button">
              Add Purchase
            </button>
          </div>
          <div class="form-row">
            <!-- Supplier Selection -->
            <div>
              <label for="supplier_id">Supplier <span class="required">*</span></label>
              <select v-model="purchase.supplier_id" @change="() => handleSupplierChange(index)">
                <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                  {{ supplier.supplier_detail }}
                </option>
              </select>
            </div>

            <!-- Product Selection -->
            <div>
              <label for="product_type_id">Product Name <span class="required">*</span></label>
              <div class="custom-select">
                <input
                  type="text"
                  :value="getSelectedProductName(purchase.product_type_id, index)"
                  @input="(e) => handleSearch(e, index)"
                  @focus="showDropdowns[index] = true"
                  placeholder="Search product type..."
                  class="search-input"
                />
                <div v-show="showDropdowns[index]" class="options-container">
                  <div
                    v-for="productType in filteredProductTypes(index)"
                    :key="productType.id"
                    class="option"
                    @click="selectProduct(productType, index)"
                  >
                    {{ productType.product_type_name }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Purchase Unit Selection -->
            <div v-if="purchase.product_type_id">
              <label for="purchase_unit">Purchase Unit <span class="required">*</span></label>
              <select 
                v-model="purchase.purchase_unit_id"
                @change="() => handlePurchaseUnitChange(index)"
              >
                <option value="">Select Purchase Unit</option>
                <option 
                  v-for="unit in getPurchaseUnits(purchase.product_type_id)"
                  :key="unit.purchase_unit_id"
                  :value="unit.purchase_unit_id"
                  :disabled="isDuplicatePurchase(purchase.supplier_id, purchase.product_type_id, unit.purchase_unit_id)"
                >
                  {{ unit.purchase_unit_name }}
                </option>
              </select>
            </div>

            <!-- Cost Price -->
            <div v-if="purchase.purchase_unit_id">
              <label for="cost_price">Cost Price <span class="required">*</span></label>
              <div class="tooltip-container">
                <input
                  type="number"
                  v-model="purchase.cost_price"
                  min="0"
                  @blur="validateCostPrice(index)"
                  @input="handleCostPriceChange(index)"
                  required
                />
              </div>
              <label class="priceView">&#8358; {{ purchase.cost_price ? parseFloat(purchase.cost_price).toLocaleString() : '0.00' }}</label>
            </div>

            <!-- Selling Price -->
            <div v-if="purchase.purchase_unit_id">
              <label for="selling_price">Selling Price <span class="required">*</span></label>
              <div class="tooltip-container">
                <input
                  type="number"
                  v-model="purchase.selling_price"
                  min="0"
                  @blur="validateSellingPrice(index)"
                  required
                />
              </div>
              <label class="priceView">&#8358; {{ purchase.selling_price ? parseFloat(purchase.selling_price).toLocaleString() : '0.00' }}</label>
            </div>

            <!-- Purchase Qty -->
            <div v-if="purchase.purchase_unit_id">
              <label for="capacity_qty">Purchase Qty <span class="required">*</span></label>
              <input
                type="number"
                min="1"
                v-model="purchase.capacity_qty"
                @blur="validatePurchaseQty(index)"
                required
              />
            </div>

            <!-- Expiry Date -->
            <div v-if="purchase.purchase_unit_id">
              <label for="expiry_date">Expiry Date</label>
              <input
                type="date"
                v-model="purchase.expiry_date"
                :min="minExpiryDate"
                class="expiry-date"
              />
            </div>

            <!-- Amount -->
            <div v-if="purchase.purchase_unit_id">
              <label for="amount">Amount</label>
              <span class="amountView">&#8358; {{ RowTotalCost(purchase).toLocaleString() }}</span>
            </div>

            <!-- Remove Button -->
            <div v-if="index !== 0" class="remove-button">
              <button
                type="button"
                @click="removePurchase(index)"
                class="button remove-purchase-button"
              >
                Remove
              </button>
            </div>
          </div>
          <hr class="separator" />
        </div>
        <button type="submit" class="button submit-button" :disabled="isSubmitting">
          {{ isSubmitting ? 'Please wait...' : 'Submit' }}
        </button>
      </form>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '@/services/apiService'
import { catchAxiosError, catchAxiosSuccess } from '@/services/Response'

const router = useRouter()

const suppliers = ref([])
const productTypes = ref([])
const batchNo = ref('')
const isLoading = ref(false)
const isSubmitting = ref(false)
const showDropdown = ref(false)

const searchQueries = ref({})
const showDropdowns = ref({})

const createEmptyPurchase = () => ({
  supplier_id: '',
  product_type_id: '',
  purchase_unit_id: '',
  batch_no: '',
  product_identifier: '1',
  expiry_date: '',
  cost_price: '',
  selling_price: '',
  capacity_qty: '',
  price_id: null
})

const purchases = reactive([createEmptyPurchase()])

const minExpiryDate = new Date().toISOString().split('T')[0]

const totalCostPrice = computed(() => {
  return purchases.reduce((acc, purchase) => acc + RowTotalCost(purchase), 0)
})

const fetchData = async () => {
  try {
    isLoading.value = true
    const [suppliersResponse, productTypesResponse, lastBatchNumberResponse] = await Promise.all([
      apiService.get('all-suppliers'),
      apiService.get('all-product-type?mode=actual'),
      apiService.get('last-batch-number')
    ])
console.log("here:", productTypesResponse)
    suppliers.value = suppliersResponse.data || []
    productTypes.value = productTypesResponse.data || []
    
    if (lastBatchNumberResponse.data) {
      batchNo.value = String(lastBatchNumberResponse.data).padStart(5, '0')
      purchases.forEach(purchase => purchase.batch_no = batchNo.value)
    }

    if (suppliers.value.length > 0) {
      purchases[0].supplier_id = suppliers.value[0].id
    }
  } catch (err) {
    catchAxiosError(err)
  } finally {
    isLoading.value = false
  }
}

/**
 * Calculate the cost price of a purchase unit based on the base unit cost price of the product.
 */
const calculateCostPrice = (index) => {
  const purchase = purchases[index];
  const product = productTypes.value.find(p => p.id === purchase.product_type_id);
  if (!product) return;

  const selectedUnit = product.product_measurement.find(unit => unit.purchase_unit_id === purchase.purchase_unit_id);
  if (!selectedUnit) return;

  const selectedUnitData = product.no_of_smallestUnit_in_each_unit[selectedUnit.purchase_unit_name];
  if (!selectedUnitData) return;

  const baseUnitCostPrice = purchase.cost_price / selectedUnitData.value;
  console.log(baseUnitCostPrice)
  // Update cost price only for the current purchase unit
  const unit = product.product_measurement.find(u => u.purchase_unit_id === purchase.purchase_unit_id);
  if (unit) {
    const unitData = product.no_of_smallestUnit_in_each_unit[unit.purchase_unit_name];
    if (unitData) {
      purchase.cost_price = baseUnitCostPrice * unitData.value;
    }
  }
};


const getSelectedProductName = (productTypeId, index) => {
  if (searchQueries.value[index]) return searchQueries.value[index]
  const product = productTypes.value.find(p => p.id === productTypeId)
  return product ? product.product_type_name : ''
}

const filteredProductTypes = (index) => {
  if (!searchQueries.value[index]) return productTypes.value
  return productTypes.value.filter(product => 
    product.product_type_name.toLowerCase().includes(searchQueries.value[index].toLowerCase())
  )
}

const handleSearch = (event, index) => {
  searchQueries.value[index] = event.target.value
  showDropdowns.value[index] = true
}

const getPurchaseUnits = (productTypeId) => {
  const product = productTypes.value.find(p => p.id === productTypeId)
  return product ? product.product_measurement : []
}

const selectProduct = (productType, index) => {
  purchases[index].product_type_id = productType.id
  purchases[index].purchase_unit_id = ''
  purchases[index].cost_price = ''
  purchases[index].selling_price = ''
  purchases[index].price_id = null
  showDropdowns.value[index] = false
  searchQueries.value[index] = ''
}

const handlePurchaseUnitChange = async (index) => {
  const purchase = purchases[index]
  purchase.cost_price = ''
  purchase.selling_price = ''
  purchase.price_id = null

  try {
    const response = await apiService.get(
      `latest-supplier-price/${purchase.product_type_id}/${purchase.supplier_id}/${purchase.purchase_unit_id}?mode=actual`
    )
    
    console.log('here:', response)
    if (response) {
      const latestPrice = response[0]
      console.log(latestPrice)
      purchase.cost_price = latestPrice.cost_price
      purchase.selling_price = latestPrice.selling_price
      purchase.price_id = latestPrice.price_id
      purchase.capacity_qty = latestPrice.quantity
    }
  } catch (err) {
    catchAxiosError(err)
  }
}

const handleCostPriceChange = (index) => {
  calculateCostPrice(index);
  const purchase = purchases[index]
  if (parseFloat(purchase.cost_price) < 1) {
    purchase.cost_price = '1'
  }
}

const isDuplicatePurchase = (supplierId, productTypeId, purchaseUnitId) => {
  return purchases.some(
    purchase =>
      purchase.supplier_id === supplierId &&
      purchase.product_type_id === productTypeId &&
      purchase.purchase_unit_id === purchaseUnitId
  )
}

const validateCostPrice = (index) => {
  const purchase = purchases[index]
  if (purchase.cost_price < 1) {
    alert('Cost price cannot be less than 1.')
    purchase.cost_price = 1
  }
}

const validateSellingPrice = (index) => {
  const purchase = purchases[index]
  if (purchase.selling_price < 1) {
    alert('Selling price cannot be less than 1.')
    purchase.selling_price = 1
    return
  }

  if (parseFloat(purchase.selling_price) <= parseFloat(purchase.cost_price)) {
    alert('Selling price must be higher than the cost price.')
    purchase.selling_price = (parseFloat(purchase.cost_price) + 1).toString()
  }
}

const validatePurchaseQty = (index) => {
  const purchase = purchases[index]
  if (purchase.capacity_qty < 1) {
    alert('Purchase quantity cannot be less than 1.')
    purchase.capacity_qty = 1
  }
}

const RowTotalCost = (purchase) => {
  return parseFloat(purchase.cost_price || 0) * parseFloat(purchase.capacity_qty || 1)
}

const addPurchase = () => {
  const lastPurchase = purchases[purchases.length - 1]
  if (
    lastPurchase.supplier_id &&
    lastPurchase.product_type_id &&
    lastPurchase.purchase_unit_id &&
    lastPurchase.cost_price &&
    lastPurchase.selling_price &&
    lastPurchase.capacity_qty
  ) {
    purchases.push(createEmptyPurchase())
  } else {
    catchAxiosError({
      message: 'Please fill out all required fields before adding a new purchase.'
    })
  }
}

const removePurchase = (index) => {
  purchases.splice(index, 1)
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true

    const formattedPurchases = purchases.map(purchase => ({
      supplier_id: purchase.supplier_id,
      product_type_id: purchase.product_type_id,
      batch_no: batchNo.value,
      product_identifier: purchase.product_identifier,
      expiry_date: purchase.expiry_date,
      purchase_unit_data: [
        {
          purchase_unit_id: purchase.purchase_unit_id,
          cost_price: parseFloat(purchase.cost_price),
          selling_price: parseFloat(purchase.selling_price),
          capacity_qty: parseInt(purchase.capacity_qty),
          ...(purchase.price_id && { price_id: purchase.price_id })
        }
      ]
    }))

    const res = await apiService.post('purchases', { purchases: formattedPurchases })
    router.push('/purchase')
    catchAxiosSuccess(res)
    return res
  } catch (err) {
    catchAxiosError(err)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchData()
  
  document.addEventListener('click', (e) => {
    const select = document.querySelector('.custom-select')
    if (select && !select.contains(e.target)) {
      showDropdown.value = false
    }
  })
})
</script>

<style scoped>
.custom-select {
  position: relative;
  width: 250px;
}

.search-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 0;
}

.options-container {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  z-index: 1000;
}

.option {
  padding: 8px;
  cursor: pointer;
}

.option:hover:not(.disabled) {
  background-color: #f5f5f5;
}

.option.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f0f0f0;
}

.container {
  padding: 20px;
}

.top-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.total-and-add {
  display: flex;
  align-items: center;
}

.total-cost-price {
  margin-right: 10px;
  font-size: 1.2em;
  font-weight: bold;
}

.batch-container {
  display: flex;
  width: 100%;
  align-items: center;
  margin-bottom: 20px;
}

.batch-container input {
  width: 50%;
  margin: 0 1em;
}

.purchase-form {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

label {
  display: block;
  margin-bottom: 5px;
}

.required {
  color: red;
}

input,
select {
  display: block;
  width: auto;
  margin-bottom: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.short-input {
  width: 150px;
}

input[type='number'] {
  width: 100px;
}

input[type='date'].expiry-date {
  width: 120px;
}

button {
  margin-right: 10px;
}

.add-purchase-button {
  background-color: #c35214;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
}

.add-purchase-button:disabled {
  background-color: #e86925;
  cursor: not-allowed;
  opacity: 0.65;
}

.add-purchase-button:hover:not(:disabled) {
  background-color: #e86925;
}

.submit-button {
  background-color: #c35214;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:disabled {
  background-color: #e86925;
  cursor: not-allowed;
  opacity: 0.65;
}

.submit-button:hover:not(:disabled) {
  background-color: #e86925;
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

.loading-icon {
  text-align: center;
  font-size: 18px;
  margin-bottom: 20px;
}

.separator {
  border: 0;
  border-top: 1px solid #ccc;
  margin-top: 20px;
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

.amountView {
  font-size: 1.2em;
  border: 2px solid rgb(195 82 20 / 50%);
  background-color: rgb(195 82 20 / 50%);
  color: #fff;
  padding: 0.8;
  border-radius: 4px;
}

.remove-purchase-button {
  background-color: #d9534f;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1.5rem;
}

.remove-purchase-button:hover {
  background-color: #c9302c;
}

.tooltip-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.tooltip {
  visibility: hidden;
  width: 200px;
  background-color: #000;
  color: #fff;
  text-align: center;
  padding: 5px;
  border-radius: 4px;
  position: absolute;
  z-index: 1;
  bottom: 100%;
  left: 50%;
  margin-left: -100px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip-container:hover .tooltip {
  visibility: visible;
  opacity: 1;
}
</style>