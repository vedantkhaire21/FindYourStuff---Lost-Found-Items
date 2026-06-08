# 🔍 FindYourStuff — Lost & Found Web Application

> A full-stack MERN web application for reporting, searching, and recovering lost and found items within a community.

**Developed by:** Vedant Rajendra Khaire & Jay Laxman Madhavi
**Institution:** Dr. Babasaheb Ambedkar Technological University, Lonere
**Academic Year:** 2025–2026

---

## 📖 Overview

FindYourStuff is a centralized digital platform that bridges the gap between people who have lost belongings and those who have found them. It replaces inefficient traditional methods — notice boards, word-of-mouth, administrative office visits — with a modern, searchable, image-supported web application accessible 24/7 from any device.

---

## ✨ Key Features

- **Secure Authentication** — JWT-based registration and login with bcrypt password hashing
- **Item Reporting** — Post detailed lost or found reports with images, descriptions, category, location, date, and contact info
- **Browse & Filter** — View all listings and filter by type (Lost / Found) or category (Electronics, Bags, Keys, Jewelry, Documents, Personal)
- **Image Uploads** — Cloud-based image storage via Cloudinary integration
- **Personal Dashboard** — Manage, edit, and delete your own posted listings
- **Responsive UI** — Modern animated interface built with Material UI and Framer Motion
- **Item Detail View** — Full information page for each report with direct contact details

---

## 🛠️ Tech Stack

| Layer         | Technology                                                       |
| ------------- | ---------------------------------------------------------------- |
| Frontend      | React.js (v18+), Material UI, Framer Motion, React Router DOM v6 |
| Backend       | Node.js (v18+), Express.js                                       |
| Database      | MongoDB (Atlas or Community), Mongoose ODM                       |
| Auth          | JSON Web Tokens (JWT), bcryptjs                                  |
| Cloud Storage | Cloudinary                                                       |
| Dev Tools     | Visual Studio Code, Postman, Git / GitHub                        |

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher (npm included)
- [MongoDB](https://www.mongodb.com/) Community Edition or a MongoDB Atlas account
- A [Cloudinary](https://cloudinary.com/) account (free tier is sufficient)

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/KcMelek/Lost-Found-MERN.git
cd Lost-Found-MERN
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Configure Server Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/lostfounddb
JWT_SECRET=your_jwt_secret_key
```

| Variable     | Description                                              |
| ------------ | -------------------------------------------------------- |
| `PORT`       | Port the backend server runs on                          |
| `MONGO_URI`  | MongoDB connection string                                |
| `JWT_SECRET` | Secret key for signing JWTs — use a strong, random value |

### 4. Install Client Dependencies

```bash
cd ../client
npm install
```

### 5. Configure Client Environment Variables

Create a `.env` file in the `client/` directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

### 6. Start the Backend Server

```bash
cd ../server
npm run dev
```

The server starts with `nodemon` and auto-restarts on code changes.

### 7. Start the Frontend

```bash
cd ../client
npm start
```

The app is now accessible at **http://localhost:3000**.

---

## 📡 API Reference

All endpoints return JSON. Protected routes require a valid JWT passed in the `token` request header.

### User Routes — `/users`

| Method | Endpoint            | Auth | Description             |
| ------ | ------------------- | ---- | ----------------------- |
| POST   | `/users/create`     | No   | Register a new user     |
| POST   | `/users/login`      | No   | Login and receive JWT   |
| PUT    | `/users/update/:id` | Yes  | Update user profile     |
| POST   | `/users/renew`      | Yes  | Renew JWT before expiry |

### Item Routes — `/Items`

| Method | Endpoint            | Auth | Description                 |
| ------ | ------------------- | ---- | --------------------------- |
| POST   | `/Items/newItem`    | Yes  | Create a new item report    |
| GET    | `/Items/`           | No   | Fetch all item listings     |
| GET    | `/Items/:id`        | No   | Fetch a specific item by ID |
| PUT    | `/Items/update/:id` | Yes  | Update an item report       |
| DELETE | `/Items/delete/:id` | No   | Delete an item report       |

---

## 🗂️ Project Structure

```
Lost-Found-MERN/
├── client/                     # React.js frontend
│   ├── src/
│   │   ├── App.js              # Root component with routing
│   │   ├── Navbar.js           # Responsive navigation bar
│   │   ├── Home.js             # Landing page with categories
│   │   ├── Login.js            # Login page
│   │   ├── Signup.js           # Registration page
│   │   ├── LostItems.js        # Lost items listing
│   │   ├── FoundItems.js       # Found items listing
│   │   ├── Lost_item.js        # Post new item form
│   │   ├── ItemPage.js         # Item detail view
│   │   ├── MyListings.js       # User dashboard
│   │   └── cloudinary.js       # Cloudinary upload utility
│   └── .env
│
└── server/                     # Node.js / Express.js backend
    ├── models/
    │   ├── User.js             # User schema (Mongoose)
    │   └── Item.js             # Item schema (Mongoose)
    ├── controllers/
    │   ├── User/               # Auth logic (create, login, renew)
    │   └── Items/              # CRUD logic for items
    ├── routes/                 # Express routers
    ├── middlewares/
    │   └── validateToken.js    # JWT validation middleware
    ├── app.js                  # Server entry point
    └── .env
```

---

## 🔒 Security

- Passwords are hashed using **bcryptjs** with auto-generated salt before being stored
- **JWT tokens** expire after 24 hours and must be renewed via `/users/renew`
- All write operations are guarded by the `validateJWT` middleware
- **CORS** is configured to allow only authorized client origins
- Required field validation is enforced at the Mongoose schema level

---

## 🔭 Future Scope

- 🤖 **AI Image Matching** — Automatically suggest matches between lost and found reports using computer vision
- 🔔 **Push Notifications** — Alert users when a relevant new item is posted
- 💬 **In-App Messaging** — Secure chat between reporters without exposing phone numbers
- 🗺️ **Map Integration** — Display item locations on an interactive Google Maps / Mapbox view
- 🛡️ **Admin Dashboard** — Moderation tools for reviewing and removing inappropriate listings
- 📱 **Mobile App** — iOS and Android apps via React Native using the same backend API
- 🔑 **Social Login** — Google OAuth and other providers for simplified authentication

---

## 📄 License

This project is submitted as an academic capstone for the Bachelor of Technology in Integrated Computer Science and Engineering at Dr. Babasaheb Ambedkar Technological University (2025–2026). All rights reserved.
