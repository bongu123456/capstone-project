# ⚙️ Backend App — Express & MongoDB REST API

This is the secure, modular server-side Express API for the **BlogApp**. It processes business logic, conducts multi-role token verifications, manages image uploads via a memory stream pipeline, and interfaces with a MongoDB Atlas cloud cluster.

---

## 🛠️ Key Architectural Features

*   **Hoisting-Safe Configuration:** Loads environment parameters immediately at the startup entry point (`import 'dotenv/config'`) to ensure dependency libraries (like Cloudinary) configure successfully before routes execute.
*   **Role-based JWT Verification:** Uses `verifyToken` middleware that parses and compares user roles (`USER`, `AUTHOR`, `ADMIN`) before granting route execution.
*   **Memory-Optimized File Parsing:** Uses `multer.memoryStorage()` to intercept files as buffers in RAM, avoiding unnecessary disk writing.
*   **Cloudinary Stream Uploads:** Directly uploads the binary file buffers to Cloudinary using an asynchronous Promise-based stream (`cloudinary.uploader.upload_stream`), making image processing extremely fast.
*   **Robust Rollbacks:** Built-in safeguards that catch any registration failure and instantly rollback/delete the newly uploaded profile photo from Cloudinary, keeping your media storage clean.

---

## 📡 REST API Endpoint Reference

| Route | HTTP Method | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `/common-api/login` | **POST** | Public | Verifies credentials & sets HttpOnly cookie |
| `/common-api/logout` | **GET** | Public | Clears session cookie |
| `/common-api/check-auth`| **GET** | Public | Quiet session verification (Returns 200 OK) |
| `/user-api/users` | **POST** | Public | Registers a reader (with Multer/Cloudinary) |
| `/user-api/articles` | **GET** | Reader | Reads all active articles |
| `/user-api/articles` | **PUT** | Reader | Posts a comment to a specific article |
| `/author-api/users` | **POST** | Public | Registers an author (with Multer/Cloudinary)|
| `/author-api/articles`| **POST** | Author | Creates a new article |
| `/author-api/articles/:aid`| **GET** | Author | Fetches articles authored by specific ID |
| `/author-api/articles/:id/status`| **PATCH**| Author | Soft-deletes or restores an article |

---

## 🔒 Custom Middlewares

### 1. Multi-Role Token Verification (`verifyToken.js`)
Secures routes by reading the JWT from the `token` cookie and validating that the user's role matches the required permission levels:
```javascript
export const verifyToken = (...allowedRoles) => {
  return async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized. Please login" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Session expired" });
    }
  };
};
```

### 2. Global Error Mapping
A central error-handling middleware in `server.js` captures Mongoose validation errors, Mongo duplicate-key exceptions (Code `11000`), and maps them to clean user-friendly HTTP statuses:
*   `ValidationError` / `CastError` $\rightarrow$ `400 Bad Request`
*   `MongoError Code 11000` (Duplicate Email) $\rightarrow$ `409 Conflict` (Details returned: `"email already exists"`)

---

## ⚙️ How to Run Locally

1. Install backend dependencies:
   ```bash
   npm install
   ```
2. Verify that your `.env` is fully populated.
3. Start the Express server:
   ```bash
   node server.js
   ```
