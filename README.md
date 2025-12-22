# Vehicle Rental System

A Backend application designed to manage vehicle rentals for customers and administrators. The system includes authentication, vehicle management, booking management, and profile handling. The modular structure followed in this project.

---

## 🚀 Features

## 🔐 Authentication

- **POST** `/api/v1/auth/signup`  
  Register a new user  
  **Access:** Public

- **POST** `/api/v1/auth/signin`  
  User login with JWT generation  
  **Access:** Public

---

## 🚗 Vehicles

- **POST** `/api/v1/vehicles`  
  Create a new vehicle  
  **Access:** Admin, User

- **GET** `/api/v1/vehicles`  
  Retrieve all vehicles  
  **Access:** Public

- **GET** `/api/v1/vehicles/:vehicleId`  
  Retrieve a specific vehicle  
  **Access:** Public

- **PUT** `/api/v1/vehicles/:vehicleId`  
  Update a vehicle  
  **Access Rules:**  
  - Admin: Can update any vehicle  
  - User: Can update only vehicles they own

- **DELETE** `/api/v1/vehicles/:vehicleId`  
  Delete a vehicle  
  **Access:** Admin only  
  **Restriction:** Vehicle must have no active bookings

---

## 👤 Users

- **GET** `/api/v1/users`  
  Retrieve all users  
  **Access:** Admin only

- **PUT** `/api/v1/users/:userId`  
  Update user profile  
  **Access Rules:**  
  - Admin: Can update any user  
  - User: Can update only their own profile

- **DELETE** `/api/v1/users/:userId`  
  Delete a user  
  **Access:** Admin only  
  **Restriction:** User must have no active bookings

---

## 📅 Bookings

- **POST** `/api/v1/bookings`  
  Create a booking  
  **Access:** Customer, Admin

- **GET** `/api/v1/bookings`  
  Retrieve bookings  
  **Access Rules:**  
  - Admin: View all bookings  
  - Customer: View only their own bookings

- **PUT** `/api/v1/bookings/:bookingId`  
  Update a booking  
  **Access:** Role-based  
  **Restriction:** Allowed only before the rental start date

### Auto Booking Expire system
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
## 🌐 Usage
- You may run this project locally or directly use the live deployment:

🔗 **Live URL:** https://vehicle-rental-system-nu.vercel.app/
