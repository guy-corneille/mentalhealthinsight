from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db.models import Count, Q, Avg
from mentalhealthiq.models import Assessment, Facility, MetricSnapshot
from datetime import timedelta
import json

class Command(BaseCommand):
    help = 'Store historical assessment statistics'

    def handle(self, *args, **options):
        current_time = timezone.now()
        facilities = Facility.objects.filter(status='Active')
        
        self.stdout.write("\n=== Storing Historical Assessment Statistics ===\n")
        
        for facility in facilities:
            try:
                # Get all-time stats
                all_time_stats = self._calculate_stats(facility, None, current_time)
                
                # Get monthly stats for the past year
                monthly_stats = []
                for i in range(12):
                    end_date = current_time - timedelta(days=30 * i)
                    start_date = end_date - timedelta(days=30)
                    monthly_stats.append({
                        'period': start_date.strftime('%Y-%m'),
                        'stats': self._calculate_stats(facility, start_date, end_date)
                    })
                
                # Store the stats in the MetricSnapshot
                MetricSnapshot.objects.create(
                    facility=facility,
                    metric_type='historical_stats',
                    active_patients=facility.patient_set.filter(status='Active').count(),
                    capacity_utilization=all_time_stats['capacity_utilization'],
                    total_assessments=all_time_stats['total'],
                    completed_assessments=all_time_stats['completed'],
                    completion_rate=all_time_stats['completion_rate'],
                    historical_data=json.dumps({
                        'all_time': all_time_stats,
                        'monthly': monthly_stats
                    })
                )
                
                self.stdout.write(f"Stored historical stats for {facility.name}")
                self.stdout.write(f"All-time completion rate: {all_time_stats['completion_rate']:.1f}%")
                self.stdout.write(f"Total assessments: {all_time_stats['total']}")
                self.stdout.write("Monthly trends:")
                for month in monthly_stats[:3]:  # Show last 3 months
                    self.stdout.write(f"  {month['period']}: {month['stats']['completion_rate']:.1f}% completion rate")
                self.stdout.write("")
                
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error processing facility {facility.name}: {str(e)}"))
                continue
    
    def _calculate_stats(self, facility, start_date, end_date):
        """Calculate statistics for a given time period"""
        assessments = Assessment.objects.filter(facility=facility)
        if start_date:
            assessments = assessments.filter(scheduled_date__gte=start_date)
        if end_date:
            assessments = assessments.filter(scheduled_date__lt=end_date)
        
        total = assessments.count()
        completed = assessments.filter(status='completed').count()
        missed = assessments.filter(status='missed').count()
        scheduled = assessments.filter(status='scheduled').count()
        
        completion_rate = (completed / total * 100) if total > 0 else 0
        avg_score = assessments.filter(status='completed').aggregate(
            avg_score=Avg('score')
        )['avg_score'] or 0
        
        # Calculate capacity utilization
        active_patients = facility.patient_set.filter(status='Active').count()
        capacity_util = min((active_patients / facility.capacity * 100), 100) if facility.capacity > 0 else 0
        
        return {
            'total': total,
            'completed': completed,
            'missed': missed,
            'scheduled': scheduled,
            'completion_rate': completion_rate,
            'avg_score': avg_score,
            'capacity_utilization': capacity_util
        } 
 