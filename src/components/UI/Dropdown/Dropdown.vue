<script setup>
import { computed, onMounted } from "vue";

const emit = defineEmits(["closeDropdown", "clickedItem"]);

const onClickOutside = (element, callback) => {
  document.addEventListener("click", (e) => {
    let dropdown = document.getElementById(props.id);
    if (!dropdown.contains(e.target)) callback();
  });
};

const props = defineProps(["showDropdown", "id", "items", "class", "link"]);
const id = props.id;
const customClass = props.class;

const showFeaturesDropdown = computed(() => props.showDropdown);

const clickedLink = (link) => {
  emit("clickedItem", link);
};

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
<template>
  <div
    :id="id"
    :class="customClass"
    class="absolute bg-white rounded overflow-hidden py-4 shadow-lg"
  >
    <div class="h-auto"><slot></slot></div>
  </div>
</template>
