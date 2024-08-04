<template>
  <DashboardLayout pageTitle="Create Product Type">
    <!-- <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
      <div class="top-buttons">
        <router-link to="/product-type" class="button back-btn">Back</router-link>
      </div>

      <form @submit.prevent="">

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

        <button type="submit" class="button submit-button" :disabled="isSubmitting">
          {{ isSubmitting ? 'Submitting...' : 'Submit' }}
        </button>
      </form>
    </div> -->

     <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
    <!-- Navigation buttons at the top -->
    <div class="top-buttons">
      <router-link to="/product-type" class="button back-btn">Back</router-link>
    </div>

    <!-- Form for adding a new sale -->
    <form @submit.prevent="handleSubmit">
      <div class="input-group w-[70%]">
        <label class="block text-sm font-medium text-gray-700">Product</label>
        <select v-model="formState.product" class="select-input" required>
          <option selected>Select Product...</option>
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.product_name }}
          </option>
        </select>
      </div>

      <div class="input-group w-[70%]">
        <label class="block text-sm font-medium text-gray-700">Product Type Name</label>
        <input v-model="formState.productTypeName" required type="text" class="input" placeholder="Enter Product Type Name" />
      </div>

      <div class="input-group w-[70%]">
        <label class="block text-sm font-medium text-gray-700">Product Type Image</label>
        <input ref="fileInput" type="file" @change="handleImageChange" />
        <img v-if="newImage" :src="newImage" class="mb-4 h-20 w-30 rounded-md object-cover" alt="Current Image" />
      </div>

      <div class="input-group w-[70%]">
        <label class="block text-sm font-medium text-gray-700">Product Type Description</label>
        <input v-model="formState.productTypeDescription" required type="text" placeholder="Enter Product Type Description" class="input" />
      </div>

      <div class="input-group w-[70%]">
        <label class="block text-sm font-medium text-gray-700">Barcode</label>
        <input v-model="formState.barcode" type="password" class="input" />
      </div>

      <div class="input-group w-[70%]">
        <label class="block text-sm font-medium text-gray-700">Measurement</label>
        <select v-model="formState.measurement" class="select-input" required>
          <option selected>Select Measurement...</option>
          <option v-for="measurement in measurements" :key="measurement.id" :value="measurement.id">
            {{ measurement.measurement_name }}
          </option>
        </select>
      </div>

      <!-- <div class="input-group w-[70%]">
        <label class="block text-sm font-medium text-gray-700">Measurement</label>
        <input v-model="formState.measurement" type="text" class="input" />
      </div> -->

      <div class="input-group w-full">
        <label class="block text-sm font-medium text-gray-700">Container Type</label>
        <div class="flex">
          <div class="w-[70%]">
            <select v-model="selectedContainerType" class="select-input" @change="fetchContainerTypeCapacities" required>
              <option selected>Select Container Type...</option>
              <option v-for="type in containerTypes" :key="type.id" :value="type.id">
                {{ type.container_type_name }}
              </option>
            </select>
          </div>
          <button type="button" class="button btn-brand ml-4" @click="addNewContainerType">
            Add Container Type
          </button>
        </div>
      </div>

      <div class="input-group w-full">
        <label class="block text-sm font-medium text-gray-700">Container Type Capacity</label>
        <div class="flex">
          <div class="w-[70%]">
            <select v-model="formState.containerTypeCapacity" class="select-input" required>
              <option selected>Select Container Capacity...</option>
              <option v-for="capacity in containerTypeCapacities" :key="capacity.id" :value="capacity.id">
                {{ capacity.container_capacity }}
              </option>
            </select>
          </div>
          <button type="button" class="button btn-brand ml-4" @click="addNewContainerTypeCapacity">
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
import { ref, reactive, onMounted } from 'vue';
import apiService from '@/services/apiService';
import { catchAxiosError, catchAxiosSuccess } from '@/services/Response'
// import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const fileInput = ref(null);
const newImage = ref(null);
const isSubmitting = ref(false);

const formState = reactive({
  product: '',
  productTypeName: '',
  productTypeImage: null,
  productTypeDescription: '',
  barcode: '',
  measurement: '',
  containerTypeCapacity: ''
});

const measurements = ref([]);
const products = ref([]);
console.log(products)
const containerTypes = ref([]);
const containerTypeCapacities = ref([]);
const selectedContainerType = ref(null);

// Fetch data on mounted
onMounted(async () => {
  await fetchMeasurements();
  await fetchProducts();
  await fetchContainerTypes();
});

const fetchMeasurements = async () => {
  try {
    const response = await apiService.get('/measurements');
    console.log(response)
    catchAxiosSuccess(response)
    measurements.value = response;
    console.log(measurements.value)
  } catch (error) {
    catchAxiosError(error)
    console.error('Error fetching products:', error);
  }
};
const fetchProducts = async () => {
  try {
    const response = await apiService.get('/all-products');
    console.log(response)
    products.value = response;
    console.log(products.value)
  } catch (error) {
    catchAxiosError(error)
    console.error('Error fetching products:', error);
  }
};
// console.log(products)
const fetchContainerTypes = async () => {
  try {
    const response = await apiService.get('/list-all-containers');
    console.log(response.data)
    containerTypes.value = response.data;
  } catch (error) {
    console.error('Error fetching container types:', error);
    catchAxiosError(error);
  }
};

const fetchContainerTypeCapacities = async () => {
  if (selectedContainerType.value) {
    try {
      const response = await apiService.get(`/container-with-capacities/${selectedContainerType.value}`);
      console.log(response.data.container_capacities)
      containerTypeCapacities.value = response.data.container_capacities;
    } catch (error) {
      console.error('Error fetching container type capacities:', error);
    }
  }
};

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    formState.productTypeImage = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      newImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const addNewContainerType = async () => {
  const containerTypeName = prompt('Enter new container type name:');
  if (containerTypeName) {
    try {
      const response = await apiService.post('/container-type', { name: containerTypeName });
      containerTypes.value.push(response.data);
    } catch (error) {
      console.error('Error adding new container type:', error);
    }
  }
};

const addNewContainerTypeCapacity = async () => {
  const containerCapacity = prompt('Enter new container type capacity:');
  if (selectedContainerType.value && containerCapacity) {
    try {
      const response = await apiService.post('/container-type-capacity', {
        containerTypeId: selectedContainerType.value,
        capacity: containerCapacity
      });
      containerTypeCapacities.value.push(response.data);
    } catch (error) {
      console.error('Error adding new container type capacity:', error);
    }
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;

  const formData = new FormData();
  formData.append('product_id', formState.product);
  formData.append('product_type_name', formState.productTypeName);
  formData.append('product_type_image', formState.productTypeImage);
  formData.append('product_type_description', formState.productTypeDescription);
  formData.append('barcode', formState.barcode);
  formData.append('measurement_id', formState.measurement);
  formData.append('container_type_capacity_id', formState.containerTypeCapacity);

  try {
    let res = await apiService.post('/product-types', formData);
    router.push('/product-type');
    
    catchAxiosSuccess(res);
    return res;
  } catch (error) {
    catchAxiosError(error)
    console.error('Error submitting form:', error);
  } finally {
    isSubmitting.value = false;
  }
};
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
  margin-bottom: 1.2em;
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
