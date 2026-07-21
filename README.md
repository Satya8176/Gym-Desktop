# 🏋️ Gym Management System (Desktop)

A cross-platform desktop application built to digitize and streamline gym administration. The application enables efficient member management, workout planning, physical assessment tracking, and administrative operations through an intuitive desktop interface.

## ✨ Features

### 👤 Member Management

* Register new gym members.
* Store personal and contact information.
* Upload member photograph and ID card.
* Search, edit, and delete member records.
* Unique Enrollment ID for every member.

### 📊 Physical Assessment

* Record body measurements including:

  * Height
  * Weight
  * Chest
  * Waist
  * Biceps
  * Thigh
  * Calf
* Store medical conditions and fitness experience.
* Track assessment completion status.

### 💪 Workout & Routine Management

* Create personalized workout routines.
* Organize workouts by day.
* Manage exercises, sets, repetitions, and weights.
* Support reusable workout templates.

### 🏋️ Exercise Library

* Maintain a centralized exercise database.
* Categorize exercises by muscle group.
* Store equipment and exercise descriptions.

### 🧪 Strength Testing

* Record one-repetition maximum (1RM) tests.
* Store maximum weight and repetition performance.
* Track testing history for each member.

### 📋 Template System

* Create reusable workout templates.
* Assign templates to members.
* Reduce repetitive routine creation.

### 🔐 Admin Panel

* Secure administrator authentication.
* Manage gym data from a centralized dashboard.
* Separate owner access from member data.

### 🗄 Database

* SQLite database powered by Prisma ORM.
* Relational data with cascading deletes.
* Version-controlled database migrations.

---

## 🛠 Tech Stack

### Desktop

* Electron.js

### Frontend

* React.js
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* SQLite
* Prisma ORM

---

## 📁 Project Structure

```text
Gym Final/
│
├── Backend/
│   ├── prisma/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
│
├── Frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── electron/
│
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd Gym-Desktop
```

### 2. Install dependencies

```bash
npm install
cd Backend
npm install
cd ../Frontend
npm install
```

### 3. Configure environment

Create a `.env` file inside the **Backend** directory.

Example:

```env
DATABASE_URL="file:./prisma/dev.db"
```

---

### 4. Run database migrations

```bash
cd Backend

npx prisma migrate dev
npx prisma generate
```

---

### 5. Start the application

```bash
npm run dev
```

---

## 📦 Build Desktop Application

```bash
npm run build
```

or

```bash
npm run dist
```

(depending on your Electron configuration)

---

## Database

This project uses:

* SQLite
* Prisma ORM
* Prisma Migrations

Database schema changes should always be created using:

```bash
npx prisma migrate dev --name migration_name
```

---

## Future Enhancements


* Membership fee management
* Payment receipt generation
* QR code-based member identification
* Progress analytics and fitness reports
* Data backup and restore
* Cloud synchronization
* Multi-admin support
* Export member and workout reports (PDF/Excel)


---

## License

This system is intended for administrative use.

---

