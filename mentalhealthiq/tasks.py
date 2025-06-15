from celery import shared_task
from django.utils import timezone
from django.db.models import Count, Q
from .models import Audit, Facility, Patient, Assessment, MetricSnapshot

@shared_task
def check_missed_audits():
    """
    Check for audits that are past their scheduled date and mark them as missed.
    This task should be scheduled to run periodically (e.g., every hour).
    """
    current_time = timezone.now()
    
    # Get all scheduled audits that are past their scheduled date
    overdue_audits = Audit.objects.filter(
        status='scheduled',
        scheduled_date__lt=current_time
    )
    
    # Update them to missed status
    overdue_audits.update(
        status='missed',
        missed_reason='Automatically marked as missed - scheduled date passed'
    )
    
    return f"Updated {overdue_audits.count()} overdue audits to missed status" 

@shared_task
def update_facility_metrics():
    """
    Update metrics for all facilities.
    This task runs every 15 minutes to collect current metrics.
    """
    current_time = timezone.now()
    facilities = Facility.objects.filter(status='Active')
    metrics_created = 0
    errors = []
    
    for facility in facilities:
        try:
            # Get patient counts by status
            active_patients = Patient.objects.filter(facility=facility, status='Active').count()
            discharged_patients = Patient.objects.filter(facility=facility, status='Discharged').count()
            inactive_patients = Patient.objects.filter(facility=facility, status='Inactive').count()
            
            # Calculate capacity utilization
            if facility.capacity <= 0:
                capacity_util = 100 if active_patients > 0 else 0
            else:
                capacity_util = min((active_patients / facility.capacity * 100), 100)
            
            # Calculate daily metrics
            today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
            today_end = today_start + timezone.timedelta(days=1)
            
            # Get daily total and completed assessments
            daily_total = Assessment.objects.filter(
                facility=facility,
                scheduled_date__range=(today_start, today_end)
            ).count()
            
            daily_completed = Assessment.objects.filter(
                facility=facility,
                scheduled_date__range=(today_start, today_end),
                status='completed'
            ).count()
            
            # Calculate daily completion rate
            daily_completion_rate = (daily_completed / daily_total * 100) if daily_total > 0 else 0
            
            # Calculate 90-day metrics
            ninety_days_ago = current_time - timezone.timedelta(days=90)
            
            # Get 90-day total and completed assessments
            ninety_day_total = Assessment.objects.filter(
                facility=facility,
                scheduled_date__range=(ninety_days_ago, current_time)
            ).count()
            
            ninety_day_completed = Assessment.objects.filter(
                facility=facility,
                scheduled_date__range=(ninety_days_ago, current_time),
                status='completed'
            ).count()
            
            # Calculate 90-day completion rate
            ninety_day_completion_rate = (ninety_day_completed / ninety_day_total * 100) if ninety_day_total > 0 else 0
            
            # Create metric snapshot with both daily and 90-day metrics
            MetricSnapshot.objects.create(
                facility=facility,
                metric_type='patient_load',
                active_patients=active_patients,
                discharged_patients=discharged_patients,
                inactive_patients=inactive_patients,
                capacity_utilization=round(capacity_util, 2),
                total_assessments=daily_total,
                completed_assessments=daily_completed,
                completion_rate=round(daily_completion_rate, 2),
                ninety_day_total_assessments=ninety_day_total,
                ninety_day_completed_assessments=ninety_day_completed,
                ninety_day_completion_rate=round(ninety_day_completion_rate, 2)
            )
            
            metrics_created += 1
        except Exception as e:
            error_msg = f"Error processing metrics for facility {facility.name}: {str(e)}"
            print(error_msg)
            errors.append(error_msg)
            continue
    
    return f"Created metrics snapshots for {metrics_created} facilities. Errors: {len(errors)}" 
    return f"Created metrics snapshots for {metrics_created} facilities" 