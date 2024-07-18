<template>
    <header class="h-screen bg-secondary-800/[40%]">
      <div class="logo lg:visible invisible">
        <router-link to="/supplier-dashboard">
          <img src="@/assets/iSalesbook-Option-02.png" class="h-[5rem]" alt=" logo" />
        </router-link>
      </div>
      <!-- The nav -->
      <!-- <div class="flex flex-col justify-between h-full w-[90%] !px-0">
        <nav class="nav !font-light">
          <template v-for="item in menuItems" :key="item.name">
            <router-link
              :to="item.route"
              class="p-[10px] flex justify-start hover:bg-brand/[50%] hover:text-white rounded-[5px]"
              :class="{
                'text-white bg-brand': route.name === item.route.substring(1),
                'text-brand': route.name !== item.route.substring(1),
              }"
            >
              <div
                :class="{
                  'text-white': route.name === item.route.substring(1),
                  'text-brand': route.name !== item.route.substring(1),
                }"
                class="mr-[20px] justify-center flex items-center rounded-[5px] h-[40px] w-[40px]"
              >
                <component :is="item.icon" />
              </div>
              <span class="place-self-center text-[16px] font-Satoshi500 leading-[20.23px]">
                {{ item.name }}
              </span>
            </router-link>
          </template>
        </nav>
      </div> -->
    </header>
  </template>
  
  <script setup>
  // import { useRoute } from "vue-router";
  // import { computed } from "vue";
  // import { useStore } from "@/stores/user";

  
  // const route = useRoute();
  // const store = useStore();
  // const permissions = computed(() => {
  //   return store.getUser.user.permission.permissions;
  // });
  
  //console.log(permissions.value)
  

  //console.log(menuItems.value)
  
  </script>
  
  
  <style lang="scss" scoped>
  header {
    position: sticky;
    top: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
    min-height: 100vh;
    height: 100vh;
    overflow-y: scroll;
    //   background-color: $color-white;
  
    &::-webkit-scrollbar {
      width: 0.4vw;
      cursor: pointer;
    }
  
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
  
    &::-webkit-scrollbar-thumb {
      // background-color: $color-primary;
      border-radius: 50px;
    }
  
    .logo {
      margin-bottom: 20px;
    }
  
    nav {
      width: 90%;
      // border-top: 1px solid $color-grey-100;
      padding-top: 20px;
      margin-bottom: 10px;
  
      .link-group {
        margin-top: 35px;
  
        h4 {
          font-size: 0.8rem;
          // color: $color-grey-300;
          padding-inline: 10px;
          text-transform: uppercase;
          font-weight: 700;
        }
      }
  
      .link {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        cursor: pointer;
        padding: 10px;
  
        &:hover {
          // background-color: rgba($color: $color-primary, $alpha: 0.1);
          border-radius: 5px;
        }
  
        &.router-link-exact-active {
          // .link__icon {
          //   // background-color: rgba($color: $color-primary, $alpha: 20);
          //   //   color: $color-grey-100;
  
          //   //i {
          //     // color: $color-grey-100;
          //   //}
          // }
  
          .link__text {
            font-weight: 300;
            //   color: $color-primary;
            // background-color: rgba($color: $color-primary, $alpha: 0.1);
          }
        }
  
        &__icon {
          width: 35px;
          height: 35px;
          border-radius: 10px;
          background-color: transparent;
          display: grid;
          place-items: center;
          margin-right: 20px;
  
          i {
            font-size: 1.1rem;
            //   color: $color-grey-400;
          }
        }
  
        &__text {
          font-size: 0.9rem;
          // color: $color-grey-400;
        }
      }
    }
  
    .cta {
      display: inline-block;
      padding: 10px 20px;
      // background-color: $color-primary;
      // color: $color-white;
      font-size: 0.75rem;
      border-radius: 5px;
      transition: 0.15s ease;
  
      // &:hover {
      //   //   background-color: darken($color: $color-primary, $amount: 10%);
      // }
    }
  }
  </style>
  