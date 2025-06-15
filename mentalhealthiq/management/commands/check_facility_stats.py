from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from django.db.models import Count
from mentalhealthiq.models import Facility, Audit

class Command(BaseCommand):
    help = 'Check facility and audit statistics'

    def handle(self, *args, **options):
        # Get all active facilities
        active_facilities = Facility.objects.filter(status='Active')
        total_active = active_facilities.count()
        
        # Get facilities with completed audits in last 90 days
        now = timezone.now()
        ninety_days_ago = now - timedelta(days=90)
        
        facilities_with_audits = Facility.objects.filter(
            status='Active',
            audits__status='completed',
            audits__audit_date__gte=ninety_days_ago
        ).distinct().count()
        
        # Get total completed audits in last 90 days
        total_recent_audits = Audit.objects.filter(
            status='completed',
            audit_date__gte=ninety_days_ago
        ).count()
        
        self.stdout.write(self.style.SUCCESS(f'Total active facilities: {total_active}'))
        self.stdout.write(self.style.SUCCESS(f'Facilities with completed audits in last 90 days: {facilities_with_audits}'))
        self.stdout.write(self.style.SUCCESS(f'Total completed audits in last 90 days: {total_recent_audits}')) 