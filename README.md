# Northwest University Kano - Student Online Voting System

Full-stack student election voting platform built with Django REST Framework and React.

## Stack
- Backend: Django, DRF, JWT, SQLite
- Frontend: React, React Router, Axios

## Quick start
### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Default API base URL
`http://127.0.0.1:8000/api/`
