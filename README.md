# iSalesbook Frontend Documentation

## Table of Contents
- [Overview](#overview)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Core Features](#core-features)
- [Development Guide](#development-guide)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [Deployment](#deployment)


## Overview

Salesbook is a Vue.js-based frontend application for managing sales, inventory, and business operations. Built with modern web technologies, it provides a robust platform for business management.

### Tech Stack
- **Framework**: Vue.js 3
- **State Management**: Pinia
- **UI Framework**: Ant Design Vue
- **Build Tool**: Vite
- **Testing**: Vitest
- **CSS**: Tailwind CSS
- **HTTP Client**: Axios
- **Offline Support**: Service Workers + IndexedDB

## Getting Started

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0

### Installation
```bash
# Clone the repository
git clone https://github.com/cmdav/salesbook-frontend.git

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Setup
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=your_backend_api_url
VITE_APP_TITLE=Salesbook
```

## Architecture

### Core Principles
1. **Component-Based Architecture**
   - Reusable UI components
   - Smart/Dumb component pattern
   - Composition API usage

2. **State Management**
   - Centralized store with Pinia
   - Module-based store organization
   - Computed properties for derived state

3. **Routing**
   - Route-based code splitting
   - Navigation guards
   - Nested routes for complex views

### Data Flow
```
Component → Action → API → Store → Component
```

## Project Structure

```
salesbook-frontend/
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # Reusable components
│   ├── composables/     # Shared composition logic
│   ├── router/          # Route definitions
│   ├── services/        # API services
│   ├── stores/          # Pinia stores
│   └── views/           # Page components
├── public/              # Public static assets
├── tests/               # Test files
└── docs/               # Documentation
```

### Key Directories

#### `src/components/`
- **UI/**: Base UI components
- **Forms/**: Form-related components
- **Layout/**: Layout components
- **Shared/**: Shared components

#### `src/views/`
- **Dashboard/**: Dashboard views
- **Products/**: Product management
- **Sales/**: Sales management
- **Reports/**: Reporting views

## Core Features

### 1. Authentication
- JWT-based authentication
- Role-based access control
- Token refresh mechanism

### 2. Product Management
``javascript

// Example Store Usage
const productStore = useProductStore();
await productStore.fetchProducts();
```

### 3. Inventory Management
- Inventory Onboarding
- Inventory Sales
- Inventory tracking
- Report Tracking

### 4. Offline Support
- Service Worker caching
- IndexedDB storage
- Background sync

## Development Guide

### Component Creation
```vue
<!-- Example Component Structure -->
<template>
  <div class="component">
    <slot name="header" />
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Props
interface Props {
  title: string
}
const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  (e: 'update', value: string): void
}>()

// State
const isLoading = ref(false)

// Lifecycle
onMounted(() => {
  // initialization
})
</script>
```

### Store Pattern
```typescript
// stores/products.ts
export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    isLoading: false
  }),
  
  getters: {
    sortedProducts: (state) => [...state.products].sort()
  },
  
  actions: {
    async fetchProducts() {
      this.isLoading = true
      try {
        const data = await api.get('/products')
        this.products = data
      } finally {
        this.isLoading = false
      }
    }
  }
})
```

## Best Practices

### 1. Component Design
- Single Responsibility Principle
- Props validation
- Event documentation
- Composition API usage

### 2. State Management
- Centralized store for shared state
- Local state for component-specific data
- Computed properties for derived data

### 3. Performance
- Lazy loading routes
- Component lazy loading
- Asset optimization
- Virtual scrolling for large lists

### 4. Error Handling
```typescript
// Global error handler
app.config.errorHandler = (err, vm, info) => {
  // Log error
  console.error(err)
  
  // Show user-friendly message
  toast.error('An error occurred')
  
  // Report to error tracking service
  errorTracker.report(err)
}
```

## Testing

### Unit Tests
```typescript
import { mount } from '@vue/test-utils'
import MyComponent from './MyComponent.vue'

describe('MyComponent', () => {
  test('renders correctly', () => {
    const wrapper = mount(MyComponent)
    expect(wrapper.exists()).toBe(true)
  })
})
```

### E2E Tests
```typescript
describe('Product Creation', () => {
  test('creates a new product', () => {
    cy.visit('/products/new')
    cy.get('[data-test="name"]').type('New Product')
    cy.get('[data-test="submit"]').click()
    cy.url().should('include', '/products')
  })
})
```

## Deployment

### Build Process
```bash
# Production build
npm run build

# Preview build
npm run preview
```

### Environment Configuration
- Development: `.env.development`
- Production: `.env.production`
- Staging: `.env.staging`

## Support

For support and questions:
- Check docs/flow_diagram
- Contact rdas support team

