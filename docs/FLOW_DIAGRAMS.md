# Salesbook Frontend Flow Diagrams

## Technical Flow Details

### 1. Authentication Flow with Technical Details
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (Vue)
    participant S as Store (Pinia)
    participant A as Auth Service
    participant B as Backend
    participant L as LocalStorage

    U->>F: Enter Credentials
    F->>F: validate(email, password)
    Note over F: Email Regex: ^[^@]+@[^@]+\.[^@]+$
    F->>A: login({ email, password })
    Note over A: Headers: { 'Content-Type': 'application/json' }
    A->>B: POST /api/v1/auth/login
    Note over B: JWT Generation (HS256)
    B-->>A: { token, user, refreshToken }
    A->>S: commit('auth/setUser', user)
    A->>L: setItem('auth_token', token)
    Note over L: Token Format: Bearer [JWT]
    S-->>F: computed(() => store.state.auth.user)
    F-->>U: router.push('/dashboard')
    
    Note over F,B: Token Refresh (Every 55 mins)
    F->>A: refreshToken()
    Note over A: Headers: { 'Authorization': `Bearer ${token}` }
    A->>B: POST /api/v1/auth/refresh
    B-->>A: { newToken }
    A->>L: updateToken(newToken)
```

### 2. Product Management Technical Flow
```mermaid
graph TD
    A[Start] --> B{Cache Check}
    B -->|Hit| C[useProductsStore().products]
    B -->|Miss| D[fetchProducts()]
    
    subgraph Cache Logic
    C --> E[computed(() => products)]
    end
    
    subgraph API Calls
    D --> F[GET /api/v1/products]
    F --> G{Response}
    G -->|200| H[commit('setProducts')]
    G -->|Error| I[handleError()]
    end
    
    subgraph Form Handling
    J[Product Form] --> K[v-model bindings]
    K --> L{Validation}
    L -->|Valid| M[submitForm()]
    L -->|Invalid| N[showErrors()]
    end
    
    subgraph API Integration
    M --> O[POST/PUT Product]
    O --> P[handleResponse()]
    P --> Q[updateStore()]
    end
    
    subgraph Error Handling
    I --> R[toast.error()]
    I --> S[logError()]
    end
    
    style Cache Logic fill:#f9f,stroke:#333
    style API Calls fill:#bbf,stroke:#333
    style Form Handling fill:#bfb,stroke:#333
    style API Integration fill:#fbb,stroke:#333
    style Error Handling fill:#fbf,stroke:#333
```

### 3. Data Synchronization Technical Flow
```mermaid
sequenceDiagram
    participant C as Component
    participant S as Store (Pinia)
    participant W as Web Worker
    participant I as IndexedDB
    participant B as Backend API
    participant Q as Queue Store

    Note over C: @/components/ProductForm.vue
    C->>S: dispatch('products/save')
    Note over S: Store: useProductsStore()
    S->>W: postMessage({ type: 'SYNC', payload })
    Note over W: worker.js: syncHandler()
    W->>I: transaction('products', 'readwrite')
    Note over I: DB: 'salesbook', Version: 1
    W->>B: fetch('/api/v1/products', { method: 'POST' })
    Note over B: Validates JWT in Authorization header
    
    alt Online Mode
        B-->>W: Response (200 OK)
        W->>I: updateLocalData(response)
        W->>S: commit('setProducts', products)
        S-->>C: watchEffect(() => store.products)
    else Offline Mode
        W->>Q: enqueueAction({ type, payload })
        Note over Q: Queue Structure: { id, action, timestamp }
        W->>I: saveLocally(payload)
        W->>W: addEventListener('online', syncQueue)
    end
```

### 4. Form Technical Flow
```mermaid
graph TD
    Start[Form Initialized] --> Input[User Input]
    Input --> Validate{Validate Form}
    Validate -->|Valid| Submit[Submit Form]
    Validate -->|Invalid| ShowErrors[Show Errors]
    Submit --> ApiCall[Call API]
    ApiCall --> CheckResponse{Check Response}
    CheckResponse -->|Success| Success[Show Success]
    CheckResponse -->|Error| HandleError[Show Error Message]
    HandleError --> Input
    ShowErrors --> Input
```

### 5. Component Lifecycle Technical Flow
```mermaid
graph TD
    Setup[Setup Script] --> Props[Define Props]
    Props --> State[Initialize State]
    State --> Computed[Setup Computed]
    Computed --> Watch[Setup Watchers]
    Watch --> Mount[onMounted Hook]
    Mount --> Fetch[Fetch Initial Data]
    Fetch --> Render[Initial Render]
    Render --> Interact[User Interaction]
    Interact --> Update[Update State]
    Update --> Rerender[Re-render]
```

### 6. Store Technical Flow (Pinia)
```mermaid
graph LR
    Action[User Action] --> Component[Component]
    Component --> Dispatch[Dispatch Action]
    Dispatch --> Store[Store Action]
    Store --> ApiCheck{API Call?}
    ApiCheck -->|Yes| Api[API Service]
    ApiCheck -->|No| Mutate[Mutation]
    Api --> Mutate
    Mutate --> StateUpdate[Update State]
    StateUpdate --> Notify[Notify Subscribers]
    Notify --> UpdateUI[Update UI]
```

### 7. Router Technical Flow
```mermaid
sequenceDiagram
    participant R as Router
    participant G as Navigation Guards
    participant S as Store
    participant V as Vue Component
    
    Note over R: Route Definition:\n{ path: '/products/:id', component: ProductView }
    R->>G: beforeEach(to, from, next)
    Note over G: Guard Logic:\nrequiresAuth: true\nrequiresRole: ['admin']
    G->>S: getters['auth/isAuthenticated']
    Note over S: Auth Check:\ncomputed(() => !!state.user)
    S-->>G: Boolean
    G->>V: next()
    Note over V: Component Load:\nasync setup() {\n  await useProducts().fetch()\n}
```

### 8. Error Handling Technical Flow
```mermaid
graph TD
    Error[Error Occurs] --> Type{Error Type}
    Type -->|API| ApiHandler[Handle API Error]
    Type -->|Validation| ValidHandler[Handle Validation]
    Type -->|Network| NetHandler[Handle Network]
    Type -->|Auth| AuthHandler[Handle Auth]
    
    ApiHandler --> StatusCheck{Status Code}
    StatusCheck -->|400| BadReq[Bad Request]
    StatusCheck -->|401| Unauth[Unauthorized]
    StatusCheck -->|403| Forbid[Forbidden]
    StatusCheck -->|404| NotFound[Not Found]
    StatusCheck -->|500| Server[Server Error]
    
    ValidHandler --> ShowErrors[Show Field Errors]
    NetHandler --> OfflineMode[Show Offline Mode]
    AuthHandler --> Login[Redirect to Login]
```

### 9. IndexedDB Technical Flow
```mermaid
sequenceDiagram
    participant A as App
    participant D as IndexedDB
    participant S as Store
    
    Note over A: Database Config:\nname: 'salesbook'\nversion: 1
    A->>D: openDB()
    Note over D: Object Stores:\n- products\n- customers\n- purchases
    D-->>A: db connection
    
    A->>D: transaction('products')
    Note over D: Transaction Mode:\nreadwrite
    D-->>A: IDBTransaction
    
    A->>D: store.put(product)
    Note over D: Index: 'by_id'\nKeyPath: 'id'
    D-->>A: result
    
    A->>S: commit('setProducts')
    Note over S: Sync with Pinia Store
```

These technical flows include:
1. Specific implementation details
2. Code snippets and patterns
3. Configuration details
4. Data structures
5. API specifications
6. Error handling strategies
7. State management details
8. Database schemas
