<template>
  <div class="border-[0.737px] border-[#254035AB] rounded-[5.897px] p-4 py-1">
    <label class="text-[#01272C] text-[12px] font-Satoshi400">Title</label>
    <GlobalInput
      v-model="formState.title"
      inputClasses="bg-transparent border-none !p-0"
      type="text"
      @input="filterJobTitleOptions"
      @keydown.down="highlightNextJobTitle"
      @keydown.up="highlightPreviousJobTitle"
      @keydown.enter="selectHighlightedJobTitleOption"
    />
    <ul
      v-if="showJobTitleDropdown"
      class="dropdown max-h-[20vh] overflow-y-auto pb-12 hide-scrollbar text-[12px] border-t font-Satoshi400 overflow-hidden"
    >
      <li
        v-for="(option, index) in filteredOptionsJobTitle"
        :key="option.id"
        @click="selectJobTitleOptions(option)"
        :class="{ highlighted: index === highlightedJobTitleIndex }"
        class="hover:bg-brand hover:text-white"
      >
        {{ option.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useSkillsStore } from "@/stores/skills";
import GlobalInput from "@/components/ui/Form/Input/GlobalInput.vue";

const formState = ref({
  title: "",
});
const skillsStore = useSkillsStore();
const { skills, jobTitle } = storeToRefs(skillsStore);

let skillTitles = ref([]);
let options = ref([]);

const showJobTitleDropdown = ref(false);
const highlightedJobTitleIndex = ref(-1);

const filteredOptionsJobTitle = computed(() => {
  const searchJobTitle = formState.value.title.toLowerCase();
  return skillTitles.value.filter((option) =>
    option.name.toLowerCase().includes(searchJobTitle)
  );
});
const selectJobTitleOptions = (option) => {
  formState.value.title = option.name;
  showJobTitleDropdown.value = false;
};

const filterJobTitleOptions = () => {
  showJobTitleDropdown.value = true;
  highlightedJobTitleIndex.value = -1;
};
const highlightNextJobTitle = () => {
  if (highlightedJobTitleIndex.value < filteredOptionsJobTitle.value.length - 1) {
    highlightedJobTitleIndex.value++;
  }
};
const highlightPreviousJobTitle = () => {
  if (highlightedJobTitleIndex.value > 0) {
    highlightedJobTitleIndex.value--;
  }
};
const selectHighlightedJobTitleOption = () => {
  if (highlightedJobTitleIndex.value >= 0) {
    selectJobTitleOptions(filteredOptionsJobTitle.value[highlightedJobTitleIndex.value]);
  }
};
onMounted(async () => {
  await skillsStore.getskills();
  await skillsStore.getJobTitles();
  options.value = skills.value.data;
  skillTitles.value = jobTitle.value.data;
});
</script>

<style></style>
