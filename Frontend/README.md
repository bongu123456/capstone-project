# 💻 Frontend App — React & Vite Client

This is the client-side React application for the **BlogApp**. Designed with an Apple-inspired minimal light theme, it leverages a clean architecture built around a centralized state store, declarative routing, and robust multi-role components.

---

## 🚀 Technical Highlights

*   **Vite Native Setup:** Ultra-fast hot module replacement (HMR) and optimized build bundles.
*   **State Management (Zustand):** Single source of truth managed via `authStore.js` with integrated persistence, handles user sessions, logins, logouts, loading state, and error handling.
*   **Unified Design Tokens (`styles/common.js`):** Modular and consistent UI elements mimicking a premium premium styling scheme.
*   **Offline Vector Avatars:** Safe, inline SVG-based default avatars to ensure that missing user profile photos require zero network bandwidth and never trigger connection/network failures in your console.
*   **Form Validation:** Built with `react-hook-form` to ensure client-side file limits (e.g., max 2MB, JPG/PNG format) are validated before uploading.

---

## 📁 Key File Map

```text
Frontend/
├── src/
│   ├── components/
│   │   ├── Login.jsx            # Sign-in card with validation & error handling
│   │   ├── Register.jsx         # Sign-up form with Multer/Cloudinary file upload
│   │   ├── UserProfile.jsx      # Reader profile showing published blogs & comments
│   │   ├── AuthorProfile.jsx    # Author dashboard with custom outline Logout
│   │   ├── WriteArticle.jsx     # rich form to create new content
│   │   ├── ArticleByID.jsx      # Individual blog article view with comment threads
│   │   ├── ProtectedRoute.jsx   # Role-based navigational route security shield
│   │   └── Header.jsx & Footer  # Layout navigation and brand branding
│   │
│   ├── store/
│   │   └── authStore.js         # Central Zustand state controller
│   │
│   ├── styles/
│   │   └── common.js            # Style system tokens & variables
│   │
│   ├── App.jsx                  # Root router config
│   └── main.jsx                 # Client entry point
```

---

## 🔄 State Management: Zustand `authStore`

The frontend uses **Zustand** for lightweight, centralized state management instead of heavy Redux or context-drilling.

```javascript
// State structure (authStore.js)
export const useAuth = create((set) => ({
  currentUser: null,      // Active user details
  articles: [],           // Cached articles
  loading: false,         // Global activity spinner state
  isAuthenticated: false, // Session status flag
  error: null,            // Backend communication errors

  login: async (creds) => { ... },
  logout: async () => { ... },
  checkAuth: async () => { ... } // Silent validation
}));
```

---

## 🎨 Unified Design System (`styles/common.js`)

All styling uses standard tokens mapped to an Apple-inspired aesthetic:
*   **Palette:** Charcoal Text (`#1d1d1f`), Subtle Muted Text (`#6e6e73`), Dynamic Accent Blue (`#0066cc`), Outlined Crimson Red (`#ff3b30`).
*   **Philosophy:** Clean typography (Inter/Roboto), no heavy drop shadows, dynamic hover scaling, and rounded capsule elements (`rounded-2xl`).

---

## ⚙️ How to Run Locally

1. Install modules:
   ```bash
   npm install
   ```
2. Start development mode:
   ```bash
   npm run dev
   ```
3. Create production distribution bundle:
   ```bash
   npm run build
   ```
