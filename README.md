
# MentalHealthIQ

## Accessing the Database

### Creating a Superuser

To access the Django admin interface and view database records:

1. Create a superuser by running:
```bash
python manage.py createsuperuser
```

2. Follow the prompts to set a username, email, and password

3. Start the Django server:
```bash
python manage.py runserver
```

4. Access the admin interface at:
```
http://localhost:8000/admin
```

5. Log in with your superuser credentials

### Demo Accounts

The application comes with pre-configured demo accounts once you run `populate_db.py`:

- **Admin**: Username: `admin`, Password: `password123`
- **Evaluator**: Username: `evaluator`, Password: `password123`
- **Viewer**: Username: `viewer`, Password: `password123`

## Running the Application

### Backend (Django)

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install django djangorestframework django-cors-headers django-filter

# Run migrations
python manage.py migrate

# Populate database with sample data
python populate_db.py

# Start Django server
python manage.py runserver
```

### Frontend (React)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
