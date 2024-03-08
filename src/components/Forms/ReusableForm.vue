<template>
  <div v-for="(field, index) in localFields" :key="index" class="spacing">
    <label class="form-label mt-3">{{ field.label }}</label>
    <template v-if="field.type === 'textarea'">
      <textarea
        class="form-control"
        v-model="field.value"
        :required="field.required"
        :placeholder="field.placeholder"
      ></textarea>
    </template>
    <template v-else-if="field.type === 'select'">
      <select
        class="form-control"
        v-model="field.value"
        :required="field.required"
        @change="handleCategoryChange(field.value, field.label)"
      >

        <option v-for="(option, optionIndex) in field.options" 
                   :key="optionIndex" 
                   :value="option['value']"
                >
          {{ option['label'] }}
        </option>
      </select>
    </template>
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
import { defineProps, ref} from 'vue';

// Destructure fields from props
const { fields } = defineProps({
  fields: Array
});
const emit = defineEmits(['fetchDataForSubCategory'])


const localFields = ref(fields);

const handleImageChange = (index, event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    localFields.value[index].value = reader.result; 
  };
  reader.readAsDataURL(file);
};

// emit an event on change
const handleCategoryChange = (value, label) => {
  emit('fetchDataForSubCategory', value, label);
};

</script>
