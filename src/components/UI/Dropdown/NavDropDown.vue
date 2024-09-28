<template>
  <div
    :id="id"
    class="absolute bg-white top-12 w-64 z-10 lg:-left-[11rem] -left-[12rem] rounded p-4 px-3 shadow-lg"
  >
    <!-- :class=" item.id === 4 || item.id === 2 ? 'border-b-[#000000] border-b-[0.5px]' : '' " -->

    <div class="w-full">
      <ul class="w-full">
        <li
          class="w-full py-4 hover:bg-secondary-800/[40%] hover:text-primary-600 text-black-100 px-[14px]"
          :class="item.id === 0 ? 'border-b-[#000000] border-b-[2.5px]' : ''"
          v-for="item in items"
          :key="item.name"
        >
          <router-link
            :to="{ name: item.name }"
            class="text-left w-full flex items-center capitalize gap-[22px] text-[16px] font-normal"
            ><component class="h-[24px] w-[24px]" :is="item.icon" />
            {{ item.context }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, defineProps, defineEmits } from "vue";
const emit = defineEmits(["closeDropdown", "clickedItem"]);

const onClickOutside = (element, callback) => {
  document.addEventListener("click", (e) => {
    let dropdown = document.getElementById(element); // Use element parameter directly
    if (dropdown && !dropdown.contains(e.target)) {
      callback();
    }
  });
};


const props = defineProps({
  showDropdown: Boolean,
  id: String,
  items: Array,
  class: String,
  link: Boolean,
});
//const dropdown = ref(null);

const showFeaturesDropdown = computed(() => props.showDropdown);

onMounted(() => {
  setTimeout(() => {
    onClickOutside("#feature-dropdown", () => {
      if (showFeaturesDropdown.value == true) {
        emit("closeDropdown", false);
      }
    });
  }, 600);
});
</script>
