<script setup>
import BaseSidebar from "@/components/SideBar/indexPage.vue";
import { ref, onMounted } from "vue";
import "animate.css";
const closeNav = ref(false);
const closeBackdrop = ref(false);
const showDropdown = ref(false);
const showNotificationDropdown = ref(false);
import { useStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import NavDropDown from "@/components/UI/Dropdown/NavDropDown.vue";
import CaretDown from "@/components/icons/CaretDown.vue";
const store = useStore();
const { userProfileDetails } = storeToRefs(store);

onMounted(() => {
  store.handleUserProfile();
});

const toggle = () => {
  closeNav.value = !closeNav.value;

  if (closeNav.value) {
    closeBackdrop.value = !closeBackdrop.value;
  }

  if (!closeNav.value) {
    setTimeout(() => {
      closeBackdrop.value = !closeBackdrop.value;
    }, 1000);
  }
};
const toogleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};
const items = [
  {
    id: 0,
    name: "profile",
    context: "profile",
    // icon: UserIcon,
  },
  {
    id: 1,
    name: "logout",
    context: "Logout",
    // icon: SignOutIcon,
  },
];
defineProps({ pageTitle: String });
</script>

<template>
  <div class="bg-[#FDFDF6]">
    <div class="lg:flex">
      <div
        v-if="closeBackdrop"
        @click.self="toggle"
        class="lg:hidden z-20 menubg fixed top-0 left-0 w-full"
      >
        <div
          :class="{ 'animate__animated animate__slideOutLeft': !closeNav }"
          class="w-2/3 animate__animated animate__slideInLeft"
        >
          <BaseSidebar />
        </div>
      </div>
      <div class="hidden lg:block flex-shrink-0 md:w-[286px]">
        <BaseSidebar />
      </div>
      <div class="flex-grow pb-20" style="overflow: auto; padding: 0 2em">
        <!-- top-menu flex items-center justify-between py-3 px-4 lg:px-0 -->
        <!-- flex items-center gap-[3rem] justify-between px-4 min-[370px]:px-6 sticky top-0 pt-4 min-[370px]:pt-5 bg-white z-50  -->
        <nav
          class="flex bg-[#FDFDF6] items-center gap-[3rem] justify-between px-3 min-[370px]:px-6 sticky top-0 py-3 min-[370px]:pt-5 z-50"
        >
          <h4 class="text-[20px]">
            Welcome
            {{ userProfileDetails?.first_name ?? userProfileDetails?.company_name }},
          </h4>

          <div class="lg:hidden">
            <div class="logo">
              <router-link :to="{ name: 'dashboard' }"
                ><img class="lg:w-[80%] h-[40px]" alt=" logo"
              /></router-link>
            </div>
          </div>
          <div></div>
          <div class="links flex">
            <div class="flex justify-end gap-1 items-center ml-auto">
              <div class="profile__dropdown">
                <div
                  class="profile__dropdown-text relative items-center flex gap-2 lg:px-2 rounded-3xl"
                >
                  <div @click="toggle" class="lg:hidden cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-8 h-8"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                      />
                    </svg>
                  </div>
                  <img class="hidden" src="" alt="" />
                  <div
                    @click="toogleDropdown()"
                    role="button"
                    class="flex items-center gap-[4px]"
                  >
                    <div
                      class="h-10 w-10 flex justify-center items-center object-contain rounded-full bg-brand"
                    >
                      <img
                        v-if="userProfileDetails?.organization_logo !== null"
                        :src="userProfileDetails?.organization_logo"
                        class="h-10 w-10 object-cover rounded-full"
                      />
                      <svg
                        v-else
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 text-gray-100 h-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                    </div>
                    <CaretDown />
                  </div>

                  <NavDropDown
                    v-if="showDropdown"
                    :showDropdown="showDropdown"
                    :link="true"
                    :items="items"
                    @closeDropdown="toogleDropdown"
                  />
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div class="flex-grow pb-20">
          <h3 class="container mt-8 text-[19px] font-bold">{{ pageTitle }}</h3>
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menubg {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(7px);
}

.content-container {
  overflow-x: auto; // Enable horizontal scrolling
  white-space: nowrap; // Ensure the content extends in a single line
  // Remove vertical scrolling if you only want horizontal scrolling
  overflow-y: hidden; // Optional based on your design needs
  display: flex; // Keep it as flex to maintain current layout, adjust as necessary
  gap: 1rem; // Optional: adds gap between child elements if needed
}

.content-container ::-webkit-scrollbar {
  height: 10px; // Optional: change the height of the scrollbar to your preference
}

.content-container ::-webkit-scrollbar-thumb {
  background: #ccc; // Optional: change the color of the scrollbar thumb to your preference
  border-radius: 5px; // Optional: round the corners of the scrollbar thumb
}

.content-container ::-webkit-scrollbar-track {
  background: #efefef; // Optional: change the color of the scrollbar track to your preference
}
</style>
