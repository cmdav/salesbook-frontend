<template>
  <!-- Display existing image-->

  <div class="relative w-full rounded-md object-contain" v-if="newImage">
    <img :src="newImage" @click="triggerFileInput" class="mb-4 max-h-40 w-full rounded-md object-cover"
      alt="Current Image" />
    <!-- <button
      type="button"
      @click="triggerFileInput"
      class="btn-change text-red-600 font-bold absolute border-red-700 border-[1px] flex items-center rounded-full p-2 py-1 bg-white top-1 right-2"
    >
    <UploadOutlined />
    </button> -->
    <input ref="fileInput" type="file" class="hidden" hidden @change="handleImageChange(0, $event)" />
  </div>

  <div v-for="(field, index) in localFields" :key="index" class="mb-4">
    <label :for="field.id" class="block text-sm font-medium text-gray-700" v-if="!(field.type === 'image' && newImage)">
      {{ field.label }}
      <span v-if="field.required" class="text-red-500">*</span>
    </label>

    <!-- Textarea field -->
    <template v-if="field.type === 'textarea'">
      <textarea :id="field.id"
        class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
        v-model="field.value" :required="field.required" :name="field.databaseField"
        :placeholder="field.placeholder"></textarea>
    </template>
    <!-- Select field -->
    <template v-else-if="field.type === 'select'">
      <!-- <div>{{ field }}</div> -->
      <select :id="field.id"
        class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
        v-model="field.value" :required="field.required" :name="field.databaseField" :readonly="field.readonly"
        @change="handleCategoryChange(field.value, field.databaseField)">
        <option v-for="(option, optionIndex) in field.options" :key="optionIndex" :value="option.value">
          {{ option['label'] }}
        </option>
      </select>
      <span v-if="field.showLoading === true" class="text-sm text-red-500">
        {{ isLoadingMsg }}</span>
    </template>
    <!-- search select -->
    <!-- <template v-else-if="field.type === 'select'">
      <div
        class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[0px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
      >
        <a-select
          :id="field.id"
          class="!w-full"
          :bordered="false"
          show-search
          v-model:value="field.value"
          @change="handleCategoryChange(selectInput, field.databaseField)"
          :required="field.required"
          :name="field.databaseField"
        >
          <a-select-option
            v-for="(option, optionIndex) in field.options"
            :key="optionIndex"
            :value="option.value"
            :selected="option.value === '0' ? true : false"
            class="w-full"
          >
            {{ option["label"] }}
          </a-select-option>
        </a-select>
      </div>
    </template> -->
    <!-- Image field -->
    <template v-else-if="field.type === 'image'">
      <input v-if="!newImage" :id="field.id" type="file" :name="field.databaseField"
        class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
        @change="handleImageChange(index, $event)" :required="field.required" :placeholder="field.placeholder" />
    </template>

    <template v-else-if="field.type === 'password'">
      <div class="relative">
        <input :id="field.id" :type="field.showPassword ? 'text' : 'password'"
          class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
          :class="{ 'readonly-background': field.readonly }" v-model="field.value" :required="field.required"
          :placeholder="field.placeholder" :name="field.databaseField" />
        <button type="button" class="absolute right-2 top-2" @click="togglePassword(field)">
          {{ field.showPassword ? 'Hide' : 'Show' }}
        </button>
      </div>
    </template>

    <!-- Number field -->
    <template v-else-if="field.type === 'number'">
      <input :id="field.id" type="number"
        class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
        :class="{ 'readonly-background': field.readonly }"
        @input="$emit('fieldChanged', field.databaseField, parseFloat(field.value).toLocaleString() || 0)"
        v-model.number="field.value" :name="field.databaseField" :required="field.required"
        :placeholder="field.placeholder" :min="field.min || 0" :readonly="field.readonly" />
      <label class="priceView"> &#8358; {{ field.value ? parseFloat(field.value).toLocaleString() : '0.00'}}</label>
    </template>

    <template v-else-if="field.type === 'num'">
      <input :id="field.id" type="number"
        class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
        :class="{ 'readonly-background': field.readonly }"
        @input="$emit('fieldChanged', field.databaseField, parseFloat(field.value).toLocaleString() || 0)"
        v-model.number="field.value" :name="field.databaseField" :required="field.required"
        :placeholder="field.placeholder" :min="field.min || 0" :readonly="field.readonly" />
      <!-- <label class="priceView"> &#8358; {{ field.value ? parseFloat(field.value).toLocaleString() : '0.00'}}</label> -->
    </template>

    <!-- Date field -->
    <template v-else-if="field.type === 'date'">
      <input :id="field.id" type="date"
        class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
        :class="{ 'readonly-background': field.readonly }"
        @input="$emit('fieldChanged', field.databaseField, field.value)" v-model="field.value"
        :required="field.required" :name="field.databaseField" :placeholder="field.placeholder"
        :min="constantMinDate" />
    </template>

    <template v-else>
      <input :id="field.id" :type="field.type"
        class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
        :class="{ 'readonly-background': field.readonly }" v-model="field.value" :required="field.required"
        :placeholder="field.placeholder" :name="field.databaseField" />
    </template>
  </div>
</template>

<script setup>
import { defineEmits, ref } from 'vue'
import { useProductStore } from '@/stores/products'
import { storeToRefs } from 'pinia'
//import { UploadOutlined } from '@ant-design/icons';

const productsStore = useProductStore()
// Destructure fields from props
const { fields, isLoadingMsg, allError, imagePath, hasMinDate } = defineProps({
  fields: Array,
  allError: {
    type: Object,
    default: () => ({})
  },
  imagePath: {
    type: String,
    default: ''
  },
  isLoadingMsg: String,
  hasMinDate: Boolean
})
const emit = defineEmits(['fetchDataForSubCategory', 'handleEditCategoryChange', 'fieldChanged'])
console.log(allError)
const localFields = ref(fields)
const { allProductTypeName } = storeToRefs(productsStore)
const fileInput = ref(null)
const newImage = ref(imagePath)
const minDate = ref(getMinDate())

// const selectInput = ref(null);
// emit an event on change

const defaultMinDate = ref('1900-01-01')
let constantMinDate = hasMinDate ? minDate : defaultMinDate

function getMinDate() {
  const today = new Date()
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return minDate.toISOString().split('T')[0]
}

const handleCategoryChange = (value, field_name) => {
  console.log('value', value)
  console.log(field_name)

  emit('fetchDataForSubCategory', value, field_name)
  // emit("fetchDataForSubCategory", value, field_name);
  emit('handleEditCategoryChange', value, field_name)
  // console.log(selectInput.value);

  allProductTypeName.value.find((itemId) => {
    console.log("Item ID",itemId)
    if (itemId.id == value) {
      localFields.value.find((field) => {
        if (field.label == 'Price') {
          field.value = itemId.cost_price

        }
        if (field.label == 'Selling Price') {
          field.value = itemId.selling_price
        }
      })
    }
  })
}

const handleImageChange = (index, event) => {
  index = 2
  const file = event.target.files[0]
  const maxSizeInBytes = 5 * 1024 * 1024 // 5MB max size (adjust as needed)

  if (file && file.size > maxSizeInBytes) {
    // Handle error for image too big
    alert('Error: Image size is too big. Please choose an image smaller than 5MB.')
    newImage.value = null
    localFields.value[index].value = null
    return
  }
  if (file) {
    // Preview the image
    const reader = new FileReader()
    reader.onload = (e) => {
      newImage.value = e.target.result
    }
    reader.readAsDataURL(file)
    //changes the value of the selected index
    localFields.value[index].value = file
  }
}

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  } else {
    console.error('File input is not correctly referenced.')
  }
}

const togglePassword = (field) => {
  field.showPassword = !field.showPassword;
}

</script>
<style scoped>
.readonly-background {
  background-color: #f0f0f0;
}
.priceView{
  font-size: 1em;
  border: 2px solid rgb(195 82 20 / 50%); 
  background-color: rgb(195 82 20 / 50%);
  color: #fff;
  padding: 0.3%;
  border-radius: 4px;
}
</style>
