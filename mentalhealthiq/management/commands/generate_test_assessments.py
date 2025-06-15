from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from mentalhealthiq.models import Assessment, Facility, Patient, AssessmentCriteria
from datetime import timedelta
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Generate realistic test assessment data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=90,
            help='Number of days to generate data for (default: 90)',
        )
        parser.add_argument(
            '--per-day',
            type=int,
            default=5,
            help='Average number of assessments per day (default: 5)',
        )

    def handle(self, *args, **options):
        days = options['days']
        per_day = options['per_day']
        
        # Get active facilities and users
        facilities = list(Facility.objects.filter(status='Active'))
        if not facilities:
            self.stdout.write(self.style.ERROR('No active facilities found'))
            return
            
        evaluators = list(User.objects.filter(is_active=True))
        if not evaluators:
            self.stdout.write(self.style.ERROR('No active users found'))
            return
            
        criteria = list(AssessmentCriteria.objects.all())
        if not criteria:
            self.stdout.write(self.style.ERROR('No assessment criteria found'))
            return

        current_time = timezone.now()
        start_date = current_time - timedelta(days=days)
        
        total_created = 0
        days_processed = 0
        
        self.stdout.write(f"\nGenerating assessment data for the last {days} days...")
        
        # Generate data for each day
        current_date = start_date
        while current_date <= current_time:
            # Random number of assessments for this day
            day_assessments = max(1, int(random.gauss(per_day, per_day/3)))
            
            for _ in range(day_assessments):
                try:
                    # Select random facility and get its patients
                    facility = random.choice(facilities)
                    patients = list(Patient.objects.filter(facility=facility, status='Active'))
                    
                    if not patients:
                        continue
                        
                    # Create assessment
                    assessment_time = current_date.replace(
                        hour=random.randint(8, 17),  # Between 8 AM and 5 PM
                        minute=random.randint(0, 59)
                    )
                    
                    # Determine status based on date
                    if assessment_time > current_time:
                        status = 'scheduled'
                        assessment_date = None
                    else:
                        # Older assessments are more likely to be completed
                        days_old = (current_time - assessment_time).days
                        completion_chance = min(0.9, 0.5 + (days_old * 0.1))  # Higher chance of completion for older assessments
                        
                        if random.random() < completion_chance:
                            status = 'completed'
                            assessment_date = assessment_time
                        else:
                            status = 'missed'
                            assessment_date = None
                    
                    assessment = Assessment.objects.create(
                        patient=random.choice(patients),
                        criteria=random.choice(criteria) if status == 'completed' else None,
                        evaluator=random.choice(evaluators) if status == 'completed' else None,
                        facility=facility,
                        assessment_date=assessment_date,
                        scheduled_date=assessment_time,
                        score=random.uniform(50, 100) if status == 'completed' else 0,
                        status=status,
                        missed_reason='Patient unavailable' if status == 'missed' else None,
                        notes=f"Test assessment generated for {assessment_time.strftime('%Y-%m-%d')}"
                    )
                    
                    total_created += 1
                    
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Error creating assessment: {str(e)}'))
                    continue
            
            current_date += timedelta(days=1)
            days_processed += 1
            
            # Progress update every 10 days
            if days_processed % 10 == 0:
                self.stdout.write(f"Processed {days_processed} days, created {total_created} assessments...")
        
        self.stdout.write(self.style.SUCCESS(f'\nSuccessfully created {total_created} assessments across {days_processed} days'))
        
        # Calculate and show statistics
        all_assessments = Assessment.objects.filter(scheduled_date__gte=start_date)
        completed = all_assessments.filter(status='completed').count()
        missed = all_assessments.filter(status='missed').count()
        scheduled = all_assessments.filter(status='scheduled').count()
        
        self.stdout.write("\nAssessment Statistics:")
        self.stdout.write(f"Total: {total_created}")
        self.stdout.write(f"Completed: {completed}")
        self.stdout.write(f"Missed: {missed}")
        self.stdout.write(f"Scheduled: {scheduled}")
        self.stdout.write(f"Completion Rate: {(completed/total_created*100):.1f}%") 
 