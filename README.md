# Online Class Management System

Moderate-level final year project with React + Django REST + MySQL + JWT authentication.

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, Axios
- Backend: Django, Django REST Framework, SimpleJWT
- Database: MySQL

## Project Structure
```text
online_class_management/
  backend/
    config/
    accounts/
    academics/
    requirements.txt
    .env.example
  frontend/
    src/
    package.json
```

## Database Schema (Required Tables)
- users
- teachers
- students
- courses
- classes
- enrollments
- assignments
- submissions
- attendance
- study_materials
- notices

## MySQL Setup
Run in MySQL Workbench:

```sql
CREATE DATABASE online_class_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Backend Setup
```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_data
python manage.py runserver
```

Backend base URL: `http://127.0.0.1:8000`

## Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

## API Routes (Core)
- Auth
  - `POST /api/auth/register/`
  - `POST /api/auth/token/`
  - `POST /api/auth/token/refresh/`
  - `GET /api/auth/profile/`
- Admin/User management
  - `GET/POST /api/auth/users/`
- Teacher/Student lists
  - `GET /api/auth/teachers/`
  - `GET /api/auth/students/`
- Academics
  - `/api/courses/`
  - `/api/class-sessions/`
  - `/api/enrollments/`
  - `/api/assignments/`
  - `/api/submissions/`
  - `/api/attendance/`
  - `/api/study-materials/`
  - `/api/notices/`
  - `GET /api/dashboard/summary/`

## Role Access
- Admin: manage users and full dashboard
- Teacher: manage courses, classes, assignments, attendance, notices
- Student: view courses/classes/materials, submit assignments

## Sample Credentials (after seed)
- admin / admin123
- teacher1 / teacher123
- student1 / student123

## Team Collaboration
```bash
git clone <repo-url>
cd online_class_management
```
Each teammate should:
1. Create own branch (`git checkout -b feature/<name>`)
2. Pull latest changes before starting work
3. Run migrations after pulling backend updates

