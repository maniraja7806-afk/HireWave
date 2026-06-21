# HireWave - On-Demand Home Services Platform

HireWave is a full-stack, responsive, on-demand home service marketplace tailored specifically for all 35+ districts in Tamil Nadu. The platform seamlessly connects customers with verified local professionals for a variety of domestic services, from AC repair and plumbing to deep home cleaning and electrical fixes.

## 🌟 Key Features

*   **Extensive Regional Coverage:** Deep integration across all Tamil Nadu districts, ensuring service providers are easily discoverable near the user's location.
*   **Role-Based Access:** Distinct interfaces and permissions for Customers, Service Providers, and Administrators.
*   **Intelligent Search & Filtering:** Quickly locate professionals using parameters like District, City, Area, Pincode, and Service Category.
*   **Robust Booking Engine:** A full booking lifecycle management system allowing providers to Accept, Reject, or Mark Completed, while customers can Cancel, Rate, and Review.
*   **Modern UI/UX:** Built with a polished design system featuring smooth Framer Motion animations and full Dark Mode support.
*   **Real Database Integration:** Powered by MongoDB Atlas for secure, persistent data storage.

## 🌟 Non-Technical Overview (The Business Use Case)

Finding reliable, vetted local professionals for home services is often disorganized and relies heavily on word-of-mouth. HireWave elegantly solves this by providing a hyper-localized digital marketplace.

*   **For Customers:** A secure, intuitive platform to browse, filter, and book local mechanics, plumbers, and electricians based on their exact district, area, or pincode. Customers can verify quality through transparent community reviews.
*   **For Service Providers:** A free digital storefront that acts as a lead-generation tool, allowing local experts to list their trade, set their availability, and manage booking requests directly from their phone or computer.
*   **For the Platform (Admins):** A centralized dashboard to oversee operations, ensure platform safety, and manage the user ecosystem across all regions.

## ⚙️ Technical Architecture

HireWave is constructed as a modern, decoupled Monorepo (Full-Stack SPA):

*   **Frontend Client:** Built as a Single Page Application (SPA) using **React 18** and **Vite**. State is managed cleanly using React Context and custom hooks. The UI is built mobile-first utilizing **Tailwind CSS** for responsive design and **Framer Motion** for polished, accessible micro-interactions.
*   **Backend API Server:** A **Node.js** runtime running **Express.js** architecture, providing a secure RESTful API interface for the client. The backend code is written entirely in **TypeScript** and compiled rapidly using ESBuild for production.
*   **Database & Storage:** Powered by a **MongoDB Atlas** NoSQL cloud cluster. Interaction is strictly validated using **Mongoose ODM** schemas to guarantee data integrity across highly relational collections (Users, Services, Bookings, Reviews, Favorites).
*   **Security layer:** Authentication is handled statelessly via **JSON Web Tokens (JWT)**. Passwords are never stored in plaintext and are salted/hashed via **Bcrypt**.

## 🛠️ Technology Stack

*   **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, React Router, Lucide Icons.
*   **Backend:** Express.js, TypeScript, JSON Web Tokens (JWT) for authentication.
*   **Database:** MongoDB Atlas, Mongoose ODM.

## 🚀 Getting Started Locally

Follow these steps to run the application locally on your machine.

### 1. Prerequisites

Ensure you have Node.js (v18+) installed. You will also need a MongoDB Atlas cluster URI.

### 2. Environment Setup

*   Clone the repository.
*   Rename the `.env.example` file to `.env` (or create a new `.env` file).
*   Add your MongoDB connection string to the `.env` file:
    ```env
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/hirewave?retryWrites=true&w=majority
    JWT_SECRET=super-secret-jwt-key
    PORT=3000
    ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Generate Seed Data (Optional but Recommended)

To populate the database with realistic providers, customers, and bookings across Tamil Nadu, run the seed script:

```bash
npm run seed
```

### 5. Run the Local Server

Start the integrated development environment:

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

## ☁️ Deployment (Railway)

Railway is an excellent platform for hosting full-stack node applications like HireWave. Follow these steps to deploy:

### 1. Push to GitHub
Make sure your project source code is pushed to a GitHub repository.

### 2. Connect Railway to GitHub
1. Go to [Railway.app](https://railway.app) and sign up/log in.
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select your `HireWave` repository and deploy.

### 3. Configure Environment Variables
1. Once the project is created in Railway, go to the deployment's **Variables** tab.
2. Add the exact same variables you have in your local `.env` file:
   *   `MONGODB_URI`: (Your production MongoDB Atlas connection string)
   *   `JWT_SECRET`: (A secure random string)
   *   `NODE_ENV`: `production`

### 4. Verify Build and Start Commands
Railway automatically runs `npm install` and your `npm run build` script. It will then boot your app using `npm start`. Ensure your `package.json` scripts match:
```json
"scripts": {
    "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
    "start": "NODE_ENV=production node dist/server.cjs"
}
```

### 5. Access your Live Website
1. Go to the **Settings** tab of your Railway deployment.
2. Under "Networking" or "Public Networking", click **Generate Domain**.
3. Your app is now live at the generated URL!

## 📝 Default Test Accounts

If you ran the seed script, you can use these credentials to explore the core dashboards:

*   **Customer:** `john.doe@example.com` / `password123`
*   **Provider:** `karthik.rajan@example.com` / `password123` (or any manually generated provider email)
*   **Admin:** `admin@hirewave.com` / `admin123`
