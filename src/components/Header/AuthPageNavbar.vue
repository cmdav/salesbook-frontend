<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import GlobeIcon from "@/components/icons/GlobeIcon.vue";
// import CaretDown from "@/components/icons/CaretDown.vue";
const body = document.querySelector("body");
body.classList.remove("overflow-hidden");
const showMobile = ref(false);
const route = useRoute();
let dropDownItem = ref("Eng");
const toogleMobileMenu = () => {
  const body = document.querySelector("body");
  showMobile.value = !showMobile.value;
  if (showMobile.value) {
    body.classList.add("overflow-hidden");
  } else {
    body.classList.remove("overflow-hidden");
  }
};
</script>
<template>
  <div class="sticky top-0 z-30 bg-transparent">
    <div class="container">
      <header class="py-[24px]">
        <div
          class="lg:px-0 px-[0px] mx-auto flex items-center gap-[10px] justify-between font-bold"
        >
          <div class="flex items-center justify-between space-x-4 lg:space-x-6">
            <router-link to="/" class="text-[30px]">
Salesbook
              <!-- <img
                loading="lazy"
                src="@/assets/BrandLogos/logo.png"
                class="h-[39px] md:h-[49.421px] w-auto"
                alt="MySpurr logo"
              /> -->
            </router-link>
          </div>
        </div>
      </header>
    </div>
  </div>
</template>
