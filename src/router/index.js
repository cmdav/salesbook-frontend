import { createRouter, createWebHistory } from 'vue-router'
import middleware from './Middleware/index.js'
import Login from '@/views/Auth/Login.vue'
import LoginSuppliers from '@/views/Auth/LoginSuppliers.vue'
import DashBoardVue from '@/views/Dashboard/DashBoard.vue'
import Register from '@/views/Auth/Register.vue'
import ForgottenPasswordVue from '@/views/Auth/ForgottenPassword.vue'
import VerifyPage from '@/views/Auth/VerifyPage.vue'
import VerifyEmail from '@/views/Auth/VerifyEmail.vue'
import SupplierPage from '@/views/Dashboard/Suppliers/SupplierPage.vue'
import CustomersPage from '@/views/Dashboard/Customers/CustomersPage.vue'
import RegisterSupplierPage from '@/views/Auth/RegisterSupplierPage.vue'
import VerifySupplier from '@/views/Auth/VerifySupplier.vue'
import OrganisationPage from '@/views/Dashboard/Organisation/OrganisationPage.vue'
import SupplierSinglePage from '@/views/Dashboard/Suppliers/SupplierSinglePage.vue'
import CustomersSinglePage from '@/views/Dashboard/Customers/CustomersSinglePage.vue'
import ProductsPage from '@/views/Dashboard/Product/ProductPage.vue'
import ProductsPages from '@/views/Dashboard/Product/ProductPages.vue'
import ProductCategoryPage from '@/views/Dashboard/Product/ProductCategoryPage.vue'
import ProductSubCategoryPage from '@/views/Dashboard/Product/ProductSubCategoryPage.vue'
import CurrencyPage from '@/views/Dashboard/Product/CurrencyPage.vue'
import StorePage from '@/views/Dashboard/Product/StorePage.vue'
import SalePage from '@/views/Dashboard/Product/Sale/ViewSalePage.vue'
import CreateSalePage from '@/views/Dashboard/Product/Sale/CreateSalePage.vue'
import Subscriptions from '@/views/Dashboard/Subscriptions/SubscriptionDefaultPage.vue'
import SubscriptionPlan from '@/views/Dashboard/Subscriptions/SubscribersPlanPage/ViewSubscribersPlan.vue'
import CreateSubscriptionPage from '@/views/Dashboard/Subscriptions/SubscribersPage/CreateSubscriptionPage.vue'

import ViewCustomerSubscriptionPage from '@/views/Dashboard/CustomerSubscription/ViewCustomerSubscriptionPage.vue'

//import SalePage from '@/views/Dashboard/Product/SalePage.vue'

//import ProductTypePage from '@/views/Dashboard/Product/ProductTypePage.vue'
import PricePage from '@/views/Dashboard/Product/PricePage.vue'
import PurchasePage from '@/views/Dashboard/Product/Purchase/ViewPurchasePage.vue'
import CreatePurchasePage from '@/views/Dashboard/Product/Purchase/CreatePurchasePage.vue'
//import PurchasePage from '@/views/Dashboard/Product/PurchasePage.vue'
import MeasurementPage from '@/views/Dashboard/Product/MeasurementPage.vue'
import SupplierProductsPage from '@/views/Dashboard/SupplierProduct/SupplierProductPage.vue'
import RolesPage from '@/views/Dashboard/Security/Pages/RolesPage.vue'
import DefultPage from '@/views/Dashboard/Security/DefultPage.vue'
import ResetPassword from '@/views/Auth/ResetPassword.vue'
import ProfilePage from '@/views/Dashboard/Profile/ProfilePage.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: [middleware.redirectDashboard]
    },
    {
      path: '/supplier/login',
      name: 'supplier-login',
      component: LoginSuppliers,
      beforeEnter: [middleware.redirectSupplierDashboard]
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      beforeEnter: [middleware.redirectDashboard]
    },
    {
      path: '/new-supplier/:token',
      name: 'register-supplier',
      component: RegisterSupplierPage
      // beforeEnter: [middleware.redirectDashboard]
    },
    {
      path: '/existing-supplier/:token',
      name: 'existing-supplier',
      component: VerifySupplier
      // beforeEnter: [middleware.redirectDashboard]
    },
    {
      path: '/email-verification/:token',
      name: 'email-verification',
      component: VerifyEmail
    },
    {
      path: '/forgotten-password',
      name: 'forgotten-password',
      component: ForgottenPasswordVue
    },

    {
      path: '/password-reset/:token',
      name: 'password-reset',
      component: ResetPassword
    },
    {
      path: '/verify/:email',
      name: 'verify',
      component: VerifyPage
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashBoardVue,
      beforeEnter: [middleware.redirectLogin]
    },
    {
      path: '/supplier-dashboard',
      name: 'supplier-dashboard',
      component: () => import('@/views/SuppliersDashboard/SupplierHomePage.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage,
      beforeEnter: [middleware.redirectLogin]
    },
    {
      path: '/supplier',
      name: 'supplier',
      component: SupplierPage,
      beforeEnter: [middleware.redirectLogin]
    },
    {
      path: '/roles',
      name: 'roles',
      component: RolesPage,
      beforeEnter: [middleware.redirectLogin]
    },
    {
      path: '/settings',
      name: 'settings',
      component: DefultPage,
      beforeEnter: [middleware.redirectLogin]
    },

    {
      path: '/supplier/:id',
      name: 'view-supplier',
      component: SupplierSinglePage,
      beforeEnter: [middleware.redirectLogin]
    },
    {
      path: '/organisation',
      name: 'organisation',
      component: OrganisationPage,
      beforeEnter: [middleware.redirectLogin]
    },
    {
      path: '/customers',
      name: 'customers',
      component: CustomersPage,
      beforeEnter: [middleware.redirectLogin]
    },
    {
      path: '/product',
      name: 'product',
      component: ProductsPage,
      beforeEnter: [middleware.redirectLogin]
    },
    // added routes
    {
      path: '/products',
      name: 'products',
      component: ProductsPages,
      beforeEnter: [middleware.redirectLogin]
    },
    {
      path: '/measurement',
      name: 'measurement',
      component: MeasurementPage,
      beforeEnter: [middleware.redirectLogin]
    },

    {
      path: '/product-category',
      name: 'product-category',
      component: ProductCategoryPage,
      beforeEnter: [middleware.redirectLogin]
    },
    {
      path: '/product-sub-category',
      name: 'product-sub-category',
      component: ProductSubCategoryPage,
      beforeEnter: [middleware.redirectLogin]
    },
    {
      path: '/currency',
      name: 'currency',
      component: CurrencyPage,
      beforeEnter: [middleware.redirectLogin]
    },
    {
      path: '/sale',
      name: 'sale',
      component: SalePage,
      beforeEnter: [middleware.redirectLogin]
    },
    {
      path: '/create-sale',
      name: 'create-sale',
      component: CreateSalePage
    },
    // {
    //   path: '/product-type/:id',
    //   name: 'product-type',
    //   component: ProductTypePage,
    //  // beforeEnter: [middleware.redirectLogin]
    // },

    {
      path: '/price/:id',
      name: 'price',
      component: PricePage,
      beforeEnter: [middleware.redirectLogin]
    },

    {
      path: '/store',
      name: 'store',
      component: StorePage,
      beforeEnter: [middleware.redirectLogin]
    },
    {
      path: '/purchase',
      name: 'purchase',
      component: PurchasePage,
      beforeEnter: [middleware.redirectLogin]
    },
    {
      path: '/create-purchase',
      name: 'create-purchase',
      component: CreatePurchasePage
    },
    {
      path: '/supplier-product',
      name: 'supplier-product',
      component: SupplierProductsPage,
      beforeEnter: [middleware.redirectLogin]
    },
    {
      path: '/subscriptions',
      name: 'subscriptions',
      component: Subscriptions,
      beforeEnter: [middleware.redirectLogin]
    },
    {
      path: '/c-subscriptions',
      name: 'customer subscriptions',
      component: ViewCustomerSubscriptionPage,
      beforeEnter: [middleware.redirectLogin]
    },
    {
      path: '/subscriptionPlan',
      name: 'subscription-plan',
      component: SubscriptionPlan,
      beforeEnter: [middleware.redirectLogin]
    },
    {
      path: '/create-subscription',
      name: 'create-subscription',
      component: CreateSubscriptionPage
    },
    {
      path: '/customers/:id',
      name: 'view-customers',
      component: CustomersSinglePage,
      beforeEnter: [middleware.redirectLogin]
    },
    {
      path: '/logout',
      name: 'logout',
      beforeEnter: [middleware.deleteSession]
    },
    {
      path: '/logout-supplier',
      name: 'signout',
      beforeEnter: [middleware.deleteSupplierSession]
    },
    {
      path: '/:catchAll(.*)',
      component: Login
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    console.log(to)
    console.log(from)
    console.log(savedPosition)
    return { top: 0 }
  }
})

export default router
