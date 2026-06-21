# HireWave - On-Demand Home Services Platform

HireWave is a full-stack, responsive, on-demand home service marketplace tailored specifically for all 35+ districts in Tamil Nadu. The platform seamlessly connects customers with verified local professionals for a variety of domestic services, from AC repair and plumbing to deep home cleaning and electrical fixes.

## 🌟 Key Features

*   **Extensive Regional Coverage:** Deep integration across all Tamil Nadu districts, ensuring service providers are easily discoverable near the user's location.
*   **Role-Based Access:** Distinct interfaces and permissions for Customers, Service Providers, and Administrators.
*   **Intelligent Search & Filtering:** Quickly locate professionals using parameters like District, City, Area, Pincode, and Service Category.
*   **Robust Booking Engine:** A full booking lifecycle management system allowing providers to Accept, Reject, or Mark Completed, while customers can Cancel, Rate, and Review.
*   **Seamless Navigation:** Features breadcrumbs, universal back-button support, and a responsive mobile bottom navigation bar ensuring context and session data are preserved.
*   **Modern UI/UX:** Built with a polished design system featuring smooth Framer Motion animations and full Dark Mode support.

## 🛠️ Technology Stack

*   **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, React Router, Lucide Icons.
*   **Backend:** Express.js, Node.js, JSON Web Tokens (JWT) for authentication.
*   **Data & Persistence:** In-memory local file-based database (`seed-data.json`) utilizing automated seed generation scripts for instant, configuration-free local execution.

## 🚀 Getting Started

Follow these steps to run the application locally.

### 1. Install Dependencies

Ensure you have Node.js installed, then install the required packages:

```bash
npm install
```

### 2. Generate Seed Data (Important)

The backend relies on an auto-generated JSON file to simulate realistic database records (spanning 1000+ providers across Tamil Nadu, bookings, and user accounts). Generate it by running:

```bash
npm run seed
# Or manually via: npx tsx src/server/seed.ts
```

### 3. Run the Development Server

Start the integrated client and server environment:

```bash
npm run dev
```

The application will be accessible via `http://localhost:3000`.

### 4. Build for Production

To create a highly optimized production bundle:

```bash
npm run build
```

Then, you can start the production server with:

```bash
npm start
```

## 📝 Default Test Accounts (Generated via Seed)

You can use these credentials to explore the different dashboards:

*   **Customer:** `john.doe@example.com` / `password123`
*   **Provider:** `karthik.rajan@example.com` / `password123` (or any generated provider email)
*   **Admin:** `admin@hirewave.com` / `admin123`
