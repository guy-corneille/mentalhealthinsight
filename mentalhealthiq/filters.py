
# mentalhealthiq/filters.py
import django_filters
from django.db import models
from .models import Facility, Patient, Assessment, AssessmentCriteria, Audit

class FacilityFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='custom_search', label="Search")

    class Meta:
        model = Facility
        fields = ['name', 'facility_type', 'district', 'province', 'status']

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
        fields = ['first_name', 'last_name', 'gender', 'status', 'facility']

    def custom_search(self, queryset, name, value):
        return queryset.filter(
            models.Q(first_name__icontains=value) |
            models.Q(last_name__icontains=value) |
            models.Q(national_id__icontains=value) |
            models.Q(facility__name__icontains=value)
        )


class AssessmentFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='custom_search', label="Search")

    class Meta:
        model = Assessment
        fields = ['patient', 'criteria', 'facility', 'evaluator']

    def custom_search(self, queryset, name, value):
        return queryset.filter(
            models.Q(notes__icontains=value) |
            models.Q(patient__first_name__icontains=value) |
            models.Q(patient__last_name__icontains=value) |
            models.Q(score__icontains=value)
        )


class AssessmentCriteriaFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='custom_search', label="Search")

    class Meta:
        model = AssessmentCriteria
        fields = ['name', 'category']

    def custom_search(self, queryset, name, value):
        return queryset.filter(
            models.Q(name__icontains=value) |
            models.Q(category__icontains=value) |
            models.Q(description__icontains=value)
        )

class AuditFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='custom_search', label="Search")

    class Meta:
        model = Audit
        fields = ['facility', 'auditor', 'status']

    def custom_search(self, queryset, name, value):
        return queryset.filter(
            models.Q(notes__icontains=value) |
            models.Q(facility__name__icontains=value) |
            models.Q(overall_score__icontains=value)
        )
