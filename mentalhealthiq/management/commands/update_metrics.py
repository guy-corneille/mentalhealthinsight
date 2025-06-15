from django.core.management.base import BaseCommand
from mentalhealthiq.tasks import update_facility_metrics

class Command(BaseCommand):
    help = 'Force update facility metrics immediately'

    def handle(self, *args, **options):
        self.stdout.write('Updating facility metrics...')
        result = update_facility_metrics()
        self.stdout.write(self.style.SUCCESS(result)) 
 