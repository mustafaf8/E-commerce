Eazypay E-Commerce Platform 🛍️
Eazypay is a full-featured e-commerce platform built with modern technologies, offering a rich experience for both customers and administrators. This project allows users to discover products, add them to their cart, and make secure purchases, while providing administrators with a powerful panel to manage the store with ease.

📝 Table of Contents
✨ Core Features

Customer-Facing Store

Admin Panel

🛠️ Tech Stack

Frontend

Backend

Database

Services & Other Tools

📂 Project Structure

🚀 Setup and Launch

Prerequisites

Backend Setup (Server)

Frontend Setup (Client)

🔑 Environment Variables (.env)

🗺️ API Endpoints

🤝 Contributing

✨ Core Features
🛍️ Customer-Facing Store
Authentication: Secure registration, login, password reset, and Google Sign-In powered by Firebase.

Product Discovery: Advanced search, filtering by category and brand, and sorting by price.

Homepage: Dynamically managed product carousels, promotional cards, and banners.

Shopping Cart: Cart management for both registered users and guests.

Wishlist: Save liked products for later access.

Checkout Process: Secure payments with Iyzico integration. Use saved addresses or add new ones.

Order Tracking: A user account panel to view current and past orders.

Product Reviews: Users can rate and review products they have purchased.

Currency Support: View prices in different currencies.

Responsive Design: Fully compatible interface for mobile, tablet, and desktop devices.

Static Pages: Informational pages like Privacy Policy, Terms of Service, Delivery & Returns.

⚙️ Admin Panel
Secure Access: Private admin routes accessible only to authorized administrators.

Dashboard: Visualization of general statistics on sales, orders, and users.

Product Management: Add new products, edit existing ones (stock, price, images, etc.), and delete them.

Order Management: View incoming orders and update their status (e.g., processing, shipped).

Category and Brand Management: Add, edit, and delete unlimited categories and brands.

Coupon Management: Create and manage discount coupons (percentage or fixed amount).

Content Management: Dynamically manage homepage sections, promo cards, and side banners.

User Management: List users and manage their administrative privileges.

Maintenance Mode: Activate or deactivate the site's maintenance mode with a single click.

Abandoned Carts: Scheduled jobs to send automatic reminder emails for carts that have been inactive for a certain period.

🛠️ Tech Stack
Frontend
React: For building the user interface.

Redux Toolkit: For global state management.

React Router DOM: For page routing.

Tailwind CSS: For rapid and modern styling.

shadcn/ui: For accessible and reusable UI components.

Axios: For API requests.

Firebase (Client SDK): For user authentication.

Vite: For a fast development environment and project bundling.

Backend
Node.js: Server-side runtime environment.

Express.js: Web application framework and API routing.

Mongoose: For object modeling with MongoDB.

JWT (JSON Web Token): For API security and authorization.

Firebase Admin SDK: For server-side user authentication and management.

Iyzico: For payment processing integration.

Cloudinary: For storing and managing images and media files in the cloud.

Nodemailer: For sending emails (order confirmation, password reset, etc.).

node-cron: For scheduled tasks (abandoned cart reminders).

Database
MongoDB: NoSQL database.

Services & Other Tools
Git & GitHub: For version control.

ESLint / Prettier: For code quality and formatting.

📂 Project Structure
The project is organized into two main folders: client (frontend) and server (backend).

e-commerce /
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

🚀 Setup and Launch
Prerequisites
Node.js (v18.x or higher)

npm or yarn

MongoDB (local or cloud-based like MongoDB Atlas)

Backend Setup (Server)
Clone the repository:

git clone https://github.com/your-username/hesapla.git
cd hesapla/server

Install dependencies:

npm install

Set up environment variables:
Copy the .env.example file to a new file named .env and fill in the required fields with your credentials. (See the Environment Variables section for details.)

Start the server:

npm run dev

The server will start by default at http://localhost:5000.

Frontend Setup (Client)
Navigate to the client directory:

cd ../client

Install dependencies:

npm install

Set up environment variables:
Copy the .env.local.example file to a new file named .env.local and fill in the required fields.

Start the development server:

npm run dev

The React application will start at http://localhost:5173.

🔑 Environment Variables (.env)
For the project to function correctly, the following variables must be defined in the server/.env and client/.env.local files.

server/.env
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
IYZIPAY_BASE_URL=https://sandbox-api.iyzipay.com

# Nodemailer (Email)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=...
EMAIL_PASS=...
EMAIL_FROM="Hesapla Support <support@hesapla.com>"

client/.env.local
VITE_API_URL=http://localhost:5000

# Firebase Client SDK
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

🗺️ API Endpoints
API routes are logically grouped under server/routes:

/api/auth: User registration, login, and authentication.

/api/products: Product listing, details, filtering, and search.

/api/categories: Category listing.

/api/brands: Brand listing.

/api/cart: Cart operations (add, remove, update).

/api/orders: Order creation and listing user orders.

/api/wishlist: Wishlist operations.

/api/reviews: Add and list product reviews.

/api/address: User address management.

/api/admin/*: All admin panel operations (product, order, user management, etc.).

🤝 Contributing
Contributions are welcome and will make this project even better! Please follow these steps:

Fork this repository.

Create a new feature branch (git checkout -b feature/new-amazing-feature).

Commit your changes (git commit -m 'feat: Add some amazing feature').

Push to the branch (git push origin feature/new-amazing-feature).

Open a Pull Request.
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eazypay  E-Commerce Platform Infographic</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f0f4f8;
        }
        .chart-container {
            position: relative;
            width: 100%;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            height: 350px;
            max-height: 400px;
        }
        @media (min-width: 768px) {
            .chart-container {
                height: 400px;
            }
        }
        .flow-box {
            border: 2px solid #e2e8f0;
            background-color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            text-align: center;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            flex-grow: 1;
        }
        .flow-arrow {
            font-size: 2rem;
            color: #64748b;
            margin: 0 1rem;
        }
        .tech-badge {
            display: inline-block;
            background-color: #e0e7ff;
            color: #3730a3;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-weight: 500;
            margin: 0.25rem;
            font-size: 0.875rem;
        }
    </style>
</head>
<body class="text-gray-800">

    <div class="container mx-auto p-4 md:p-8">

        <header class="text-center mb-12">
            <h1 class="text-4xl md:text-5xl font-extrabold text-[#003f5c] mb-2">Eazypay E-Commerce Platform</h1>
            <p class="text-lg text-gray-600 max-w-3xl mx-auto">A deep-dive into the architecture, features, and technology of a modern, full-featured e-commerce solution.</p>
        </header>

        <main class="space-y-16">

            <section id="architecture" class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h2 class="text-3xl font-bold text-center mb-2 text-[#2f4b7c]">System Architecture Overview</h2>
                <p class="text-center text-gray-600 mb-8">A decoupled client-server model ensures scalability and maintainability.</p>
                <div class="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0">
                    <div class="flow-box">
                        <h3 class="font-bold text-xl">Client (React SPA)</h3>
                        <p class="text-sm text-gray-500">User Interface & Experience</p>
                    </div>
                    <div class="flow-arrow transform md:rotate-0 rotate-90">➔</div>
                    <div class="flow-box">
                        <h3 class="font-bold text-xl">API (Node.js & Express)</h3>
                        <p class="text-sm text-gray-500">Business Logic & Routing</p>
                    </div>
                    <div class="flow-arrow transform md:rotate-0 rotate-90">➔</div>
                    <div class="flow-box">
                        <h3 class="font-bold text-xl">Database (MongoDB)</h3>
                        <p class="text-sm text-gray-500">Data Persistence</p>
                    </div>
                    <div class="flow-arrow transform md:rotate-0 rotate-90">➔</div>
                    <div class="flow-box">
                        <h3 class="font-bold text-xl">External Services</h3>
                        <p class="text-sm text-gray-500">Payments, Auth, Email</p>
                    </div>
                </div>
            </section>
            
            <section id="tech-stack">
                <h2 class="text-3xl font-bold text-center mb-8 text-[#2f4b7c]">Technology Stack</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div class="bg-white rounded-2xl shadow-lg p-6">
                        <h3 class="text-2xl font-bold mb-4 text-[#665191]">Frontend</h3>
                        <div>
                            <span class="tech-badge">React</span>
                            <span class="tech-badge">Redux Toolkit</span>
                            <span class="tech-badge">Vite</span>
                            <span class="tech-badge">Tailwind CSS</span>
                            <span class="tech-badge">shadcn/ui</span>
                            <span class="tech-badge">Axios</span>
                        </div>
                    </div>
                    <div class="bg-white rounded-2xl shadow-lg p-6">
                        <h3 class="text-2xl font-bold mb-4 text-[#a05195]">Backend</h3>
                        <div>
                            <span class="tech-badge">Node.js</span>
                            <span class="tech-badge">Express.js</span>
                            <span class="tech-badge">Mongoose</span>
                            <span class="tech-badge">JWT</span>
                            <span class="tech-badge">node-cron</span>
                        </div>
                    </div>
                    <div class="bg-white rounded-2xl shadow-lg p-6 md:col-span-2 lg:col-span-1">
                        <h3 class="text-2xl font-bold mb-4 text-[#d45087]">Database & Services</h3>
                        <div>
                            <span class="tech-badge">MongoDB</span>
                            <span class="tech-badge">Firebase</span>
                            <span class="tech-badge">Cloudinary</span>
                            <span class="tech-badge">Iyzico</span>
                            <span class="tech-badge">Nodemailer</span>
                        </div>
                    </div>
                </div>
            </section>
            
            <section id="customer-features">
                <h2 class="text-3xl font-bold text-center mb-8 text-[#2f4b7c]">The Customer Experience</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div class="bg-white rounded-2xl shadow-lg p-6">
                        <h3 class="text-2xl font-bold mb-2 text-center text-[#f95d6a]">Feature Distribution</h3>
                        <p class="text-center text-gray-600 mb-4">Core functionalities are balanced between shopping, account management, and discovery.</p>
                        <div class="chart-container h-[300px] md:h-[350px]">
                            <canvas id="customerFeaturesChart"></canvas>
                        </div>
                    </div>
                    <div class="bg-white rounded-2xl shadow-lg p-6">
                        <h3 class="text-2xl font-bold mb-4 text-[#f95d6a]">Key User-Facing Features</h3>
                        <ul class="list-disc list-inside space-y-3 text-gray-700">
                            <li><span class="font-semibold">Seamless Authentication:</span> Secure login and registration with Firebase, including Google Sign-In.</li>
                            <li><span class="font-semibold">Advanced Product Discovery:</span> Powerful search and filtering capabilities to find products quickly.</li>
                             <li><span class="font-semibold">Guest & User Carts:</span> Persistent shopping cart for both guest visitors and registered users.</li>
                            <li><span class="font-semibold">Secure Checkout:</span> Integrated with Iyzico for reliable and secure payment processing.</li>
                            <li><span class="font-semibold">Personalized Account:</span> Manage orders, addresses, and wishlist from a dedicated user dashboard.</li>
                            <li><span class="font-semibold">Responsive Design:</span> A flawless experience across all devices, from mobile to desktop.</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section id="admin-features">
                <h2 class="text-3xl font-bold text-center mb-8 text-[#2f4b7c]">The Admin Powerhouse</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                     <div class="bg-white rounded-2xl shadow-lg p-6 order-2 md:order-1">
                        <h3 class="text-2xl font-bold mb-4 text-[#ff7c43]">Comprehensive Control Panel</h3>
                        <ul class="list-disc list-inside space-y-3 text-gray-700">
                            <li><span class="font-semibold">Full Product Management:</span> Create, read, update, and delete products with detailed attributes.</li>
                            <li><span class="font-semibold">Order Processing:</span> View and manage all customer orders, updating statuses from a central hub.</li>
                             <li><span class="font-semibold">Dynamic Content Control:</span> Manage homepage content, promotions, and banners without code changes.</li>
                            <li><span class="font-semibold">User & Coupon Management:</span> Oversee user roles and create targeted discount campaigns.</li>
                            <li><span class="font-semibold">Site Maintenance:</span> Easily toggle maintenance mode for the entire website.</li>
                            <li><span class="font-semibold">Automated Jobs:</span> Backend cron jobs handle tasks like abandoned cart reminders automatically.</li>
                        </ul>
                    </div>
                    <div class="bg-white rounded-2xl shadow-lg p-6 order-1 md:order-2">
                        <h3 class="text-2xl font-bold mb-2 text-center text-[#ff7c43]">Admin Management Scope</h3>
                        <p class="text-center text-gray-600 mb-4">The admin panel provides 360-degree control over the entire platform.</p>
                        <div class="chart-container h-[300px] md:h-[350px]">
                            <canvas id="adminFeaturesChart"></canvas>
                        </div>
                    </div>
                </div>
            </section>
            
            <section id="codebase">
                <h2 class="text-3xl font-bold text-center mb-8 text-[#2f4b7c]">Codebase Insights</h2>
                <div class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    <h3 class="text-2xl font-bold mb-2 text-center text-[#ffa600]">Project File Distribution</h3>
                    <p class="text-center text-gray-600 mb-4">A look at the modular organization of the backend and frontend codebases.</p>
                    <div class="chart-container h-[400px] md:h-[500px]">
                        <canvas id="codebaseChart"></canvas>
                    </div>
                </div>
            </section>

        </main>

        <footer class="text-center mt-16 text-gray-500">
            <p>Infographic generated for the Eazypay E-Commerce Platform.</p>
        </footer>

    </div>

    <script>
        const FONT_COLOR = '#1f2937';
        const GRID_COLOR = '#e5e7eb';
        const PALETTE = ['#2f4b7c', '#665191', '#a05195', '#d45087', '#f95d6a', '#ff7c43', '#ffa600'];

        function wrapLabel(str, maxWidth) {
            if (str.length <= maxWidth) {
                return str;
            }
            const words = str.split(' ');
            const lines = [];
            let currentLine = '';
            for (const word of words) {
                if ((currentLine + word).length > maxWidth) {
                    lines.push(currentLine.trim());
                    currentLine = '';
                }
                currentLine += word + ' ';
            }
            lines.push(currentLine.trim());
            return lines.filter(line => line.length > 0);
        }

        const tooltipTitleCallback = {
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            const item = tooltipItems[0];
                            let label = item.chart.data.labels[item.dataIndex];
                            if (Array.isArray(label)) {
                                return label.join(' ');
                            }
                            return label;
                        }
                    }
                }
            }
        };

        const customerFeaturesCtx = document.getElementById('customerFeaturesChart').getContext('2d');
        new Chart(customerFeaturesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Product Discovery & Search', 'Shopping Cart & Checkout', 'User Account & Auth', 'Content & Pages'],
                datasets: [{
                    label: 'Customer Features',
                    data: [35, 30, 25, 10],
                    backgroundColor: PALETTE,
                    borderColor: '#ffffff',
                    borderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    ...tooltipTitleCallback.plugins,
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: FONT_COLOR,
                            font: { size: 12 }
                        }
                    }
                }
            }
        });

        const adminFeaturesCtx = document.getElementById('adminFeaturesChart').getContext('2d');
        new Chart(adminFeaturesCtx, {
            type: 'radar',
            data: {
                labels: ['Product Mgmt', 'Order Mgmt', 'User Mgmt', 'Content Mgmt', 'Statistics', 'Coupon Mgmt'],
                datasets: [{
                    label: 'Admin Control',
                    data: [95, 90, 80, 85, 75, 90],
                    backgroundColor: 'rgba(255, 124, 67, 0.2)',
                    borderColor: 'rgba(255, 124, 67, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(255, 124, 67, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(255, 124, 67, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                 plugins: {
                    ...tooltipTitleCallback.plugins,
                    legend: {
                       display: false
                    }
                },
                scales: {
                    r: {
                        angleLines: { color: GRID_COLOR },
                        grid: { color: GRID_COLOR },
                        pointLabels: {
                            color: FONT_COLOR,
                            font: { size: 12 }
                        },
                        ticks: {
                            backdropColor: 'rgba(255, 255, 255, 0.75)',
                            color: FONT_COLOR
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }
            }
        });

        const codebaseCtx = document.getElementById('codebaseChart').getContext('2d');
        const rawLabels = [
            'Frontend Components', 'Frontend Pages', 'Frontend Redux Store',
            'Backend Controllers', 'Backend Models', 'Backend Routes'
        ];
        new Chart(codebaseCtx, {
            type: 'bar',
            data: {
                labels: rawLabels.map(label => wrapLabel(label, 16)),
                datasets: [{
                    label: 'Backend Files',
                    data: [0, 0, 0, 25, 16, 21],
                    backgroundColor: '#665191',
                    borderRadius: 4,
                }, {
                    label: 'Frontend Files',
                    data: [52, 35, 20, 0, 0, 0],
                    backgroundColor: '#d45087',
                    borderRadius: 4,
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    ...tooltipTitleCallback.plugins,
                    legend: {
                        position: 'top',
                        labels: {
                            color: FONT_COLOR
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        grid: {
                            color: GRID_COLOR
                        },
                        ticks: {
                            color: FONT_COLOR
                        }
                    },
                    y: {
                        stacked: true,
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: FONT_COLOR,
                            font: { size: 12 }
                        }
                    }
                }
            }
        });
    </script>
</body>
</html>
