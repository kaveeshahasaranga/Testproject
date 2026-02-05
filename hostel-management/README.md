# University Hostel Management System (MERN)

## Project Structure
- **/client**: Frontend (React + Vite + Tailwind CSS)
- **/server**: Backend (Node.js + Express + MongoDB)

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed and running (default: `mongodb://localhost:27017/hostel-management`)

### 1. Setup Backend
```bash
cd hostel-management/server
npm install
npm run dev
# Server runs on http://localhost:5000
```
Make sure to create a `.env` file in `/server` with:
```
MONGO_URI=mongodb://localhost:27017/hostel-management
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 2. Setup Frontend
```bash
cd hostel-management/client
npm install
npm run dev
# Client runs on http://localhost:5173
```

## Features
- **Student Registration & Room Allocation**: Manage students and rooms.
- **Maintenance Requests**: Submit and track issues with image uploads.
- **Resource Booking**: Reserve washing machines, study rooms, etc.
- **Grocery Requests**: Order items and track delivery.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS (Glassmorphism), Context API.
- **Backend**: Express, Mongoose, Joi (Validation), Multer (Uploads), JWT (Auth).
