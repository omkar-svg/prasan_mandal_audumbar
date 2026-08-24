# Ganesh Utsav Mandal Management Application

A simple and secure MVP for managing a local Ganesh Utsav Mandal. Built with React (Vite), Express.js, and MySQL.

## Prerequisites

- **Node.js**: Ensure Node.js (v16+) is installed.
- **MySQL**: Ensure you have a MySQL server running (e.g., via XAMPP, WAMP, or Docker).

## 1. Setup Instructions

### Database Setup
1. Open your MySQL client (like phpMyAdmin or MySQL Workbench).
2. Create a new database named `mandal_db`:
   ```sql
   CREATE DATABASE mandal_db;
   ```

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Check the `.env` file and verify your MySQL credentials (`DB_USER`, `DB_PASS`).
4. Start the backend server (this will automatically sync the database schemas via Sequelize):
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server (using `--host` to allow access from your mobile phone on the same Wi-Fi network):
   ```bash
   npm run dev -- --host
   ```
4. Access the application at `http://localhost:5173` on your PC. To access it on your mobile phone, check your terminal for the "Network" IP address (e.g., `http://192.168.1.x:5173`).

## 2. Authentication / Access Codes

The application uses secure, hard-coded access codes instead of traditional passwords.

To access the application, use one of the following codes (configured in `backend/.env`):

- **Admin Access Code**: `ADMIN123` (Full CRUD privileges)
- **Normal User Access Code**: `USER123` (Read-only access)

## 3. Database Migrations (Sequelize)

In this V1 implementation, we are using `sequelize.sync({ alter: true })` inside `backend/server.js` which automatically creates and updates tables when the backend starts. 

If you want to manually manage migrations in the future using Sequelize CLI, run these commands inside the `backend` folder:

**Initialize Sequelize CLI (if not already done):**
```bash
npx sequelize-cli init
```

**Generate a new migration:**
```bash
npx sequelize-cli migration:generate --name add-new-field
```

**Run migrations:**
```bash
npx sequelize-cli db:migrate
```

**Undo last migration:**
```bash
npx sequelize-cli db:migrate:undo
```