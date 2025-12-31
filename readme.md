# Vendor Authentication & Product Approval Module

## Overview
This is a full-stack MERN application (MongoDB, Express.js, React.js, Node.js) designed to handle vendor authentication and product management. It features secure email/password login, Google OAuth integration, role-based access control, and a product approval workflow where vendors submit products for admin approval.

## Tech Stack

### Frontend
- **React.js**: Functional components, Hooks, Context API.
- **Tailwind CSS**: Utility-first CSS framework for modern, responsive UI.
- **Axios**: For HTTP requests.
- **React Router DOM**: Client-side routing.
- **Lucide React**: Icons.

### Backend
- **Node.js & Express.js**: RESTful API server.
- **MongoDB & Mongoose**: NoSQL database and object modeling.
- **Cloudinary**: Cloud-based image storage and management.
- **Authentication**:
    - **Passport.js**: Google OAuth strategy.
    - **JWT (JSON Web Tokens)**: Secure session handling.
    - **Bcryptjs**: Password hashing.

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas)
- Google Cloud Console Project (for OAuth keys)
- Cloudinary Account (for image uploads)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=http://localhost:3000
   BACKEND_URL=http://localhost:5000
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the `frontend` directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```
4. Start the application:
   ```bash
   npm start
   ```

## API Routes Explanation

### Authentication (`/api/vendor`)
- **POST /signup**: Register a new vendor with name, email, phone, and password.
- **POST /login**: Authenticate vendor/admin and return JWT token.
- **GET /auth/google**: Initiate Google OAuth login.
- **GET /auth/google/callback**: Google OAuth callback URL.
- **GET /me**: Get current authenticated user details.

### Products (`/api/product`)
- **POST /add**: Submit a new product (Vendor only). Requires `name`, `description`, `price`, `category`, and `image` (base64 encoded, optional). Images are automatically uploaded to Cloudinary.
- **GET /vendor/:vendorId**: Fetch all products submitted by a specific vendor.

### Admin (`/api/admin`)
- **GET /products/pending**: Fetch all products with status `pending`.
- **PUT /product/:id**: Approve or Reject a product. Body: `{ "status": "approved" | "rejected" }`.

## Security & Access Control

### Protected Routes
The application uses strict route protection mechanisms to ensure data security:
- **`ProtectedRoute`**: Wraps vendor-specific routes (e.g., Dashboard, Add Product). Checks for a valid JWT token in local storage. Redirects unauthorized users to the login page.
- **`ProtectedAdmin`**: Wraps admin-specific routes (e.g., Admin Dashboard). Verifies the user's role is `admin` in addition to checking the token. Non-admin users attempting to access these routes are redirected to the home page or login.

### Error Handling
- **404 Not Found**: A custom "Page Not Found" component handles all undefined URLs, providing a user-friendly interface and a quick link back to the login/home page.

## Folder Structure
```
/
├── backend/            # Express.js Server
│   ├── src/
│   │   ├── config/     # Passport, DB & Cloudinary config
│   │   ├── models/     # Mongoose Schemas (Vendor, Product)
│   │   ├── routes/     # API Routes
│   │   ├── middlewares/# Auth & Access Control
│   │   └── server.js   # Entry point
│   └── package.json
│
└── frontend/           # React Application
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── pages/      # Application Pages (Login, Dashboard, etc.)
    │   ├── services/   # API configuration
    │   └── App.js      # Main Routing
    └── package.json
```
