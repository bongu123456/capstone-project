# 💻 Frontend App — React & Vite Client

This is the client-side React application for **BlogApp**. Designed with a premium Apple-inspired minimal light theme, it leverages a clean architecture built around a centralized state store, declarative routing, and secure role-based dashboard layout panels.

---

## 🚀 Live Deployment

The frontend of this capstone project is deployed live on **Vercel**:
*   **Production App URL:** [https://capstone-project-govr9x3ug-usermanagement.vercel.app/](https://capstone-project-govr9x3ug-usermanagement.vercel.app/)

---

## 📦 Installed Packages & Dependency Analysis

These are the core dependencies that compile the React application, along with their exact versions and specific purposes:

| Package | Version | Purpose & Rationale |
| :--- | :--- | :--- |
| **`react`** | `^19.2.0` | **Core UI Library:** High-performance, declarative library used to structure interactive components and render views. |
| **`react-dom`** | `^19.2.0` | **DOM Renderer:** Binds React elements directly to the browser DOM, enabling seamless client-side single-page interactions. |
| **`react-router`** | `^7.13.1` | **Routing Core:** Underlying routing engine that handles historical state and routes logic. |
| **`react-router-dom`** | `^7.13.1` | **Declarative Routing:** Enables SPA client-side routing, offering dynamic links (`NavLink`), layout outlets, and navigational history. |
| **`zustand`** | `^5.0.11` | **Central State Store:** A lightweight, reactive, and hook-based state manager that handles authentication status, session states, and current user models globally. |
| **`axios`** | `^1.13.6` | **HTTP Client:** Communicates with the backend server via HTTP. Configured with credentials tracking (`withCredentials: true`) to support cookie-based sessions. |
| **`react-hook-form`** | `^7.71.2` | **Form Management:** Manages complex inputs (Sign up / Login) with high-performance validations, rendering, and file buffer handlers. |
| **`react-hot-toast`** | `^2.6.0` | **Micro-Notifications:** Non-blocking notification alerts that toast status messages (e.g. success/failure) for instant user feedback. |
| **`tailwindcss`** | `^4.3.0` | **Utility-First Styling:** Enforces modern layouts, responsive structures, and customized visual elements. |
| **`@tailwindcss/vite`** | `^4.3.0` | **Vite Style Integration:** Integrates Tailwind directly into the Vite compilation and hot-reloads style tokens instantly. |

### Development Dependencies
*   **`vite` (`^7.3.1`):** High-speed frontend build tool and development server using native HMR (Hot Module Replacement).
*   **`@vitejs/plugin-react` (`^5.1.1`):** Official plugin that integrates React JSX rendering and Fast Refresh inside the Vite build process.

---

## 📂 Detailed File Structure

```text
Frontend/
├── public/                      # Static raw resources
├── src/
│   ├── components/              # Individual modular React Components
│   │   ├── ArticleByID.jsx      # Detailed article view with comment thread
│   │   ├── AuthorArticles.jsx   # List of articles published by logged-in author
│   │   ├── AuthorProfile.jsx    # Author dashboard wrapper with outline Logout
│   │   ├── EditArticleForm.jsx  # Modification form to update existing blogs
│   │   ├── ErrorBoundary.jsx    # React error catcher preventing app crashes
│   │   ├── Footer.jsx           # Clean minimal legal footer
│   │   ├── Header.jsx           # Global sticky nav bar with dynamic routes
│   │   ├── Home.jsx             # Beautiful branding page welcoming visitors
│   │   ├── Login.jsx            # Sign-in panel with credentials validation
│   │   ├── ProtectedRoute.jsx   # Role-based validation gate protecting routes
│   │   ├── Register.jsx         # Sign-up form supporting avatar uploads
│   │   ├── RootLayout.jsx       # Layout orchestrator carrying state initializer
│   │   ├── Unauthorized.jsx     # Elegant warning view for forbidden access
│   │   └── UserProfile.jsx      # Reader dashboard showing active articles list
│   │
│   ├── store/
│   │   └── authStore.js         # Zustand central state coordinator
│   │
│   ├── styles/
│   │   └── common.js            # Unified design system tokens & class configurations
│   │
│   ├── App.jsx                  # Main router definitions and nested layout structures
│   ├── index.css                # Base stylesheet importing Tailwind layers
│   └── main.jsx                 # Client bootstrapping entry point
│
├── eslint.config.js             # Linter settings
├── vite.config.js               # Vite configurations
└── package.json                 # Dependency map
```

---

## 🧩 Comprehensive Component Overview

### 1. Authentication & Session Control
*   **`Login.jsx`**
    *   Authenticates users. Validates credentials, executes `login()` via the Zustand store, and navigates readers/authors automatically to their respective profiles based on their roles.
*   **`Register.jsx`**
    *   Creates a new account. Leverages `react-hook-form` to validate size and mimetype of profile photos client-side (max 2MB, JPG/PNG format) before packaging inputs into a `FormData` structure for direct multipart server post request.
*   **`ProtectedRoute.jsx`**
    *   Acts as a security checkpoint for private pages. Intercepts navigation requests, checks the user's role against required roles, and redirects non-authorized users to `/login` or `/unauthorized`.
*   **`RootLayout.jsx`**
    *   Acts as the main framework wrapper. Initializes a silent session verification `checkAuth()` at boot, ensuring user persistence on page refreshes without showing visual delay.

---

### 2. User/Reader Dashboards
*   **`UserProfile.jsx`**
    *   General reader panel. Automatically queries the `/articles` endpoint to load active blogs written by all authors. 
    *   **Offline Vector Avatar:** Employs a local inline SVG-based gray vector fallback. If no custom image is configured, it renders instantly without network requests, completely avoiding common console network errors (`net::ERR_CONNECTION_CLOSED`).
*   **`ArticleByID.jsx`**
    *   Loads an individual article completely. Renders detailed author credits, categories, tags, timestamps (converted from UTC to IST), content, and comment lists. Authenticated readers can add new comment logs instantly.

---

### 3. Author Dashboards
*   **`AuthorProfile.jsx`**
    *   Author workspace portal. Displays a customized profile card containing their name, customized `Author` badge, and an red-outlined premium **Logout button**. Houses nested sub-routes (`Articles` and `Write Article`).
*   **`AuthorArticles.jsx`**
    *   Displays a list of articles authored exclusively by the logged-in author, including structural delete/restore and edit capabilities.
*   **`WriteArticle.jsx`**
    *   Rich creation card. Validates title, category selection, and body content before saving a new blog article to the database.
*   **`EditArticleForm.jsx`**
    *   Enables modifications to published articles, checking author ownership before executing changes.

---

## 🎨 Design Tokens & UI Architecture (`styles/common.js`)

All visual styling adheres to the Apple Light Theme Design Tokens:
*   **Backgrounds:** Page bases are pure white (`bg-white`), while inner content containers use a premium light-grey shade (`bg-[#f5f5f7]`).
*   **Typography:** Strict, clean sans-serif typography focused on tracking (letter-spacing) and weight distribution:
    *   Titles use heavy tracking-tight sizes (`text-5xl font-bold text-[#1d1d1f] tracking-tight mb-2`).
    *   Excerpts are soft-charcoal (`text-sm text-[#6e6e73] leading-relaxed`).
*   **Capsules & Dividers:** Cards carry highly curved, modern corners (`rounded-2xl`). Spacing dividers are styled as subtle borders (`border-t border-[#e8e8ed]`).

---

## ⚙️ How to Run Locally

1. Install frontend packages:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
3. Generate production build distribution folder:
   ```bash
   npm run build
   ```
