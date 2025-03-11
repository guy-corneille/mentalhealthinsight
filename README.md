
# MentalHealthIQ

A comprehensive mental health facility management and assessment platform.

## Project Structure

The project is organized into two main directories:

### Backend (Django)

Contains the Django server that handles the API and database operations.

- `/Backend` - Django project root
  - `/mentalhealthiq` - Main Django app
    - `/migrations` - Database migration files
    - `filters.py` - Filter definitions for API queries
    - Other Django files (models.py, views.py, etc.)

### Frontend (React)

Contains the React frontend application.

- `/Frontend` - React application root
  - `/src` - Source code directory
    - `/components` - Reusable React components
    - `/pages` - Page components
    - `/contexts` - React contexts for state management
    - `/hooks` - Custom React hooks
    - `/lib` - Utility functions and helpers

## Getting Started

### Backend Setup

1. Navigate to the Backend directory:
```
cd Backend
```

2. Create and activate a virtual environment:
```
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```
pip install -r requirements.txt
```

4. Run migrations:
```
python manage.py makemigrations
python manage.py migrate
```

5. Create a superuser:
```
python manage.py createsuperuser
```

6. Run the development server:
```
python manage.py runserver
```

### Frontend Setup

1. Navigate to the Frontend directory:
```
cd Frontend
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

## Features

- Facility management and performance tracking
- Patient assessment and treatment monitoring
- Standardized evaluation criteria
- Comprehensive reporting and analytics
- User authentication and role-based access control
