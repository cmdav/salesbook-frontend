<template>
  <div class="flex w-fit items-center gap-x-2">
    <!-- Displays the Back Button -->
    <button
      v-if="hasPrevPage || props.alwaysShowNextAndPrevious"
      :disabled="props.currentPage === 1"
      class="text-sm font-medium flex items-center justify-center gap-x-1 rounded px-3 py-2 text-brand ring-[1px] ring-brand disabled:cursor-not-allowed disabled:text-red-200 disabled:ring-red-200"
      @click="() => changeCurrentPage(props.currentPage - 1)"
    >
      <svg
        class="h-4 w-4 shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 256 256"
      >
        <path
          fill="currentColor"
          d="M165.66 202.34a8 8 0 0 1-11.32 11.32l-80-80a8 8 0 0 1 0-11.32l80-80a8 8 0 0 1 11.32 11.32L91.31 128Z"
        />
      </svg>
      <span class="inline-block">Prev</span>
    </button>

    <!-- Display Page Numbers -->
    <button
      v-for="number in totalPages"
      :key="number"
      :class="{ 'bg-brand text-white': number === props.currentPage, 'text-brand': number !== props.currentPage }"
      class="text-sm font-medium flex items-center justify-center rounded px-3 py-2 ring-[1px]"
      @click="() => changeCurrentPage(number)"
    >
      {{ number }}
    </button>

    <!-- Displays the Next Button -->
    <button
      v-if="hasNextPage || props.alwaysShowNextAndPrevious"
      :disabled="props.currentPage >= props.totalPages"
      class="text-sm font-medium flex items-center justify-center gap-x-1 rounded px-3 py-2 text-brand ring-[1px] ring-brand disabled:cursor-not-allowed disabled:text-red-200 disabled:ring-red-200"
      @click="() => changeCurrentPage(props.currentPage + 1)"
    >
      <span class="inline-block">Next</span>
      <svg
        class="h-4 w-4 shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 256 256"
      >
        <path
          fill="currentColor"
          d="m181.66 133.66l-80 80a8 8 0 0 1-11.32-11.32L164.69 128L90.34 53.66a8 8 0 0 1 11.32-11.32l80 80a8 8 0 0 1 0 11.32"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">

import { defineProps, defineEmits } from "vue";

const emit = defineEmits<{ (event: "changePage", page: number): void }>();

const props = defineProps<{
  currentPage?: number;
  totalPages?: number;
  alwaysShowNextAndPrevious?: boolean;
}>();

const changeCurrentPage = (page: number) => {
  if (page === props.currentPage || page < 1 || page > props.totalPages) return;
  emit("changePage", page);
};

const hasNextPage = props.currentPage < props.totalPages;
const hasPrevPage = props.currentPage > 1;
</script>
