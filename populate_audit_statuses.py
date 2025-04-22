
import os
import django
import random
from datetime import datetime, timedelta

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mentalhealthiq.settings')
django.setup()

from mentalhealthiq.models import Audit

def update_audit_statuses():
    # Get all audits
    audits = Audit.objects.all()
    
    # List of possible statuses with weights
    statuses = ['completed', 'scheduled', 'incomplete']
    weights = [0.5, 0.3, 0.2]  # 50% completed, 30% scheduled, 20% incomplete
    
    print(f"Found {len(audits)} audits to update")
    
    for audit in audits:
        # Randomly select a status based on weights
        new_status = random.choices(statuses, weights=weights, k=1)[0]
        
        # Set scheduled date for scheduled audits
        if new_status == 'scheduled':
            # Set scheduled_date to a future date within next 30 days
            future_date = datetime.now().date() + timedelta(days=random.randint(1, 30))
            audit.scheduled_date = future_date
        
        # Add a reason if incomplete
        if new_status == 'incomplete':
            audit.incomplete_reason = "Insufficient documentation provided"
            
        audit.status = new_status
        audit.save()
        
        print(f"Updated audit {audit.id} to status: {new_status}")
    
    print("\nStatus update complete!")
    
    # Print summary
    completed = Audit.objects.filter(status='completed').count()
    scheduled = Audit.objects.filter(status='scheduled').count()
    incomplete = Audit.objects.filter(status='incomplete').count()
    
    print("\nFinal Status Distribution:")
    print(f"Completed: {completed}")
    print(f"Scheduled: {scheduled}")
    print(f"Incomplete: {incomplete}")

if __name__ == "__main__":
    update_audit_statuses()
