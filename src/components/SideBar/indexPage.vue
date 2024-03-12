<template>
  <header class="h-screen bg-secondary-800/[40%]">
    <div class="logo lg:visible invisible">
      <router-link to="/">
        <!-- <h3 class="text-white text-[40px] my-4">iSalesBook</h3> -->
        <img src="@/assets/iSalesbook-Option-02.png" class="h-[5rem]" alt=" logo" />
      </router-link>
    </div>
    <!-- The nav -->
    <div class="flex flex-col justify-between h-full w-[90%] !px-0">
        <nav class="nav !font-light">
          <template v-for="item in menuItems" :key="item.name">
            <router-link
              v-if="!item.feature || feature.includes(item.feature)"
              :to="item.route"
              class="p-[10px] flex justify-start hover:bg-brand/[50%] hover:text-white rounded-[5px]"
              :class="{ 'text-white bg-brand': route.name === item.route.substring(1), 'text-brand': route.name !== item.route.substring(1) }"
            >
              <div
                :class="{ 'text-white': route.name === item.route.substring(1), 'text-brand': route.name !== item.route.substring(1) }"
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
     </div>

  </header>
</template>
<script setup>
import { computed } from "vue";
import { useStore } from "@/stores/user";
//import EmptyIcon from "@/components/icons/EmptyIcon.vue";
import homeIcon from "@/components/icons/homeIcon.vue";
import StoreIcon from "@/components/icons/StoreIcon.vue";
import ProductIcon from "@/components/icons/ProductIcon.vue";
import recordsIcon from "@/components/icons/recordsIcon.vue";
import reportsIcon from "@/components/icons/reportsIcon.vue";
import logoutIcon from "@/components/icons/logoutIcon.vue";
import SuppliersIcon from "@/components/icons/SuppliersIcon.vue";
import CustomerIcon from "@/components/icons/CustomerIcon.vue";
import { useRoute } from "vue-router";
const store = useStore();
const route = useRoute();
const feature = computed(() => {
  return Array.isArray(store.features) ? store.features : [];
});



const menuItems = [
  { name: 'Dashboard',                 route: '/dashboard',            icon: homeIcon,       feature: '' },
  //{ name: 'Store',                     route: '/',                     icon: StoreIcon,      feature: '' },
  // { name: 'Product',             route: '/product', icon: ProductIcon, feature: 'PRODUCT' },
  { name: 'Measurement',               route: '/measurement',          icon: ProductIcon,     feature: 'MEASUREMENT'},
  { name: 'Currency',                  route: '/currency',             icon: StoreIcon,     feature: 'CURRENCY'},
  { name: 'Product Category',          route: '/product-category',     icon: ProductIcon,     feature: 'PRODUCTCATEGORY'},
  { name: 'Product Sub Category',      route: '/product-sub-category', icon: StoreIcon,       feature: 'PRODUCTSUBCATEGORY'},
  { name: 'Products',                  route: '/products',             icon: recordsIcon,     feature: 'PRODUCTS' },
  //
  //{ name: 'Product Type',             route: '/product-type',          icon: ProductIcon,     feature: 'PRODUCTTYPE' },
  //{ name: 'Price',                    route: '/price',                 icon: StoreIcon,     feature: 'PRICE' }, 
  { name: 'Sale',                     route: '/sale',                  icon: ProductIcon,     feature: 'SALE' },
  { name: 'Purchase',                 route: '/purchase',              icon: ProductIcon,     feature: 'PURCHASE' },
  { name: 'Store',                    route: '/store',                 icon: ProductIcon,     feature: 'STORE' },


  { name: 'Supplier Product',       route: '/supplier-product',        icon: ProductIcon,      feature: 'SUPPLIER_PRODUCT' },
  { name: 'Customers',              route: '/customers',               icon: CustomerIcon,     feature: 'CUSTOMERS' },
  { name: 'Suppliers',              route: '/supplier',                icon: SuppliersIcon,    feature: 'SUPPLIER' },
  { name: 'Records',                route: '/',                        icon: recordsIcon,      feature: '' },
  { name: 'Reports',                route: '/',                       icon: reportsIcon,       feature: '' },
  { name: 'Log Out',                route: '/logout',                 icon: logoutIcon,        feature: '' }
];
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
