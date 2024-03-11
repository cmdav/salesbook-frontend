<template>
  <div v-for="(field, index) in localFields" :key="index" class="spacing">
    <label class="form-label mt-3">{{ field.label }}</label>
    <!-- Check if the field is required and add asterisk with red symbol if required -->
    <label v-if="field.required" class="text-danger">*</label>
    <template v-if="field.type === 'textarea'">
      <textarea
        class="form-control"
        v-model="field.value"
        :required="field.required"
        :placeholder="field.placeholder"
      ></textarea>
    </template>
    <!-- select field-->
    <template v-else-if="field.type === 'select'">
      
      <select
        class="form-control"
        v-model="field.value"
        :required="field.required"
        @change="handleCategoryChange(field.value, field.label)"
      >
        <!-- Option with asterisk if required -->
        <option v-for="(option, optionIndex) in field.options" 
                   :key="optionIndex" 
                   :value="option['value']"
                >
          {{ option['label'] }} 
        </option>
      </select>
      <span v-if="field.showLoading === true" class="text-danger"> {{ isLoadingMsg}}</span>
    </template>
    <!-- image field -->
    <template v-else-if="field.type === 'image'">
      <input
        type="file"
        class="form-control"
        @change="handleImageChange(index, $event)"
        :required="field.required"
        :placeholder="field.placeholder"
      />
    </template>
    <template v-else>
      <input
        :type="field.type"
        class="form-control"
        v-model="field.value"
        :required="field.required"
        :placeholder="field.placeholder"
      />
    </template>
  </div>
</template>

<script setup>
import { defineEmits, ref } from 'vue';

// Destructure fields from props
const { fields, isLoadingMsg, allError } = defineProps({
  fields: Array,
  allError:Object,
  isLoadingMsg: String
});
const emit = defineEmits(['fetchDataForSubCategory'])
console.log(allError)
const localFields = ref(fields);

const handleImageChange = (index, event) => {
  const file = event.target.files[0];
  localFields.value[index].value = file; 
};

// emit an event on change
const handleCategoryChange = (value, label) => {
  const selectedField = localFields.value.find(field => field.label === label);
  if (selectedField) {
    emit('fetchDataForSubCategory', value, label);
  }
};


</script>
