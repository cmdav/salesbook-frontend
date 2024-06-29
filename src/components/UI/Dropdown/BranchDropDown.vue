<template>
  <select v-model="selectedBranch" @change="filterByBranch" class="select-input">
    <option value="">All Branches</option>
    <option v-for="branch in branches" :key="branch.id" :value="branch.id">{{ branch.name }}</option>
  </select>
</template>

<script setup>
import { ref } from 'vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  branches: {
    type: Array,
    required: true,
  }
});
const emit = defineEmits(['change']);

const selectedBranch = ref('');

function filterByBranch() {
  emit('change', selectedBranch.value);
}
</script>

<style>
.select-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>