# iSalesbook Frontend Architecture Documentation

## Overview
Salesbook is a Vue.js-based frontend application for managing sales, inventory, and business operations. The application uses modern Vue.js practices including Vue 3, Pinia for state management, and follows a modular architecture pattern.

## Project Root Structure

```
salesbook-frontend/
├── src/              # Application source code
├── public/           # Static files
├── dist/            # Production build output
├── node_modules/    # Dependencies
├── .env             # Environment variables
├── .eslintrc.cjs    # ESLint configuration
├── .prettierrc.json # Prettier configuration
├── customSw.js      # Custom service worker
├── customSync.js    # Data synchronization
├── idb.js           # IndexedDB utilities
├── package.json     # Project dependencies and scripts
├── tailwind.config.js # Tailwind CSS configuration
└── vite.config.js   # Vite configuration
```

## Tech Stack
- **Framework**: Vue.js 3
- **State Management**: Pinia
- **UI Framework**: Ant Design Vue
- **Router**: Vue Router
- **HTTP Client**: Axios
- **Query Management**: Vue Query
- **Form Handling**: Custom form fields
- **Offline Support**: Service Workers
- **Data Storage**: IndexedDB for offline capabilities
- **CSS Framework**: Tailwind CSS
- **Build Tool**: Vite
- **Testing**: Vitest

## Component Hierarchy

```
components/
├── Auth/                 # Authentication components
│   ├── LoginForm.vue
│   └── RegisterForm.vue
├── Layouts/             # Layout components
│   ├── dashboardLayout.vue
│   └── AuthLayout.vue
├── UI/                  # Reusable UI components
│   ├── Modals/
│   ├── Forms/
│   └── Common/
├── SideBar/            # Navigation components
├── Header/             # Header components
└── icons/              # SVG icons
```

### Modal Hierarchy

```
UI/Modals/
├── BaseModal.vue           # Base modal component
├── CenteredModal.vue       # Centered layout modal
├── CenteredModalLarge.vue  # Large centered modal
├── ConfirmationModal.vue   # Confirmation dialogs
└── CustomModal.vue         # Customizable modal
```

## Code Examples

### 1. Component Pattern (Composition API)
```vue
<template>
  <div class="product-form">
    <form @submit.prevent="handleSubmit">
      <input v-model="productData.name" type="text" />
      <button :disabled="isSubmitting">{{ submitButtonText }}</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProductStore } from '@/stores/products'

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  }
})

const productData = ref({ ...props.initialData })
const isSubmitting = ref(false)
const productStore = useProductStore()

const submitButtonText = computed(() => 
  isSubmitting.value ? 'Saving...' : 'Save Product'
)

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    await productStore.saveProduct(productData.value)
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
```

### 2. Store Pattern (Pinia)
```javascript
// stores/products.js
import { defineStore } from 'pinia'
import { Products } from '@/services/Products'

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    isLoading: false,
    error: null
  }),

  getters: {
    getProductById: (state) => (id) => 
      state.products.find(p => p.id === id)
  },

  actions: {
    async fetchProducts() {
      this.isLoading = true
      try {
        const response = await Products.getAll()
        this.products = response.data
      } catch (error) {
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    }
  }
})
```

### 3. Service Pattern
```javascript
// services/Products.js
import apiService from './apiService'

export class Products {
  static async getAll() {
    return apiService.get('products')
  }

  static async getById(id) {
    return apiService.get(`products/${id}`)
  }

  static async create(data) {
    return apiService.post('products', data)
  }

  static async update(id, data) {
    return apiService.put(`products/${id}`, data)
  }
}
```

### 4. Router Guard Pattern
```javascript
// router/middleware/auth.js
import { useUserStore } from '@/stores/user'

export const authGuard = async (to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next({ name: 'login' })
    return
  }
  
  if (to.meta.requiresRole && !userStore.hasRole(to.meta.requiresRole)) {
    next({ name: 'unauthorized' })
    return
  }
  
  next()
}
```

## Application Flow Diagrams

### 1. Authentication Flow (Detailed)
![Authentication Flow Detailed](C:/Users/Radiant/Work/salesbook-frontend/docs/diagrams/auth-flow-detailed.png)

### 2. Product Management Flow
![Product Management Flow](C:/Users/Radiant/Work/salesbook-frontend/docs/diagrams/product-management-flow.png)

### 3. Data Synchronization Flow
![Data Synchronization Flow](C:/Users/Radiant/Work/salesbook-frontend/docs/diagrams/sync-flow.png)

### 4. Form Flow
![Form Flow](C:/Users/Radiant/Work/salesbook-frontend/docs/diagrams/form-flow.png)

### 5. Component Lifecycle Flow
![Component Lifecycle Flow](C:/Users/Radiant/Work/salesbook-frontend/docs/diagrams/component-lifecycle.png)

### 6. Store Flow (Pinia)
![Store Flow](C:/Users/Radiant/Work/salesbook-frontend/docs/diagrams/store-flow.png)

### 7. Router Flow
![Router Flow](C:/Users/Radiant/Work/salesbook-frontend/docs/diagrams/router-flow.png)

### 8. Error Handling Flow
![Error Handling Flow](C:/Users/Radiant/Work/salesbook-frontend/docs/diagrams/error-flow.png)

### 9. IndexedDB Flow
![IndexedDB Flow](C:/Users/Radiant/Work/salesbook-frontend/docs/diagrams/indexeddb-flow.png)

## Component Communication Patterns

### 1. Props Down, Events Up
```vue
<!-- Parent.vue -->
<template>
  <child-component
    :data="parentData"
    @update="handleUpdate"
  />
</template>

<!-- Child.vue -->
<template>
  <div @click="$emit('update', newValue)">
    {{ data }}
  </div>
</template>
```

### 2. Store-Based Communication
```javascript
// Component A
const store = useStore()
store.dispatch('updateData', newValue)

// Component B
const store = useStore()
watch(() => store.state.data, (newValue) => {
  // Handle state change
})
```

## Development Guidelines

### 1. Component Creation
```vue
<!-- Example of a well-structured component -->
<template>
  <div :class="$style.container">
    <slot name="header" />
    <div :class="$style.content">
      <slot />
    </div>
    <slot name="footer" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Props
const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

// Emits
const emit = defineEmits(['update'])

// State
const isLoading = ref(false)

// Lifecycle
onMounted(() => {
  // Initialization logic
})

// Methods
const handleUpdate = () => {
  emit('update')
}
</script>

<style module>
.container {
  /* styles */
}
.content {
  /* styles */
}
</style>
```

## Testing Patterns

### 1. Component Testing
```javascript
import { mount } from '@vue/test-utils'
import MyComponent from './MyComponent.vue'

describe('MyComponent', () => {
  test('renders correctly', () => {
    const wrapper = mount(MyComponent)
    expect(wrapper.exists()).toBe(true)
  })

  test('emits update event', async () => {
    const wrapper = mount(MyComponent)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('update')).toBeTruthy()
  })
})
```

## Performance Optimization

### 1. Code Splitting
```javascript
// Router-level code splitting
const routes = [
  {
    path: '/products',
    component: () => import('@/views/Products.vue')
  }
]
```

### 2. Computed Properties
```javascript
// Efficient computed properties
const filteredProducts = computed(() => 
  products.value.filter(p => p.price > minPrice.value)
)
```

## Error Handling

### 1. Global Error Handler
```javascript
app.config.errorHandler = (err, vm, info) => {
  // Handle error
  console.error(err)
  // Notify user
  toast.error('An error occurred')
}
```

### 2. API Error Handling
```javascript
try {
  await api.request()
} catch (error) {
  if (error.response) {
    // Handle specific HTTP errors
    switch (error.response.status) {
      case 401:
        // Handle unauthorized
        break
      case 404:
        // Handle not found
        break
      default:
        // Handle other errors
    }
  } else {
    // Handle network errors
  }
}
```

## Future Considerations

1. **Performance Optimization**
   - Implement Virtual Scrolling for large lists
   - Add PWA capabilities
   - Optimize bundle size

2. **Feature Expansion**
   - Advanced reporting dashboard
   - Real-time updates
   - Multi-language support

3. **Security Enhancements**
   - Implement CSRF protection
   - Add rate limiting
   - Enhanced password policies

4. **UI/UX Improvements**
   - Dark mode support
   - Custom theming
   - Enhanced mobile experience
