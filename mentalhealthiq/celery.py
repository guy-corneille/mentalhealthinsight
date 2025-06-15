import os
from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mentalhealthiq.settings')

app = Celery('mentalhealthiq')

# Use settings from Django settings.py
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load tasks from all registered Django app configs
app.autodiscover_tasks()

# Configure periodic tasks
app.conf.beat_schedule = {
    'check-missed-audits': {
        'task': 'mentalhealthiq.tasks.check_missed_audits',
        'schedule': crontab(minute='0', hour='*'),  # Every hour
    },
    'update-facility-metrics': {
        'task': 'mentalhealthiq.tasks.update_facility_metrics',
        'schedule': crontab(minute='*/15'),  
    },
} 