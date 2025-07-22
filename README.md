Hesapla E-Commerce Platform 🛍️Hesapla is a full-featured e-commerce platform built with modern technologies, offering a rich experience for both customers and administrators. This project allows users to discover products, add them to their cart, and make secure purchases, while providing administrators with a powerful panel to manage the store with ease.📝 Table of Contents✨ Core FeaturesCustomer-Facing StoreAdmin Panel🛠️ Tech StackFrontendBackendDatabaseServices & Other Tools📂 Project Structure🚀 Setup and LaunchPrerequisitesBackend Setup (Server)Frontend Setup (Client)🔑 Environment Variables (.env)🗺️ API Endpoints🤝 Contributing✨ Core Features🛍️ Customer-Facing StoreAuthentication: Secure registration, login, password reset, and Google Sign-In powered by Firebase.Product Discovery: Advanced search, filtering by category and brand, and sorting by price.Homepage: Dynamically managed product carousels, promotional cards, and banners.Shopping Cart: Cart management for both registered users and guests.Wishlist: Save liked products for later access.Checkout Process: Secure payments with Iyzico integration. Use saved addresses or add new ones.Order Tracking: A user account panel to view current and past orders.Product Reviews: Users can rate and review products they have purchased.Currency Support: View prices in different currencies.Responsive Design: Fully compatible interface for mobile, tablet, and desktop devices.Static Pages: Informational pages like Privacy Policy, Terms of Service, Delivery & Returns.⚙️ Admin PanelSecure Access: Private admin routes accessible only to authorized administrators.Dashboard: Visualization of general statistics on sales, orders, and users.Product Management: Add new products, edit existing ones (stock, price, images, etc.), and delete them.Order Management: View incoming orders and update their status (e.g., processing, shipped).Category and Brand Management: Add, edit, and delete unlimited categories and brands.Coupon Management: Create and manage discount coupons (percentage or fixed amount).Content Management: Dynamically manage homepage sections, promo cards, and side banners.User Management: List users and manage their administrative privileges.Maintenance Mode: Activate or deactivate the site's maintenance mode with a single click.Abandoned Carts: Scheduled jobs to send automatic reminder emails for carts that have been inactive for a certain period.🛠️ Tech StackFrontendReact: For building the user interface.Redux Toolkit: For global state management.React Router DOM: For page routing.Tailwind CSS: For rapid and modern styling.shadcn/ui: For accessible and reusable UI components.Axios: For API requests.Firebase (Client SDK): For user authentication.Vite: For a fast development environment and project bundling.BackendNode.js: Server-side runtime environment.Express.js: Web application framework and API routing.Mongoose: For object modeling with MongoDB.JWT (JSON Web Token): For API security and authorization.Firebase Admin SDK: For server-side user authentication and management.Iyzico: For payment processing integration.Cloudinary: For storing and managing images and media files in the cloud.Nodemailer: For sending emails (order confirmation, password reset, etc.).node-cron: For scheduled tasks (abandoned cart reminders).DatabaseMongoDB: NoSQL database.Services & Other ToolsGit & GitHub: For version control.ESLint / Prettier: For code quality and formatting.📂 Project StructureThe project is organized into two main folders: client (frontend) and server (backend).hesapla/
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
🚀 Setup and LaunchPrerequisitesNode.js (v18.x or higher)npm or yarnMongoDB (local or cloud-based like MongoDB Atlas)Backend Setup (Server)Clone the repository:git clone https://github.com/your-username/hesapla.git
cd hesapla/server
Install dependencies:npm install
Set up environment variables:Copy the .env.example file to a new file named .env and fill in the required fields with your credentials. (See the Environment Variables section for details.)Start the server:npm run dev
The server will start by default at http://localhost:5000.Frontend Setup (Client)Navigate to the client directory:cd ../client
Install dependencies:npm install
Set up environment variables:Copy the .env.local.example file to a new file named .env.local and fill in the required fields.Start the development server:npm run dev
The React application will start at http://localhost:5173.🔑 Environment Variables (.env)For the project to function correctly, the following variables must be defined in the server/.env and client/.env.local files.server/.envPORT=5000
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
IYZIPAY_BASE_URL=https://sandbox-api.iyzipay.com

# Nodemailer (Email)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=...
EMAIL_PASS=...
EMAIL_FROM="Hesapla Support <support@hesapla.com>"
client/.env.localVITE_API_URL=http://localhost:5000

# Firebase Client SDK
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
🗺️ API EndpointsAPI routes are logically grouped under server/routes:/api/auth: User registration, login, and authentication./api/products: Product listing, details, filtering, and search./api/categories: Category listing./api/brands: Brand listing./api/cart: Cart operations (add, remove, update)./api/orders: Order creation and listing user orders./api/wishlist: Wishlist operations./api/reviews: Add and list product reviews./api/address: User address management./api/admin/*: All admin panel operations (product, order, user management, etc.).🤝 ContributingContributions are welcome and will make this project even better! Please follow these steps:Fork this repository.Create a new feature branch (git checkout -b feature/new-amazing-feature).Commit your changes (git commit -m 'feat: Add some amazing feature').Push to the branch (git push origin feature/new-amazing-feature).Open a Pull Request.
