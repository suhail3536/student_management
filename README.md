# React + Django REST Full Stack

This project includes a React frontend and Django REST backend with CORS configured so the frontend can call backend APIs during local development.

## Folder structure

```text
fullstack-react-django/
  backend/
    api/
    config/
    manage.py
    requirements.txt
    venv/
  frontend/
    src/
    public/
    package.json
```

## Backend setup

```bash
cd backend
venv\Scripts\activate
python manage.py migrate
python manage.py runserver
```

Backend API endpoint:
- `GET http://127.0.0.1:8000/api/hello/`

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:
- `http://localhost:5173`

## CORS configuration

CORS is configured in `backend/config/settings.py`:
- `corsheaders` added to `INSTALLED_APPS`
- `corsheaders.middleware.CorsMiddleware` added to `MIDDLEWARE`
- `CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]`
