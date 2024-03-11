<template>
  <header class="h-screen bg-secondary-800/[40%]">
    <div class="logo lg:visible invisible">
      <router-link to="/">
        <!-- <h3 class="text-white text-[40px] my-4">iSalesBook</h3> -->
        <img src="@/assets/iSalesbook-Option-02.png" class="h-[5rem]" alt=" logo" />
      </router-link>
    </div>
    <!-- The nav -->
    <div class="flex flex-col justify-between h-full w-[100%] !px-0">
      <nav class="nav !font-light">
        <router-link
          to="/dashboard"
          class="p-[10px] flex justify-start hover:bg-brand/[50%] hover:text-white rounded-[5px]"
          :class="route.name === 'dashboard' ? 'text-white bg-brand' : 'text-brand '"
        >
          <div
            :class="route.name === 'dashboard' ? 'text-white ' : 'text-brand '"
            class="mr-[10px] justify-center flex items-center rounded-[5px] h-[40px] w-[40px]"
          >
            <homeIcon />
          </div>
          <span class="place-self-center text-[16px] font-Satoshi500 leading-[20.23px]"
            >Dashboard</span
          >
        </router-link>
        <router-link
          to="/"
          class="p-[10px] flex justify-start hover:bg-brand/[50%] rounded-[5px]"
          :class="route.name === '' ? 'text-white bg-brand' : 'text-brand '"
        >
          <div
            :class="route.name === '' ? 'text-white ' : 'text-brand '"
            class="mr-[10px] justify-center flex items-center rounded-[5px] h-[40px] w-[40px]"
          >
            <StoreIcon />
          </div>
          <span class="place-self-center text-[16px] font-Satoshi500 leading-[20.23px]"
            >Store</span
          >
        </router-link>
        <router-link
          v-if="feature.includes('PRODUCT')"
          to="/product"
          class="p-[10px] flex justify-start hover:bg-brand/[50%] rounded-[5px]"
          :class="route.name === 'product' ? 'text-white bg-brand' : 'text-brand '"
        >
          <div
            :class="route.name === 'product' ? 'text-white ' : 'text-brand '"
            class="mr-[10px] justify-center flex items-center rounded-[5px] h-[40px] w-[40px]"
          >
            <ProductIcon />
          </div>
          <span class="place-self-center text-[16px] font-Satoshi500 leading-[20.23px]"
            >Product</span
          >
        </router-link>

        <router-link
          v-if="feature.includes('PRODUCTS')"
          to="/products"
          class="p-[10px] flex justify-start hover:bg-brand/[50%] rounded-[5px]"
          :class="route.name === 'products' ? 'text-white bg-brand' : 'text-brand '"
        >
          <div
            :class="route.name === 'products' ? 'text-white ' : 'text-brand '"
            class="mr-[10px] justify-center flex items-center rounded-[5px] h-[40px] w-[40px]"
          >
            <ProductIcon />
          </div>
          <span class="place-self-center text-[16px] font-Satoshi500 leading-[20.23px]"
            >Products</span
          >
        </router-link>

        <router-link
          v-if="feature.includes('MEASUREMENT')"
          to="/measurement"
          class="p-[10px] flex justify-start hover:bg-brand/[50%] rounded-[5px]"
          :class="route.name === 'measurement' ? 'text-white bg-brand' : 'text-brand '"
        >
          <div
            :class="route.name === 'measurement' ? 'text-white ' : 'text-brand '"
            class="mr-[10px] justify-center flex items-center rounded-[5px] h-[40px] w-[40px]"
          >
            <ProductIcon />
          </div>
          <span class="place-self-center text-[16px] font-Satoshi500 leading-[20.23px]"
            >Measurement</span
          >
        </router-link>

        <router-link
          v-if="feature.includes('PRODUCTCATEGORY')"
          to="/product-category"
          class="p-[10px] flex justify-start hover:bg-brand/[50%] rounded-[5px]"
          :class="
            route.name === 'ProductCategory' ? 'text-white bg-brand' : 'text-brand '
          "
        >
          <div
            :class="route.name === 'ProductCategory' ? 'text-white ' : 'text-brand '"
            class="mr-[10px] justify-center flex items-center rounded-[5px] h-[40px] w-[40px]"
          >
            <ProductIcon />
          </div>
          <span class="place-self-center text-[16px] font-Satoshi500 leading-[20.23px]"
            >Product Category</span
          >
        </router-link>

        <router-link
          v-if="feature.includes('PRODUCTSUBCATEGORY')"
          to="/product-sub-category"
          class="p-[10px] flex justify-start hover:bg-brand/[50%] rounded-[5px]"
          :class="
            route.name === 'ProductSubCategory' ? 'text-white bg-brand' : 'text-brand '
          "
        >
          <div
            :class="route.name === 'ProductSubCategory' ? 'text-white ' : 'text-brand '"
            class="mr-[10px] justify-center flex items-center rounded-[5px] h-[40px] w-[40px]"
          >
            <ProductIcon />
          </div>
          <span class="place-self-center text-[16px] font-Satoshi500 leading-[20.23px]"
            >Product Sub Category</span
          >
        </router-link>

        <router-link
          v-if="feature.includes('CURRENCY')"
          to="/Currency"
          class="p-[10px] flex justify-start hover:bg-brand/[50%] rounded-[5px]"
          :class="route.name === 'Currency' ? 'text-white bg-brand' : 'text-brand '"
        >
          <div
            :class="route.name === 'Currency' ? 'text-white ' : 'text-brand '"
            class="mr-[10px] justify-center flex items-center rounded-[5px] h-[40px] w-[40px]"
          >
            <ProductIcon />
          </div>
          <span class="place-self-center text-[16px] font-Satoshi500 leading-[20.23px]"
            >Currency</span
          >
        </router-link>

        <router-link
          v-if="feature.includes('SUPPLIER_PRODUCT')"
          to="/supplier-product"
          class="p-[10px] flex justify-start hover:bg-brand/[50%] rounded-[5px]"
          :class="route.name === 'product' ? 'text-white bg-brand' : 'text-brand '"
        >
          <div
            :class="route.name === 'product' ? 'text-white ' : 'text-brand '"
            class="mr-[10px] justify-center flex items-center rounded-[5px] h-[40px] w-[40px]"
          >
            <ProductIcon />
          </div>
          <span class="place-self-center text-[16px] font-Satoshi500 leading-[20.23px]"
            >Product</span
          >
        </router-link>

        <router-link
          v-if="feature.includes('CUSTOMERS')"
          to="/customers"
          class="p-[10px] flex justify-start hover:bg-brand/[50%] rounded-[5px]"
          :class="route.name === 'customers' ? 'text-white bg-brand' : 'text-brand '"
        >
          <div
            :class="route.name === 'customers' ? 'text-white ' : 'text-brand '"
            class="mr-[10px] justify-center flex items-center rounded-[5px] h-[40px] w-[40px]"
          >
            <CustomerIcon />
          </div>
          <span class="place-self-center text-[16px] font-Satoshi500 leading-[20.23px]"
            >Customers</span
          >
        </router-link>
        <router-link
          v-if="feature.includes('SUPPLIER')"
          to="/supplier"
          class="p-[10px] flex justify-start hover:bg-brand/[50%] rounded-[5px]"
          :class="route.name === 'supplier' ? 'text-white bg-brand' : 'text-brand '"
        >
          <div
            :class="route.name === 'supplier' ? 'text-white ' : 'text-brand '"
            class="mr-[10px] justify-center flex items-center rounded-[5px] h-[40px] w-[40px]"
          >
            <SuppliersIcon />
          </div>
          <span class="place-self-center text-[16px] font-Satoshi500 leading-[20.23px]"
            >Suppliers</span
          >
        </router-link>
        <router-link
          to="/organisation"
          class="p-[10px] flex justify-start hover:bg-brand/[50%] rounded-[5px]"
          :class="route.name === 'organisation' ? 'text-white bg-brand' : 'text-brand '"
        >
          <div
            :class="route.name === 'organisation' ? 'text-white ' : 'text-brand '"
            class="mr-[20px] justify-center flex items-center rounded-[5px] h-[40px] w-[40px]"
          >
            <reportsIcon />
          </div>
          <span class="place-self-center text-[16px] font-Satoshi500 leading-[20.23px]"
            >Organisation</span
          >
        </router-link>
        <router-link
          to="/"
          class="p-[10px] flex justify-start hover:bg-brand/[50%] rounded-[5px]"
          :class="route.name === '' ? 'text-white bg-brand' : 'text-brand '"
        >
          <div
            :class="route.name === '' ? 'text-white ' : 'text-brand '"
            class="mr-[10px] justify-center flex items-center rounded-[5px] h-[40px] w-[40px]"
          >
            <recordsIcon />
          </div>
          <span class="place-self-center text-[16px] font-Satoshi500 leading-[20.23px]"
            >Records</span
          >
        </router-link>
        <router-link
          to="/"
          class="p-[10px] flex justify-start hover:bg-brand/[50%] rounded-[5px]"
          :class="route.name === '' ? 'text-white bg-brand' : 'text-brand '"
        >
          <div
            :class="route.name === '' ? 'text-white ' : 'text-brand '"
            class="mr-[10px] justify-center flex items-center rounded-[5px] h-[40px] w-[40px]"
          >
            <reportsIcon />
          </div>
          <span class="place-self-center text-[16px] font-Satoshi500 leading-[20.23px]"
            >Reports</span
          >
        </router-link>
      </nav>

      <router-link
        to="/logout"
        class="p-[10px] flex justify-start hover:bg-brand/[50%] rounded-[5px]"
        :class="route.name === '' ? 'text-white bg-brand' : 'text-brand '"
      >
        <div
          :class="route.name === '' ? 'text-white ' : 'text-brand '"
          class="mr-[10px] justify-center flex items-center rounded-[5px] h-[40px] w-[40px]"
        >
          <logoutIcon />
        </div>
        <span class="place-self-center text-[16px] font-Satoshi500 leading-[20.23px]"
          >Log Out</span
        >
      </router-link>
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
import { storeToRefs } from "pinia";

const store = useStore();
const { features } = storeToRefs(store);

const route = useRoute();
const feature = computed(() => {
  return Array.isArray(features.value) ? features.value : [];
});
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
        .link__icon {
          // background-color: rgba($color: $color-primary, $alpha: 20);
          //   color: $color-grey-100;

          i {
            // color: $color-grey-100;
          }
        }

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

    &:hover {
      //   background-color: darken($color: $color-primary, $amount: 10%);
    }
  }
}
</style>
