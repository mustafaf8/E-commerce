# E-Commerce Platform 🛍️

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**hesaplı** is a full-featured e-commerce platform built with modern technologies, offering a rich experience for both customers and administrators. This project allows users to discover products, add them to their cart, and make secure purchases, while providing administrators with a powerful panel to manage the store with ease.

---

## 📝 Table of Contents

- [✨ Core Features](#-core-features)
  - [Customer-Facing Store](#️-customer-facing-store)
  - [Admin Panel](#️-admin-panel)
- [🛠️ Tech Stack](#️-tech-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Database](#database)
  - [Services & Other Tools](#services--other-tools)
- [📂 Project Structure](#-project-structure)
- [🚀 Setup and Launch](#-setup-and-launch)
  - [Prerequisites](#prerequisites)
  - [Backend Setup (Server)](#backend-setup-server)
  - [Frontend Setup (Client)](#frontend-setup-client)
- [🔑 Environment Variables (.env)](#-environment-variables-env)
- [🗺️ API Endpoints](#️-api-endpoints)
- [🤝 Contributing](#-contributing)

---

## ✨ Core Features

### 🛍️ Customer-Facing Store

-   **Authentication:** Secure registration, login, password reset, and Google Sign-In powered by Firebase.
-   **Product Discovery:** Advanced search, filtering by category and brand, and sorting by price.
-   **Homepage:** Dynamically managed product carousels, promotional cards, and banners.
-   **Shopping Cart:** Cart management for both registered users and guests.
-   **Wishlist:** Save liked products for later access.
-   **Checkout Process:** Secure payments with Iyzico integration. Use saved addresses or add new ones.
-   **Order Tracking:** A user account panel to view current and past orders.
-   **Product Reviews:** Users can rate and review products they have purchased.
-   **Currency Support:** View prices in different currencies.
-   **Responsive Design:** Fully compatible interface for mobile, tablet, and desktop devices.
-   **Static Pages:** Informational pages like Privacy Policy, Terms of Service, Delivery & Returns.

### ⚙️ Admin Panel

-   **Secure Access:** Private admin routes accessible only to authorized administrators.
-   **Dashboard:** Visualization of general statistics on sales, orders, and users.
-   **Product Management:** Add new products, edit existing ones (stock, price, images, etc.), and delete them.
-   **Order Management:** View incoming orders and update their status (e.g., processing, shipped).
-   **Category and Brand Management:** Add, edit, and delete unlimited categories and brands.
-   **Coupon Management:** Create and manage discount coupons (percentage or fixed amount).
-   **Content Management:** Dynamically manage homepage sections, promo cards, and side banners.
-   **User Management:** List users and manage their administrative privileges.
-   **Maintenance Mode:** Activate or deactivate the site's maintenance mode with a single click.
-   **Abandoned Carts:** Scheduled jobs to send automatic reminder emails for carts that have been inactive for a certain period.

---

## 🛠️ Tech Stack

### Frontend

-   **React:** For building the user interface.
-   **Redux Toolkit:** For global state management.
-   **React Router DOM:** For page routing.
-   **Tailwind CSS:** For rapid and modern styling.
-   **shadcn/ui:** For accessible and reusable UI components.
-   **Axios:** For API requests.
-   **Firebase (Client SDK):** For user authentication.
-   **Vite:** For a fast development environment and project bundling.

### Backend

-   **Node.js:** Server-side runtime environment.
-   **Express.js:** Web application framework and API routing.
-   **Mongoose:** For object modeling with MongoDB.
-   **JWT (JSON Web Token):** For API security and authorization.
-   **Firebase Admin SDK:** For server-side user authentication and management.
-   **Iyzico:** For payment processing integration.
-   **Cloudinary:** For storing and managing images and media files in the cloud.
-   **Nodemailer:** For sending emails (order confirmation, password reset, etc.).
-   **node-cron:** For scheduled tasks (abandoned cart reminders).

### Database

-   **MongoDB:** NoSQL database.

### Services & Other Tools

-   **Git & GitHub:** For version control.
-   **ESLint / Prettier:** For code quality and formatting.

---

## 📂 Project Structure

The project is organized into two main folders: `client` (frontend) and `server` (backend).

```
hesaplı/
├── client/                 # React Frontend Application
│   ├── public/
│   ├── src/
│   │   ├── api/            # Axios instance
│   │   ├── components/     # UI Components (admin, auth, common, shopping-view)
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Page components (admin, auth, shopping-view)
│   │   ├── store/          # Redux Toolkit slices and store
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # Application entry point
│   ├── .env.local.example
│   └── package.json
│
└── server/                 # Node.js Backend Application
    ├── controllers/        # Route business logic
    ├── helpers/            # Helper modules (cloudinary, email, iyzipay)
    ├── jobs/               # Scheduled jobs
    ├── middleware/         # Express middlewares
    ├── models/             # Mongoose schemas
    ├── routes/             # API routes (admin, auth, common, shop)
    ├── utils/              # General utility functions
    ├── .env.example
    ├── server.js           # Server entry point
    └── package.json
```

---

## 🚀 Setup and Launch

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18.x or higher)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   [MongoDB](https://www.mongodb.com/try/download/community) (local or cloud-based like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Backend Setup (Server)

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/hesapla.git](https://github.com/your-username/E-Commerce.git)
    cd hesapla/server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Copy the `.env.example` file to a new file named `.env` and fill in the required fields with your credentials. (See the [Environment Variables](#-environment-variables-env) section for details.)

4.  **Start the server:**
    ```bash
    npm run dev
    ```
    The server will start by default at `http://localhost:5000`.

### Frontend Setup (Client)

1.  **Navigate to the client directory:**
    ```bash
    cd ../client
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Copy the `.env.local.example` file to a new file named `.env.local` and fill in the required fields.

4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The React application will start at `http://localhost:5173`.

---

## 🔑 Environment Variables (.env)

For the project to function correctly, the following variables must be defined in the `server/.env` and `client/.env.local` files.

#### `server/.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=YOUR_SECRET_KEY
CLIENT_URL=http://localhost:5173

# Firebase Admin SDK (in JSON format)
FIREBASE_SERVICE_ACCOUNT_KEY={"type": "service_account", ...}

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Iyzico
IYZIPAY_API_KEY=...
IYZIPAY_SECRET_KEY=...
IYZIPAY_BASE_URL=[https://sandbox-api.iyzipay.com](https://sandbox-api.iyzipay.com)

# Nodemailer (Email)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=...
EMAIL_PASS=...
EMAIL_FROM="Hesapla Support <support@hesapla.com>"
```

#### `client/.env.local`

```env
VITE_API_URL=http://localhost:5000

# Firebase Client SDK
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

---

## 🗺️ API Endpoints

API routes are logically grouped under `server/routes`:

-   `/api/auth`: User registration, login, and authentication.
-   `/api/products`: Product listing, details, filtering, and search.
-   `/api/categories`: Category listing.
-   `/api/brands`: Brand listing.
-   `/api/cart`: Cart operations (add, remove, update).
-   `/api/orders`: Order creation and listing user orders.
-   `/api/wishlist`: Wishlist operations.
-   `/api/reviews`: Add and list product reviews.
-   `/api/address`: User address management.
-   `/api/admin/*`: All admin panel operations (product, order, user management, etc.).

---

## 🤝 Contributing

Contributions are welcome and will make this project even better! Please follow these steps:

1.  **Fork** this repository.
2.  Create a new feature branch (`git checkout -b feature/new-amazing-feature`).
3.  **Commit** your changes (`git commit -m 'feat: Add some amazing feature'`).
4.  **Push** to the branch (`git push origin feature/new-amazing-feature`).
5.  Open a **Pull Request**.

   
<img width="1054" height="486" alt="Ekran görüntüsü 2025-07-22 094430" src="https://github.com/user-attachments/assets/c9fc23b8-29ac-4145-9a9a-704d7b340aff" />
<img width="1041" height="371" alt="Ekran görüntüsü 2025-07-22 094609" src="https://github.com/user-attachments/assets/5cf061e4-3e91-4177-aa19-c4f407892136" />
<img width="1074" height="641" alt="Ekran görüntüsü 2025-07-22 094728" src="https://github.com/user-attachments/assets/406e1f15-e800-4125-affa-38997b30e9bf" />
<img width="1076" height="616" alt="Ekran görüntüsü 2025-07-22 094816" src="https://github.com/user-attachments/assets/7d94f781-5a52-4eeb-ae94-27a73adb6009" />
<img width="717" height="405" alt="Ekran görüntüsü 2025-07-22 095056" src="https://github.com/user-attachments/assets/18310970-b6e2-4af7-b0f6-2df5bf25b3ac" />
