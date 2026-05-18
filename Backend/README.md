# ⚙️ Backend App — Express & MongoDB REST API

This is the secure, modular server-side Express API for the **BlogApp**. It processes business logic, conducts multi-role token verifications, manages image uploads via a memory stream pipeline, and interfaces with a MongoDB Atlas cloud cluster.

---

## 🚀 Live Deployment

The backend of this capstone project is deployed live on **Render**:
*   **Production API URL:** [https://capstone-project-1-o8xd.onrender.com](https://capstone-project-1-o8xd.onrender.com)

---

## 📦 Installed Packages & Dependency Analysis

These are the primary dependencies that power the Express application, along with their exact versions and specific architectural purposes:

| Package | Version | Purpose & Rationale |
| :--- | :--- | :--- |
| **`express`** | `^5.2.1` | **Core API Framework:** High-performance web framework used to manage routing, handle requests/responses, and connect custom middlewares cleanly. |
| **`mongoose`** | `^9.1.5` | **MongoDB ODM:** Enables structured Object Document Modeling (ODM) for MongoDB, offering strict schema validation, type casting, query building, and relational modeling. |
| **`jsonwebtoken`** | `^9.0.3` | **JWT Session Tokenizer:** Signs and verifies cryptographically secure stateless JSON Web Tokens for user session authentication. |
| **`bcryptjs`** | `^3.0.3` | **Password Hashing:** Pure JavaScript implementation of Bcrypt, used to hash passwords with salt before database storage to prevent credential theft. |
| **`cookie-parser`** | `^1.4.7` | **Cookie Middleware:** Parses cookies attached to incoming client headers, enabling the server to read client-hidden `HttpOnly` JWT session cookies. |
| **`cors`** | `^2.8.6` | **Cross-Origin Security:** Configures and enforces Cross-Origin Resource Sharing policies so that the Vite client can securely request backend resources. |
| **`dotenv`** | `^17.2.3` | **Environment Control:** Injects system values from `.env` directly into `process.env` at server initialization to keep sensitive API keys and database links private. |
| **`multer`** | `^2.1.1` | **Multipart Parser:** Intercepts `multipart/form-data` request streams, extracting files as memory buffers (`MemoryStorage`) rather than writing files to server disk. |
| **`cloudinary`** | `^2.9.0` | **Cloud Media CDN:** SDK used to communicate with the Cloudinary CDN service, uploading user profile avatars to cloud storage via async stream pipelines. |
| **`daemon`** | `^1.1.0` | **Process Daemonizer:** Restructures the node process to run seamlessly as a background system daemon if needed. |

---

## 📡 REST API Endpoint Details

The server exposes modular RESTful APIs divided by access roles:

### 1. Common APIs (`/common-api`)
Public routes accessible by all users for session administration and credential validation.

*   `POST /common-api/login`
    *   **Description:** Receives email/password credentials, checks status, signs JWT, and returns the active user profile while setting a secure `HttpOnly` token cookie on the client.
    *   **Payload:** `{ "email": "user@example.com", "password": "securepassword" }`
*   `GET /common-api/logout`
    *   **Description:** Instantly clears the `token` session cookie from the client browser, logging the user out.
*   `GET /common-api/check-auth`
    *   **Description:** Silent session checker that reads the client's `token` cookie and verifies identity. If the cookie is expired or missing, it responds with a clean `200 OK` status and `{ "isAuthenticated": false }` instead of a harsh `401` status to avoid browser console warnings.

---

### 2. User/Reader APIs (`/user-api`)
Protected routes for authenticated general users (`USER` role).

*   `POST /user-api/users`
    *   **Description:** Public endpoint to register general users. Integrates with Multer and Cloudinary to handle user profile image upload buffers before saving the profile.
    *   **Payload:** `multipart/form-data` (fields: `firstName`, `lastName`, `email`, `password`, `profileImageUrl` file)
*   `GET /user-api/articles`
    *   **Description:** Fetches all published, active blog articles by all authors, populating the author's metadata.
*   `PUT /user-api/articles`
    *   **Description:** Adds a text comment to an active article. Pulls the commentator's identity securely from the session token.
    *   **Payload:** `{ "articleId": "article_mongo_id", "comment": "Excellent read!" }`

---

### 3. Author APIs (`/author-api`)
Protected routes exclusively for authors (`AUTHOR` role).

*   `POST /author-api/users`
    *   **Description:** Public endpoint to register new content authors. Operates exactly like user registration but pre-assigns the `AUTHOR` role.
*   `POST /author-api/articles`
    *   **Description:** Saves a new draft or publishes a blog article.
    *   **Payload:** `{ "author": "author_mongo_id", "title": "My Blog Title", "category": "Tech", "content": "Article body..." }`
*   `GET /author-api/articles/:authorId`
    *   **Description:** Retrieves all articles written by a specific author.
*   `PUT /author-api/articles`
    *   **Description:** Modifies title, category, or content of an author's existing article (verifies ownership first).
    *   **Payload:** `{ "articleId": "id", "title": "Updated", "category": "Tech", "content": "New content" }`
*   `PATCH /author-api/articles/:id/status`
    *   **Description:** Soft-deletes or restores an article by toggling its `isArticleActive` boolean flag.
    *   **Payload:** `{ "isArticleActive": false }` (to delete)

---

## 🗄️ Database Schemas & Data Models

Mongoose enforces strict schema definitions, options, and validations on top of MongoDB collections. The primary schemas are defined as follows:

### 1. User Schema (`UserModel.js`)
Defined in [UserModel.js](file:///c:/Users/Renu%20sri/Downloads/BLOG-APP/BLOG-APP/Backend/models/UserModel.js) to manage authentication, role-based controls, and profile metadata.

```javascript
const UserSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email already existed"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  profileImageUrl: {
    type: String,
  },
  role: {
    type: String,
    enum: ["AUTHOR", "USER", "ADMIN"],
    required: [true, "{VALUE} is an invalid role"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,   // Automatically handles createdAt and updatedAt
  strict: "throw",    // Throws a validation error if raw/unmapped fields are saved
  versionKey: false   // Removes Mongoose's internal "__v" property from records
});
```

---

### 2. Article Schema (`ArticleModel.js`)
Defined in [ArticleModel.js](file:///c:/Users/Renu%20sri/Downloads/BLOG-APP/BLOG-APP/Backend/models/ArticleModel.js) to manage article details, soft-delete statuses, and relational comment arrays.

```javascript
const articleSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',                  // Reference key linking to the User model
    required: [true, "Author Id required"]
  },
  title: {
    type: String,
    required: [true, "Title is required"]
  },
  category: {
    type: String,
    required: [true, "Category is required"]
  },
  content: {
    type: String,
    required: [true, "Content is required"]
  },
  comments: [userCommentSchema], // Nested array of comment subdocuments
  isArticleActive: {
    type: Boolean,
    default: true                  // Enables soft-deletion and content toggle
  },
}, {
  timestamps: true,
  strict: "throw",
  versionKey: false
});
```

---

### 3. Nested Comment Schema (`ArticleModel.js`)
Subdocument structure embedded within each Article record to track comments.

```javascript
const userCommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'                   // Reference key linking back to the commenter
  },
  comment: {
    type: String,
    required: true
  }
}, {
  timestamps: true               // Tracks exactly when comments are posted/edited
});
```

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
        return res.status(403).json({ message: "Forbidden. You don't have permission" });
      }
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Session expired. Please login again" });
    }
  };
};
```

### 2. Global Error Handler Middleware
Placed at the end of the middleware chain in `server.js` to securely process unhandled router errors, map validation issues to a `400 Bad Request`, and catch MongoDB key conflicts (Code `11000`) returning a clean `409 Conflict` (e.g. `email "..." already exists`).

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
