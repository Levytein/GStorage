# 📁 GStorage – Secure File Uploader with Supabase & Node.js

GStorage is a full-stack file upload web application built with **Node.js**, **Express**, **Prisma**, and **Supabase Storage**. It enables users to upload files securely, organize them by folders, and generate **time-limited signed URLs** for downloading — ensuring access control and file privacy.

> ⚠️ This was developed as a learning project and is not deployed. Users must configure their own Supabase backend and environment variables.

---

## 🚀 Features

- 🔐 **User Authentication** – Session-based login system using `passport-local`  
- ☁️ **File Uploading** – Upload any file securely via `multer` and store in Supabase  
- 🗂️ **Folder Structure** – Organize files with dynamic folder creation per user  
- 🔗 **Signed URLs** – Generate temporary download links using Supabase's API  
- 🎨 **Responsive UI** – Built with EJS templates and styled using Sass (SCSS)  
- ⚙️ **Full Custom Backend** – Built from scratch with Express, Prisma, PostgreSQL

---

## 🧱 Tech Stack

- **Backend**: Node.js, Express.js, Prisma, PostgreSQL, Supabase Storage  
- **Auth**: Passport.js (Local Strategy), Express Sessions  
- **Frontend**: EJS templating, Sass (SCSS)  
- **Storage**: Supabase Buckets with signed URL access  
- **Dev Tools**: TypeScript, Nodemon, BrowserSync, dotenv

---

## 📦 Installation

> **Prerequisites:** Node.js, PostgreSQL, your own Supabase project

### 1. Clone the repository

```bash
git clone https://github.com/Levytein/GStorage.git
cd GStorage
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your Supabase project

- Create a new project at [supabase.com](https://supabase.com/)
- Create a bucket named `uploads`
- Enable email/password authentication
- Generate your `SERVICE_ROLE` key and `PROJECT_URL`

### 4. Create a `.env` file

```env
PROJECT_URL=https://your-supabase-url.supabase.co
LETTUCE=your-supabase-service-role-key
DATABASE_URL=postgres://your-postgres-connection-string
SESSION_SECRET=some-secret-string
```

### 5. Generate Prisma client

```bash
npx prisma generate
```

### 6. Apply Prisma migrations

```bash
npx prisma migrate dev --name init
```

### 7. Run the development server

```bash
npm run dev
```

### 8. (Optional) Watch SCSS changes

```bash
npm run watch-css
```

---

## 📂 Folder Structure

```
├── config/              # Passport config
├── helpers/             # Utility functions like folder tree and icons
├── prisma/              # Prisma schema and DB config
├── public/              # Static assets and compiled SCSS
├── routes/              # Express route handlers
├── views/               # EJS templates
├── index.ts             # Main Express server
```

---

## 🧪 Status

This is a **personal learning project**. Future improvements could include:
- OAuth (e.g., Google Login)
- File previews
- Upload progress tracking
- User dashboard UI enhancements

---

## 🙌 Acknowledgments

- [Supabase](https://supabase.com/docs) – For providing awesome storage and auth APIs  
- [Prisma](https://www.prisma.io/) – For simplifying PostgreSQL ORM  
- [Passport.js](http://www.passportjs.org/) – Authentication made easy

---

## 📜 License

This project is licensed under the [ISC License](LICENSE).
