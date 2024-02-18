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
  <div class="sticky top-0 z-30 bg-[#ffffff]">
    <div class="container">
      <header class="py-[24px]">
        <div
          class="lg:px-0 px-[0px] mx-auto flex items-center gap-[10px] justify-between font-bold"
        >
          <div class="flex items-center justify-between space-x-4 lg:space-x-6">
            <router-link to="/">
              <img
                loading="lazy"
                src="@/assets/BrandLogos/logo.png"
                class="h-[39px] md:h-[49.421px] w-auto"
                alt="MySpurr logo"
              />
            </router-link>
          </div>
          <!-- <div class="hidden lg:flex items-center"> -->
          <ul
            class="hidden lg:flex flex-row font-normal text-text-black-100 items-center !mb-0 gap-5"
          >
            <li>
              <router-link to="/" class="p-[10px] pr-0 flex justify-start rounded-[5px]">
                <span
                  :class="route.name === 'home' ? '!font-bold' : ''"
                  class="place-self-center text-[14px] leading-[21.6px]"
                >
                  Home
                </span>
              </router-link>
            </li>
            <li>
              <router-link
                to="/employers"
                class="p-[10px] pr-0 flex justify-start rounded-[5px]"
              >
                <span
                  :class="route.name === 'employers' ? '!font-bold' : ''"
                  class="place-self-center text-[14px] leading-[21.6px]"
                  >For Employers
                </span>
              </router-link>
            </li>
            <li>
              <router-link
                to="/talents"
                class="p-[10px] pr-0 flex justify-start rounded-[5px]"
              >
                <span
                  :class="route.name === 'talents' ? '!font-bold' : ''"
                  class="place-self-center text-[16px] leading-[21.6px]"
                  >For Talents
                </span>
              </router-link>
            </li>

            <li>
              <router-link
                to="/services"
                class="p-[10px] pr-0 flex justify-start rounded-[5px]"
              >
                <span
                  :class="route.name === 'services' ? '!font-bold' : ''"
                  class="place-self-center text-[14px] leading-[21.6px]"
                  >Services
                </span>
              </router-link>
            </li>
            <li>
              <router-link
                to="/about"
                :class="route.name === 'about' ? '!font-bold' : ''"
                class="p-[10px] pr-0 flex justify-start rounded-[5px]"
              >
                <span
                  :class="route.name === 'about' ? '!font-bold' : ''"
                  class="place-self-center text-[14px] leading-[21.6px]"
                  >About Us
                </span>
              </router-link>
            </li>
          </ul>
          <!-- </div> -->
          <div class="xl:flex hidden items-center gap-4">
            <div
              class="btn-light font-medium flex flex-row lg:gap-[8px] items-center !text-[14px]"
            >
              <GlobeIcon class="" />
              <a-select :bordered="false" v-model:value="dropDownItem">
                <a-select-option selected value="">ENG</a-select-option>
                <a-select-option value="">FR</a-select-option>
              </a-select>
            </div>
            <router-link to="/login" role="button" class="btn-brand font-semibold"
              >Get Started
            </router-link>
          </div>
          <div class="lg:hidden flex">
            <div
              class="btn-light font-medium flex flex-row lg:gap-[4px] items-center !text-[14px]"
            >
              <GlobeIcon class="lg:flex hidden" />
              <a-select :bordered="false" v-model:value="dropDownItem">
                <a-select-option selected value="">ENG</a-select-option>
                <a-select-option value="">FR</a-select-option>
              </a-select>
            </div>

            <button class="lg:hidden" @click="toogleMobileMenu">
              <svg
                v-if="!showMobile"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6 text-red-500"
                viewBox="0 0 32 32"
                fill="none"
              >
                <g clip-path="url(#clip0_2694_20501)">
                  <path
                    d="M20.2725 3.75C11.2862 3.75 4.02246 11.0137 4.02246 20C4.02246 28.9862 11.2862 36.25 20.2725 36.25C29.2587 36.25 36.5225 28.9862 36.5225 20C36.5225 11.0137 29.2587 3.75 20.2725 3.75ZM20.2725 33C13.1062 33 7.27246 27.1663 7.27246 20C7.27246 12.8337 13.1062 7 20.2725 7C27.4387 7 33.2725 12.8337 33.2725 20C33.2725 27.1663 27.4387 33 20.2725 33ZM26.1062 11.875L20.2725 17.7087L14.4387 11.875L12.1475 14.1663L17.9812 20L12.1475 25.8337L14.4387 28.125L20.2725 22.2913L26.1062 28.125L28.3975 25.8337L22.5637 20L28.3975 14.1663L26.1062 11.875Z"
                    fill="currentColor"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2694_20501">
                    <rect
                      width="39"
                      height="39"
                      fill="white"
                      transform="translate(0.772461 0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        </div>
      </header>
      <div
        v-if="showMobile"
        :class="{ 'animate__animated animate__slideOutLeft': !showMobile }"
        class="sticky z-20 bg-white animate__animated animate__slideInLeft lg:hidden w-full h-screen"
      >
        <div class="flex justify-start mb-8">
          <div class="flex-grow px-4">
            <ul class="flex flex-col font-medium gap-4">
              <li>
                <router-link
                  to="/"
                  class="p-[10px] px-0 flex justify-start rounded-[5px]"
                >
                  <span
                    :class="route.name === 'home' ? '!font-bold' : ''"
                    class="place-self-center text-[14px] leading-[21.6px]"
                  >
                    Home
                  </span>
                </router-link>
              </li>
              <li>
                <router-link
                  to="/employers"
                  class="p-[10px] px-0 flex justify-start rounded-[5px]"
                >
                  <span
                    :class="route.name === 'employers' ? '!font-bold' : ''"
                    class="place-self-center text-[14px] leading-[21.6px]"
                  >
                    For Employers
                  </span>
                </router-link>
              </li>
              <li>
                <router-link to="" class="p-[10px] px-0 flex justify-start rounded-[5px]">
                  <span class="place-self-center text-[14px] leading-[21.6px]">
                    For Talents
                  </span>
                </router-link>
              </li>
              <li>
                <router-link
                  to="/services"
                  class="p-[10px] px-0 flex justify-start rounded-[5px]"
                >
                  <span
                    :class="route.name === 'services' ? '!font-bold' : ''"
                    class="place-self-center text-[14px] leading-[21.6px]"
                  >
                    Services
                  </span>
                </router-link>
              </li>
              <li>
                <router-link
                  to="/about"
                  class="p-[10px] px-0 flex justify-start rounded-[5px]"
                >
                  <span
                    :class="route.name === 'about' ? 'font-bold' : ''"
                    class="place-self-center text-[14px] leading-[21.6px]"
                  >
                    About Us
                  </span>
                </router-link>
              </li>
            </ul>
            <div class="flex flex-col mt-12 items-center gap-4">
              <router-link to="/register" role="button" class="btn-brand font-semibold"
                >Get Started
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
