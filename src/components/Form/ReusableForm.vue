<template>
  <div v-for="(field, index) in localFields" :key="index" class="mb-4">
    <label :for="field.id" class="block text-sm font-medium text-gray-700">
      {{ field.label }}
      <span v-if="field.required" class="text-red-500">*</span>
    </label>
     <!-- Textarea field -->
    <template v-if="field.type === 'textarea'">
      <textarea
        :id="field.id"
        class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
        v-model="field.value"
        :required="field.required"
        :name ="field.databaseField"
        :placeholder="field.placeholder"
      ></textarea>
    </template>
     <!-- Select field -->
    <template v-else-if="field.type === 'select'">
      <select
        :id="field.id"
        class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
        v-model="field.value"
        :required="field.required"
        :name ="field.databaseField"
        @change="handleCategoryChange(field.value, field.databaseField)"
      >
        <option
          v-for="(option, optionIndex) in field.options"
          :key="optionIndex"
          :value="option.value"
        >
          {{ option["label"] }}
        </option>
      </select>
      <span v-if="field.showLoading === true" class="text-sm text-red-500">
        {{ isLoadingMsg }}</span
      >
    </template>
     <!-- Image field -->
    <template v-else-if="field.type === 'image'">
      <input
        :id="field.id"
        type="file"
        :name ="field.databaseField"
        class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
        @change="handleImageChange(index, $event)"
        :required="field.required"
        :placeholder="field.placeholder"
      />
    </template>

      <!-- Number field -->
      <template v-else-if="field.type === 'number'">
      <input :id="field.id"
        type="number"
        class="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        v-model.number="field.value"
        :name ="field.databaseField"
        :required="field.required"
        :placeholder="field.placeholder"
        :min="field.min || 0"  
      />
    </template>

    <!-- Date field -->
    <template v-else-if="field.type === 'date'">
      <input :id="field.id"
        type="date"
        class="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        v-model="field.value"
        :required="field.required"
        :name ="field.databaseField"
        :placeholder="field.placeholder"
      />
    </template>

    <template v-else>
      <input
        :id="field.id"
        :type="field.type"
        class="w-full font-light font-Satoshi400 border-neutral-900 text-[14px] outline-none !p-[14px] border-[1px] opacity-[0.8029] rounded-[4px] text-sm"
        v-model="field.value"
        :required="field.required"
        :placeholder="field.placeholder"
        :name ="field.databaseField"
      />
    </template>
  </div>
</template>

<script setup>
import { defineEmits, ref } from "vue";

// Destructure fields from props
const { fields, isLoadingMsg, allError } = defineProps({
  fields: Array,
  allError: Object,
  isLoadingMsg: String,
});
const emit = defineEmits(["fetchDataForSubCategory"]);
console.log(allError);
const localFields = ref(fields);

const handleImageChange = (index, event) => {
  const file = event.target.files[0];
  localFields.value[index].value = file;
};

// emit an event on change
const handleCategoryChange = (value, field_name) => {
  // pass the  selected value and field name
  const selectedField = localFields.value.find((field) => field.databaseField === field_name);
  if (selectedField) {
    
    emit('fetchDataForSubCategory', value, field_name, selectedField);
  }
};
</script>
