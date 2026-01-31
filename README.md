# 🚗 Vehicle Rental System API

A backend REST API for a **Vehicle Rental System** built with **Node.js, Express, TypeScript, and PostgreSQL**.
It supports **role-based access control**, vehicle management, bookings, and automatic business rules for rentals.

---

## 🔗 Live Links

* **Live API:**
   [https://vehicle-rental-system-qns4.onrender.com](https://vehicle-rental-system-qns4.onrender.com)

---

## 🧩 Features

### 👤 Authentication & Authorization

* JWT-based authentication
* Role-based access control:

  * **Admin**
  * **Customer**

---

### 🚘 Vehicle Management

* Create vehicle (Admin only)
* Get all vehicles
* Update vehicle (Admin only)
* Delete vehicle (Admin only)

  * ❌ Cannot delete a vehicle if it has **active bookings**

---

### 📅 Booking Management

* Create booking (Admin & Customer)
* Get bookings:

  * Admin → sees all bookings
  * Customer → sees own bookings only
* Update booking status:

  * Customer → can **cancel** booking (before start date)
  * Admin → can **mark booking as returned**
* Booking price auto-calculation:

  ```
  total_price = daily_rent_price × number_of_days
  ```

---

### 🔄 Business Rules

* Vehicle availability updates automatically:

  * On booking → `booked`
  * On cancel/return → `available`
* Booking constraints:

  * Cannot book unavailable vehicles
  * Cannot cancel after rent start date
* Users cannot be deleted if they have **active bookings**

---

## 🛠 Tech Stack

* **Backend:** Node.js, Express.js
* **Language:** TypeScript
* **Database:** PostgreSQL
* **Auth:** JWT
* **ORM/DB Client:** pg
* **Tools:** Postman, Git, GitHub

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```
PORT=5050
CONNECTION_STR=postgresql://username:password@host:port/dbname
JWT_SECRET=your_jwt_secret
```

---

## 🚀 Installation & Run

```bash
# Clone the repository
git clone https://github.com/Sani-Mohibur/vehicle-rental-system.git

# Go to project directory
cd vehicle-rental-system

# Install dependencies
npm install

# Run in development
npm run dev

# Build
npm run build

# Run production
npm start
```

---

## 📌 API Documentation

All API endpoints, request bodies, and responses are documented here:  
 **Postman Docs:** [https://documenter.getpostman.com/view/46560325/2sBXVo9o8C](https://documenter.getpostman.com/view/46560325/2sBXVo9o8C)
