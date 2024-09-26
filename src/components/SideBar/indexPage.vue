<template>
  <header class="h-screen bg-secondary-800/[40%]"> 
    <div class="logo lg:visible invisible">
      <img src="@/assets/iSalesbook-Option-02.png" class="h-[5rem]" alt=" logo" />
    </div>
    <!-- The nav -->
    <div class="flex flex-col justify-between h-full w-[90%] !px-0">
      <nav class="nav !font-light">
        
        <template v-for="item in menuItems" :key="item.name">
          <div v-if="item.children">
            <!-- Dropdown for products -->
            <div class="relative group">
              <div class="p-[10px] flex justify-start text-brand hover:bg-brand/[50%] hover:text-white rounded-[5px]">
                <div class="mr-[20px] justify-center flex items-center rounded-[5px] h-[40px] w-[40px]">
                  <component :is="item.icon" />
                </div>
                <span class="place-self-center text-[16px] font-Satoshi500 leading-[20.23px]">
                  {{ item.name }}
                </span>
              </div>
              <!-- Dropdown content -->
              <div class="absolute left-0 w-full bg-white shadow-lg rounded hidden group-hover:block">
                <div v-for="child in item.children" :key="child.name" class="p-[10px] flex hover:bg-brand/[50%]">
                  <router-link :to="child.route" class="w-full">
                    <div class="flex justify-start">
                    <component :is="child.icon" class="mr-[20px]"/>
                    <span class="text-brand">{{ child.name }}</span>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          <router-link
            v-else
            :to="item.route"
            class="p-[10px] flex justify-start hover:bg-brand/[50%] hover:text-white rounded-[5px]"
            :class="{
              'text-white bg-brand': route.name === item.route.substring(1),
              'text-brand': route.name !== item.route.substring(1)
            }"
          >
            <div
              :class="{
                'text-white': route.name === item.route.substring(1),
                'text-brand': route.name !== item.route.substring(1)
              }"
              class="mr-[20px] justify-center flex items-center rounded-[5px] h-[40px] w-[40px]"
            >
              <component :is="item.icon" />
            </div>
            <span class="place-self-center text-[16px] font-Satoshi500 leading-[20.23px]">
              {{ item.name }}
            </span>
          </router-link>
          <!-- <router-link
            :to="item.route"
            class="p-[10px] flex justify-start hover:bg-brand/[50%] hover:text-white rounded-[5px]"
            :class="{
              'text-white bg-brand': route.name === item.route.substring(1),
              'text-brand': route.name !== item.route.substring(1)
            }"
          >
            <div
              :class="{
                'text-white': route.name === item.route.substring(1),
                'text-brand': route.name !== item.route.substring(1)
              }"
              class="mr-[20px] justify-center flex items-center rounded-[5px] h-[40px] w-[40px]"
            >
              <component :is="item.icon" />
            </div>
            <span class="place-self-center text-[16px] font-Satoshi500 leading-[20.23px]">
              {{ item.name }}
            </span>
          </router-link> -->
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useStore } from '@/stores/user'
import homeIcon from '@/components/icons/homeIcon.vue'
// import StoreIcon from '@/components/icons/StoreIcon.vue'
import ProductIcon from '@/components/icons/ProductIcon.vue'
import ProductsIcon from '@/components/icons/productsIcon.vue'
import recordsIcon from '@/components/icons/recordsIcon.vue'
import reportsIcon from '@/components/icons/reportsIcon.vue'
import logoutIcon from '@/components/icons/logoutIcon.vue'
import SuppliersIcon from '@/components/icons/SuppliersIcon.vue'
import CustomerIcon from '@/components/icons/CustomerIcon.vue'
import SettingsIcon from '@/components/icons/SettingsIcon.vue'
import CategoryIcon from '@/components/icons/CategoryIcon.vue'
import MeasurementIcon from '@/components/icons/MeasurementIcon.vue'
import FireIcon from '@/components/icons/FireIcon.vue'
import SalesIcon from '@/components/icons/SalesIcon.vue'
import PurchaseIcon from '@/components/icons/PurchaseIcon.vue'
import SubscriptionIcon from '@/components/icons/subscriptionIcon.vue'
// import SideBarIcon from '@/components/icons/SideBarIcon.vue'

const route = useRoute()
const store = useStore()
const permissions = computed(() => {
  return store.getUser.user.permission.permissions
})



//console.log(permissions.value)

const menuItems = computed(() => {
  const allItems = [
    { name: 'Dashboard', route: '/dashboard', icon: homeIcon, backendKey: 'dashboards' },
    // { name: "Organisation", route: "/organisation", icon: StoreIcon , backendKey:"organizations"},
    // {
    //   name: 'Welcome',
    //   route: '/welcome',
    //   icon: MeasurementIcon,
    //   backendKey: 'welcomescreen'
    // },
    // {
    //   name: 'Measurement',
    //   route: '/measurement',
    //   icon: MeasurementIcon,
    //   backendKey: 'measurements'
    // },
    { name: 'Currency', route: '/currency', icon: FireIcon, backendKey: 'currencies' },
    {
      name: 'Products',
      icon: ProductsIcon,
      backendKey: 'products',
      children: [
        {
      name: 'Measurement',
      route: '/measurement',
      icon: MeasurementIcon,
      backendKey: 'measurements'
    },
        {
          name: 'Product Category',
          route: '/product-category',
          icon: CategoryIcon,
          backendKey: 'product-categories'
        },
        {
          name: 'Product Sub Category',
          route: '/product-sub-category',
          icon: CategoryIcon,
          backendKey: 'product-sub-categories'
        },
        {
          name: 'Products',
          route: '/product-type',
          icon: ProductsIcon,
          backendKey: 'products'
        }
      ]
    },
    // {
    //   name: 'Product Category',
    //   route: '/product-category',
    //   icon: CategoryIcon,
    //   backendKey: 'product-categories'
    // },
    // {
    //   name: 'Product Sub Category',
    //   route: '/product-sub-category',
    //   icon: CategoryIcon,
    //   backendKey: 'product-sub-categories'
    // },
    // { name: 'Products', route: '/products', icon: ProductsIcon, backendKey: 'products' },
    // {
    //   name: 'Products',
    //   route: '/product-type',
    //   icon: ProductsIcon,
    //   backendKey: 'products'
    // },
    { name: 'Purchase', route: '/purchase', icon: PurchaseIcon, backendKey: 'purchases' },
    { name: 'Sale', route: '/sale', icon: SalesIcon, backendKey: 'sales' },
    { name: 'Store', route: '/store', icon: ProductIcon, backendKey: 'stores' },
    { name: 'Customers', route: '/customers', icon: CustomerIcon, backendKey: 'customers' },
    { name: 'Suppliers',
      icon: SuppliersIcon, 
      backendKey: 'suppliers',
      children: [
        {
        name: 'Suppliers',
        route: '/supplier',
        icon: SuppliersIcon, 
      backendKey: 'suppliers',
        },
        {
      name: 'Supplier Product',
      route: '/supplier-product',
      icon: ProductIcon,
      backendKey: 'supplier-products'
    },
      ] 
    },
    
    // { name: 'Records', route: '/', icon: recordsIcon, backendKey: 'records' },
    { name: 'Reports', route: '/report', icon: reportsIcon, backendKey: 'reports' },
    {
      name: 'Subscription',
      route: '/c-subscriptions',
      icon: SubscriptionIcon,
      backendKey: 'c-subscriptions'
    },
    {
      name: 'Subscribers',
      route: '/subscriptions',
      icon: SubscriptionIcon,
      backendKey: 'subscriptions'
    },
    { name: 'Settings', route: '/settings', icon: SettingsIcon, backendKey: 'settings' },
    { name: 'Log Out', route: '/logout', icon: logoutIcon, backendKey: 'logout' }
  ]

  return allItems.filter((item) => {
    if (item.backendKey === null) {
      return true
    } else {
      const perm = permissions.value.find((p) => p.page_name == item.backendKey)
      return perm && perm.read == 1
    }
  })
})

//const perm = permissions.value.find(p => console.log(p.page_name));
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
