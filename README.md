# Portfolio Website with Admin Dashboard

A full-stack portfolio website for a junior full-stack web developer, with a complete admin dashboard to manage all content.

- **Frontend:** Vue 3 (Composition API, `<script setup>`), Vue Router, Pinia, Axios, vue-chartjs. Plain CSS only — no Bootstrap, no UI kit.
- **Backend:** Node.js, Express, MySQL (mysql2), JWT auth, bcryptjs, CORS, Multer (image uploads).

## Project structure

```
portfolio-project/
├── backend/          # Express API + MySQL
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/   # JWT auth guard, image upload
│   ├── routes/
│   ├── sql/schema.sql
│   ├── uploads/      # uploaded images are stored here
│   ├── .env.example
│   └── server.js
└── frontend/         # Vue 3 app (public site + /admin dashboard)
    └── src/
        ├── assets/main.css   # design tokens + global styles
        ├── components/
        ├── router/
        ├── services/         # axios API layer
        ├── stores/           # Pinia auth store
        └── views/
            ├── public/       # portfolio homepage
            └── admin/        # dashboard pages
```

## 1. Database setup (MySQL Workbench or VSCode)

1. Open MySQL Workbench (or the MySQL extension in VSCode) and connect to your local MySQL server.
2. Open `backend/sql/schema.sql` and run the whole script. It will:
   - Create the `portfolio_db` database
   - Create all tables: `users`, `profile`, `skills`, `projects`, `experience`, `education`, `messages`
   - Insert a default admin user and sample data

**Default admin login (change this after first login):**
```
Email:    admin@example.com
Password: Admin@123
```

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set your MySQL credentials:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=portfolio_db
JWT_SECRET=change_this_to_a_long_random_secret_key
```

Start the API server:
```bash
npm run dev      # with nodemon (auto-restart)
# or
npm start
```

The API runs at `http://localhost:5000`. Check `http://localhost:5000/api/health` to confirm it's running.

## 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The site runs at `http://localhost:5173`. Vite is configured to proxy `/api` and `/uploads` requests to the backend on port 5000, so no extra CORS setup is needed in development.

- Public portfolio: `http://localhost:5173/`
- Admin dashboard login: `http://localhost:5173/admin/login`

## 4. Using the dashboard

Log in with the default admin credentials above, then from the sidebar you can:

- **Dashboard** — overview stats + a chart of your content
- **Profile** — edit your name, title, about text, contact info, social links, avatar
- **Projects** — add/edit/delete portfolio projects (with image upload, tech stack, demo/repo links)
- **Skills** — add/edit/delete skills with a proficiency slider
- **Experience** — manage your work history timeline
- **Education** — manage your education timeline
- **Messages** — read messages submitted through the public contact form, mark as read, delete
- **Settings** — change your admin password

All changes save to MySQL immediately and show up on the public site right away (refresh the page).

## 5. Building for production

```bash
cd frontend
npm run build
```

This outputs static files to `frontend/dist`, which you can serve with any static host or point Express to serve directly.

## Notes for a junior dev

- The backend uses a simple service/controller/route pattern — one controller per resource, one route file per controller.
- The frontend uses one Axios service file per resource (`src/services/*.js`), called from the Vue views. This keeps API calls out of the components.
- JWT token is stored in `localStorage` and attached automatically to every API request via an Axios interceptor (`src/services/http.js`).
- Protected backend routes use the `authMiddleware` (`backend/middleware/auth.js`) which checks the JWT sent in the `Authorization: Bearer <token>` header.
- Protected frontend routes (everything under `/admin` except `/admin/login`) use a Vue Router navigation guard (`src/router/index.js`).
