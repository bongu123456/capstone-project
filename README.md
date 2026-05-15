# Blog App

A full-stack Blog Application built with the MERN stack (MongoDB, Express.js, React, Node.js). This project allows users to read articles, and authors to create, manage, and publish their articles.

## Tech Stack & Packages

### Frontend (React + Vite)
- **Framework**: React 19 (via Vite)
- **Routing**: `react-router` & `react-router-dom`
- **State Management**: `zustand`
- **HTTP Client**: `axios`
- **Styling**: `tailwindcss` & `@tailwindcss/vite`
- **Forms**: `react-hook-form`
- **Notifications**: `react-hot-toast`

### Backend (Node.js + Express)
- **Framework**: `express`
- **Database**: `mongoose` (MongoDB ORM)
- **Authentication**: `jsonwebtoken` (JWT), `bcryptjs` (Password Hashing), `cookie-parser`
- **Security**: `cors`
- **Environment Management**: `dotenv`
- **File Uploads**: `multer`, `cloudinary`

---

## Database Schemas

### User Schema (`UserModel.js`)
Stores user, author, and admin information.
- `firstName` (String, required)
- `lastName` (String)
- `email` (String, required, unique)
- `password` (String, required)
- `profileImageUrl` (String)
- `role` (String, enum: `["AUTHOR", "USER", "ADMIN"]`, required)
- `isActive` (Boolean, default: `true`)
- *Timestamps enabled (createdAt, updatedAt)*

### Article Schema (`ArticleModel.js`)
Stores articles written by authors and comments by users.
- `author` (ObjectId referencing `user`, required)
- `title` (String, required)
- `category` (String, required)
- `content` (String, required)
- `comments` (Array of Comment Schema objects):
  - `user` (ObjectId referencing `user`)
  - `comment` (String, required)
  - *Timestamps enabled*
- `isArticleActive` (Boolean, default: `true`)
- *Timestamps enabled (createdAt, updatedAt)*

---

## Cloning the Repository

To get the project on your local machine, run:

```bash
git clone <your-repository-url>
cd BLOG-APP
```

---

## Installation & Running the App

### 1. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

**Environment Variables**
Create a `.env` file inside the `backend` directory with the following keys:
```env
DB_URL=your_mongodb_connection_string
PORT=4000
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

**Start the Backend Server**
```bash
# Standard start
node server.js

# For auto-reloading during development
npx nodemon server.js
```
The backend will run on `http://localhost:4000`.

### 2. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

**Start the Frontend Server**
```bash
npm run dev
```
The frontend will typically run on `http://localhost:5173` or `5174`. 

### Summary
1. Start MongoDB / Ensure connection string in `.env` is correct.
2. Run `nodemon server.js` in `/backend`.
3. Run `npm run dev` in `/frontend`.
4. Open the frontend URL in your browser to view the application!
