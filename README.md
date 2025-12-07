# Vehicle Rental System

A full-stack application designed to manage vehicle rentals for customers and administrators. The system includes authentication, vehicle management, booking management, and profile handling. The modular structure followed in this project.

🔗 **Live URL:** https://vehicle-rental-system-nu.vercel.app/

---

## 🚀 Features

### 1. Authentication
- Sign In  
- Sign Up  

---

### 2. User Features
- Update own profile  
- Create booking  
- Update own booking (allowed before the `rent_start_date`)  

---

### 3. Vehicle Management
- Create vehicle (Admin & User)  
- View all vehicles (Public)  
- View vehicle details (Public)  
- Update vehicle  
  - Admin → All vehicles  
  - User → Own vehicles  
- Delete vehicle (only when vehicle is not booked)

---

### 4. Booking Management
- Create booking  
  - Customer → Own bookings  
  - Admin → All bookings  
- View bookings  
  - Admin → All bookings  
  - Customer → Own bookings  
- Update bookings  
  - Admin → All bookings  
  - Customer → Own bookings  
  - When a booking is **cancelled** or **returned**, the vehicle status automatically becomes **available**

---
### 5. Auto Booking Expire system
- when today's date cross the return date. The bookings auto going to returned mode and also Vehicle satus will available state.
---
## 🧰 Technology Stack

### Backend
- Node.js  
- TypeScript  
- Express.js  

### Database
- Neon  
- PostgreSQL  

### Authentication & Security
- bcryptjs  
- JSON Web Tokens (JWT)

### Deployment
- Vercel  

---

## 📦 Setup & Installation
- Clone the git repo
- init npm package
- install tsx, typescript, express, dotenv, pg, bcryptjs, jsonwebtoken
- npm run dev
---
##🌐 Usage
-You may run this project locally or directly use the live deployment:

🔗 **Live URL:** https://vehicle-rental-system-nu.vercel.app/
