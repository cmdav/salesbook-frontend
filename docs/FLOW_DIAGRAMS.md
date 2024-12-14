# Salesbook Frontend Flow Diagrams

## Core Application Flows

### 1. Basic Authentication Flow
```mermaid
sequenceDiagram
    User->>Frontend: Login
    Frontend->>Backend: Send Credentials
    Backend->>Frontend: Return Token
    Frontend->>User: Show Dashboard
```

### 2. Product Management Flow
```mermaid
graph TD
    A[Start] --> B[List Products]
    B --> C[Add Product]
    B --> D[Edit Product]
    B --> E[Delete Product]
```

### 3. Purchase Flow
```mermaid
graph TD
    A[Select Product] --> B[Set Quantity]
    B --> C[Set Price]
    C --> D[Save Purchase]
```

### 4. Form Handling
```mermaid
graph TD
    A[Input Data] --> B{Valid?}
    B -->|Yes| C[Submit]
    B -->|No| D[Show Error]
```

### 5. Data Sync
```mermaid
graph LR
    A[Component] --> B[Store]
    B --> C[API]
    C --> B
    B --> A
```

### 6. Error Handling
```mermaid
graph TD
    A[Error] --> B{Type}
    B -->|API| C[Show Message]
    B -->|Network| D[Offline Mode]
    B -->|Auth| E[Login]
```

### 7. Component Lifecycle
```mermaid
graph TD
    A[Mount] --> B[Load Data]
    B --> C[Render]
    C --> D[Update]
    D --> E[Unmount]
```

### 8. Navigation Flow
```mermaid
graph TD
    A[Click Link] --> B{Auth?}
    B -->|Yes| C[Load Page]
    B -->|No| D[Login]
```

### 9. State Updates
```mermaid
graph LR
    A[Action] --> B[Store]
    B --> C[State]
    C --> D[UI]
```

These diagrams represent the core flows in the application. Each diagram is intentionally kept simple and focused on one specific aspect of the system.
