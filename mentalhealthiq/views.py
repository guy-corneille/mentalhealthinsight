from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Avg, Count
from .models import (
    Facility,
    Patient,
    Assessment,
    Audit,
    Report,
    AssessmentCriteria,
    Indicator,
    StaffMember,
    IndicatorScore,MetricSnapshot
)
from .serializers import (
    FacilitySerializer,
    PatientSerializer,
    AssessmentSerializer,
    AuditSerializer,
    ReportSerializer,
    AssessmentCriteriaSerializer,
    IndicatorSerializer,
    StaffMemberSerializer,
    IndicatorScoreSerializer
)
from .pagination import StandardResultsSetPagination
from django.http import JsonResponse
from .tasks import update_facility_metrics  # make sure tasks.py is in the same Django app


class BaseViewSet(viewsets.ModelViewSet):
    """Base ViewSet with common configuration"""
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    permission_classes = [AllowAny]

class FacilityViewSet(BaseViewSet):
    """API endpoints for managing facilities"""
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer
    filterset_fields = ['facility_type', 'district', 'province', 'status']
    search_fields = ['name', 'address', 'contact_name']
    ordering_fields = ['name', 'capacity', 'created_at']
    
    @action(detail=True, methods=['get'])
    def staff(self, request, pk=None):
        """Get all staff members for a specific facility"""
        facility = self.get_object()
        staff = StaffMember.objects.filter(facility=facility)
        serializer = StaffMemberSerializer(staff, many=True)
        return Response(serializer.data)
    
    
    @action(detail=True, methods=['get'])
    def patients(self, request, pk=None):
        """Get all patients for a specific facility"""
        facility = self.get_object()
        patients = Patient.objects.filter(facility=facility)
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def audits(self, request, pk=None):
        """Get all audits for a specific facility"""
        facility = self.get_object()
        audits = Audit.objects.filter(facility=facility)
        serializer = AuditSerializer(audits, many=True)
        return Response(serializer.data)

class PatientViewSet(BaseViewSet):
    """API endpoints for managing patients"""
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    filterset_fields = ['facility', 'gender', 'status']
    search_fields = ['first_name', 'last_name', 'national_id', 'phone']
    ordering_fields = ['registration_date', 'last_name', 'first_name']
    
    @action(detail=True, methods=['get'])
    def assessments(self, request, pk=None):
        """Get all assessments for a specific patient"""
        patient = self.get_object()
        assessments = Assessment.objects.filter(patient=patient)
        serializer = AssessmentSerializer(assessments, many=True)
        return Response(serializer.data)

class AssessmentViewSet(BaseViewSet):
    """API endpoints for managing assessments"""
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer
    filterset_fields = ['patient', 'facility', 'status']
    search_fields = ['notes']
    ordering_fields = ['assessment_date', 'created_at']

class AuditViewSet(BaseViewSet):
    """API endpoints for managing audits"""
    queryset = Audit.objects.all()
    serializer_class = AuditSerializer
    filterset_fields = ['facility', 'status']
    search_fields = ['notes']
    ordering_fields = ['audit_date', 'created_at']

class StaffViewSet(BaseViewSet):
    """API endpoints for managing staff members"""
    queryset = StaffMember.objects.all()
    serializer_class = StaffMemberSerializer
    filterset_fields = ['facility', 'position', 'department', 'status']
    search_fields = ['name', 'email', 'phone']
    ordering_fields = ['name', 'join_date', 'position']

class AssessmentCriteriaViewSet(viewsets.ModelViewSet):
    """API endpoints for managing assessment criteria"""
    queryset = AssessmentCriteria.objects.filter(purpose='Assessment')
    serializer_class = AssessmentCriteriaSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    permission_classes = [AllowAny]

    @action(detail=True, methods=['get'])
    def indicators(self, request, pk=None):
        """Get all indicators for a specific assessment criteria"""
        criteria = self.get_object()
        indicators = Indicator.objects.filter(criteria=criteria)
        serializer = IndicatorSerializer(indicators, many=True)
        return Response(serializer.data)

class AuditCriteriaViewSet(viewsets.ModelViewSet):
    """API endpoints for managing audit criteria"""
    queryset = AssessmentCriteria.objects.filter(purpose='Audit')
    serializer_class = AssessmentCriteriaSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    permission_classes = [AllowAny]

    @action(detail=True, methods=['get'])
    def indicators(self, request, pk=None):
        """Get all indicators for a specific audit criteria"""
        criteria = self.get_object()
        indicators = Indicator.objects.filter(criteria=criteria)
        serializer = IndicatorSerializer(indicators, many=True)
        return Response(serializer.data) 