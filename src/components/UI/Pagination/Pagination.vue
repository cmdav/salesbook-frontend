<script setup lang="ts">
import { computed } from "vue";

// Emit event to change page
const emit = defineEmits<{ (event: "changePage", page: number): void }>();

const props = withDefaults(
  defineProps<{
    currentPage?: number;
    pageSize?: number;
    totalPages?: number;
    alwaysShowNextAndPrevious: boolean; // show back and next buttons even if disabled
  }>(),
  {
    currentPage: 1,
    pageSize: 20,
    totalPages: 1,
    alwaysShowNextAndPrevious: true,
  }
);

const changeCurrentPage = (page: number) => {
  if (page === props.currentPage || page < 1 || page > props.totalPages) return;
  emit("changePage", page);
};

const hasNextPage = computed(() => props.currentPage < props.totalPages);
const hasPrevPage = computed(() => props.currentPage > 1);

const pagesToDisplay = computed(() => {
  let pages = [];
  for (let i = props.currentPage - 1; i <= props.currentPage + 1; i++) {
    if (i > 0 && i <= props.totalPages) {
      pages.push(i);
    }
  }
  return pages;
});
</script>

<template>
  <div class="flex w-fit items-center gap-x-2">
    <!-- Previous Button -->
    <button
      v-if="hasPrevPage || props.alwaysShowNextAndPrevious"
      :disabled="!hasPrevPage"
      class="text-sm font-medium flex items-center justify-center gap-x-1 rounded px-3 py-2 text-brand ring-[1px] ring-brand disabled:cursor-not-allowed disabled:text-red-200 disabled:ring-red-200"
      @click="changeCurrentPage(props.currentPage - 1)"
    >
      <svg
        class="h-4 w-4 shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
      >
        <path
          fill="currentColor"
          d="M165.66 202.34a8 8 0 0 1-11.32 11.32l-80-80a8 8 0 0 1 0-11.32l80-80a8 8 0 0 1 11.32 11.32L91.31 128Z"
        />
      </svg>
      <span>Prev</span>
    </button>

    <!-- Page Numbers -->
    <button
      v-for="number in pagesToDisplay"
      :key="number"
      :class="props.currentPage === number ? 'bg-brand text-white ring-brand' : 'text-brand ring-brand'"
      class="text-sm font-medium flex items-center justify-center rounded px-3 py-2 ring-[1px]"
      @click="changeCurrentPage(number)"
    >
      {{ number }}
    </button>

    <!-- Next Button -->
    <button
      v-if="hasNextPage || props.alwaysShowNextAndPrevious"
      :disabled="!hasNextPage"
      class="text-sm font-medium flex items-center justify-center gap-x-1 rounded px-3 py-2 text-brand ring-[1px] ring-brand disabled:cursor-not-allowed disabled:text-red-200 disabled:ring-red-200"
      @click="changeCurrentPage(props.currentPage + 1)"
    >
      <span>Next</span>
      <svg
        class="h-4 w-4 shrink-0"
        xmlns="http://www.w3.org/2000/svg"
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
