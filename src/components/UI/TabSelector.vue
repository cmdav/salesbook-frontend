<template>
  <div>
    <h1
      v-if="activetab === 'individual'"
      class="md:text-[22.225px] font-EBGaramond400 text-brand !my-4 text-center text-2xl"
    >
      <slot name="tab1title"></slot>
    </h1>
    <h1
      v-if="activetab === 'company'"
      class="md:text-[22.225px] font-EBGaramond400 text-brand !my-4 text-center text-2xl"
    >
      <slot name="tab2title"></slot>
    </h1>

    <div class="tabs flex flex-row">
      <a
        class="w-full !text-[10px] xl:!text-[14px]"
        @click="activateTab('individual')"
        :class="[activetab === 'individual' ? 'active' : '']"
      >
        <slot name="tab1"></slot>
      </a>
      <a
        class="w-full !text-[10px] xl:!text-[14px]"
        @click="activateTab('company')"
        :class="[activetab === 'company' ? 'active' : '']"
      >
        <slot name="tab2"></slot>
      </a>
    </div>
    <!-- tabs  view  start here -->
    <div class="pt-9">
      <div v-if="activetab === 'individual'" class="">
        <slot name="view1"></slot>
      </div>
      <div v-if="activetab === 'company'" class="">
        <slot name="view2"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const activetab = ref("individual");

// Set initial tab value based on the prop or local storage
onMounted(() => {
  const storedTab = localStorage.getItem("activeTab");
  if (storedTab) {
    activetab.value = storedTab;
  }
  return activetab.value;
});

function activateTab(tab) {
  activetab.value = tab;
  localStorage.setItem("activeTab", tab);
}
</script>
