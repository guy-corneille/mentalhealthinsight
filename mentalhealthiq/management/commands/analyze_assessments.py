from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db.models import Count, Q, Avg
from mentalhealthiq.models import Assessment, Facility
from datetime import timedelta

class Command(BaseCommand):
    help = 'Analyze assessment completion rates across different time windows'

    def add_arguments(self, parser):
        parser.add_argument(
            '--facility',
            type=str,
            help='Facility ID to analyze (optional)',
        )

    def handle(self, *args, **options):
        current_time = timezone.now()
        facility_id = options.get('facility')

        # Base queryset
        assessments = Assessment.objects.all()
        if facility_id:
            try:
                facility = Facility.objects.get(id=facility_id)
                assessments = assessments.filter(facility=facility)
                self.stdout.write(f"\nAnalyzing assessments for facility: {facility.name}\n")
            except Facility.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"Facility with ID {facility_id} not found"))
                return

        # Time windows to analyze
        windows = {
            'today': (current_time.replace(hour=0, minute=0, second=0, microsecond=0), current_time),
            'last_7_days': (current_time - timedelta(days=7), current_time),
            'last_30_days': (current_time - timedelta(days=30), current_time),
            'last_90_days': (current_time - timedelta(days=90), current_time),
            'all_time': (None, current_time)
        }

        self.stdout.write("\n=== Assessment Completion Analysis ===\n")

        for window_name, (start_date, end_date) in windows.items():
            # Base query for this time window
            window_query = assessments
            if start_date:
                window_query = window_query.filter(scheduled_date__range=(start_date, end_date))
            else:
                window_query = window_query.filter(scheduled_date__lte=end_date)

            # Get counts
            total_count = window_query.count()
            completed_count = window_query.filter(status='completed').count()
            missed_count = window_query.filter(status='missed').count()
            scheduled_count = window_query.filter(status='scheduled').count()

            # Calculate completion rate
            completion_rate = (completed_count / total_count * 100) if total_count > 0 else 0

            # Calculate average score for completed assessments
            avg_score = window_query.filter(status='completed').aggregate(
                avg_score=Avg('score')
            )['avg_score'] or 0

            # Output statistics
            self.stdout.write(f"\n{window_name.replace('_', ' ').title()}:")
            self.stdout.write(f"Total Assessments: {total_count}")
            self.stdout.write(f"Completed: {completed_count}")
            self.stdout.write(f"Missed: {missed_count}")
            self.stdout.write(f"Scheduled: {scheduled_count}")
            self.stdout.write(f"Completion Rate: {completion_rate:.1f}%")
            self.stdout.write(f"Average Score: {avg_score:.1f}")

            # Additional insights
            if window_name != 'today':
                # Calculate daily average
                days = 7 if window_name == 'last_7_days' else 30 if window_name == 'last_30_days' else 90 if window_name == 'last_90_days' else None
                if days:
                    daily_avg = total_count / days
                    self.stdout.write(f"Daily Average: {daily_avg:.1f} assessments")

                # Trend analysis (comparing first half to second half)
                if start_date:
                    mid_date = start_date + (end_date - start_date) / 2
                    first_half = window_query.filter(scheduled_date__lt=mid_date).count()
                    second_half = window_query.filter(scheduled_date__gte=mid_date).count()
                    trend = "Increasing" if second_half > first_half else "Decreasing" if second_half < first_half else "Stable"
                    self.stdout.write(f"Trend: {trend} ({first_half} vs {second_half})")

        # Facility-specific insights if analyzing a single facility
        if facility_id:
            self.stdout.write("\n=== Facility-Specific Insights ===")
            capacity_util = facility.capacity_utilization if hasattr(facility, 'capacity_utilization') else None
            if capacity_util is not None:
                self.stdout.write(f"Current Capacity Utilization: {capacity_util:.1f}%")

            # Get assessment distribution by hour of day (last 90 days)
            hour_distribution = assessments.filter(
                scheduled_date__range=(current_time - timedelta(days=90), current_time)
            ).extra(
                select={'hour': "EXTRACT(hour FROM scheduled_date)"}
            ).values('hour').annotate(count=Count('id')).order_by('hour')

            if hour_distribution:
                self.stdout.write("\nAssessment Distribution by Hour (Last 90 Days):")
                for item in hour_distribution:
                    hour = item['hour']
                    count = item['count']
                    self.stdout.write(f"{hour:02d}:00 - {hour:02d}:59: {count} assessments") 
 