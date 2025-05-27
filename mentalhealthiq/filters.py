# mentalhealthiq/filters.py
import django_filters
from django.db import models
from .models import Facility, Patient, Assessment, AssessmentCriteria, Audit
from django.utils import timezone

class FacilityFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='custom_search', label="Search")

    class Meta:
        model = Facility
        fields = '__all__'

    def custom_search(self, queryset, name, value):
        return queryset.filter(
            models.Q(name__icontains=value) |
            models.Q(address__icontains=value) |
            models.Q(facility_type__icontains=value) |
            models.Q(district__icontains=value) |
            models.Q(province__icontains=value)
        )


class PatientFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='custom_search', label="Search")

    class Meta:
        model = Patient
        fields = '__all__'

    def custom_search(self, queryset, name, value):
        return queryset.filter(
            models.Q(first_name__icontains=value) |
            models.Q(last_name__icontains=value) |
            models.Q(national_id__icontains=value) |
            models.Q(facility__name__icontains=value)
        )


class AssessmentFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='custom_search', label="Search")
    status = django_filters.ChoiceFilter(choices=Assessment.STATUS_CHOICES)
    scheduled_date_after = django_filters.DateFilter(field_name='scheduled_date', lookup_expr='gte')
    scheduled_date_before = django_filters.DateFilter(field_name='scheduled_date', lookup_expr='lte')
    is_overdue = django_filters.BooleanFilter(method='filter_overdue')

    class Meta:
        model = Assessment
        fields = '__all__'

    def custom_search(self, queryset, name, value):
        return queryset.filter(
            models.Q(notes__icontains=value) |
            models.Q(patient__first_name__icontains=value) |
            models.Q(patient__last_name__icontains=value) |
            models.Q(score__icontains=value) |
            models.Q(missed_reason__icontains=value)
        )
    
    def filter_overdue(self, queryset, name, value):
        today = timezone.now().date()
        if value:
            return queryset.filter(
                status='scheduled',
                scheduled_date__lt=today
            )
        return queryset


class AssessmentCriteriaFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='custom_search', label="Search")

    class Meta:
        model = AssessmentCriteria
        fields = '__all__'

    def custom_search(self, queryset, name, value):
        return queryset.filter(
            models.Q(name__icontains=value) |
            models.Q(category__icontains=value) |
            models.Q(description__icontains=value)
        )

class AuditFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='custom_search', label="Search")
    status = django_filters.ChoiceFilter(choices=Audit.STATUS_CHOICES)
    scheduled_date_after = django_filters.DateFilter(field_name='scheduled_date', lookup_expr='gte')
    scheduled_date_before = django_filters.DateFilter(field_name='scheduled_date', lookup_expr='lte')
    is_overdue = django_filters.BooleanFilter(method='filter_overdue')

    class Meta:
        model = Audit
        fields = '__all__'

    def custom_search(self, queryset, name, value):
        return queryset.filter(
            models.Q(notes__icontains=value) |
            models.Q(facility__name__icontains=value) |
            models.Q(overall_score__icontains=value) |
            models.Q(missed_reason__icontains=value)
        )
        
    def filter_overdue(self, queryset, name, value):
        today = timezone.now().date()
        if value:
            return queryset.filter(
                status='scheduled',
                scheduled_date__lt=today
            )
        return queryset
