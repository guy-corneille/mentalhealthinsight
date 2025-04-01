# /**
#  * Report Service (Re-export)
#  * 
#  * This file re-exports the report service from the features directory
#  * to maintain backward compatibility with existing imports.
#  */
from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
import logging
from datetime import datetime, timedelta
from django.utils import timezone
from django.db.models import Count, Avg, Q, F, Case, When, Value, IntegerField, Min
from django.db.models.functions import TruncMonth, ExtractMonth, ExtractYear
import random
from .models import (
    User, PendingUser, Facility, StaffMember, StaffQualification,
    AssessmentCriteria, Indicator, Patient, Assessment, IndicatorScore,
    Audit, AuditCriteria, Report
)
from .serializers import (
    UserSerializer, PendingUserSerializer, FacilitySerializer, 
    StaffMemberSerializer, StaffQualificationSerializer, AssessmentCriteriaSerializer,
    IndicatorSerializer, PatientSerializer, AssessmentSerializer, IndicatorScoreSerializer,
    AuditSerializer, AuditCriteriaSerializer, ReportSerializer
)

logger = logging.getLogger(__name__)

# Authentication views
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Custom login view that returns token and user data"""
    username = request.data.get('username')
    
    if not username:
        return Response({'non_field_errors': ['Must include "username".']}, 
                        status=status.HTTP_400_BAD_REQUEST)
    
    # Modified to only check username - find user by username without password verification
    try:
        user = User.objects.get(username=username)
        token, created = Token.objects.get_or_create(user=user)
        serializer = UserSerializer(user)
        return Response({
            'token': token.key,
            'user': serializer.data
        })
    except User.DoesNotExist:
        return Response({'non_field_errors': ['No user found with this username.']}, 
                        status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """Register a new user as pending"""
    try:
        # Create pending user
        pending_user = PendingUser.objects.create(
            username=request.data['username'],
            email=request.data['email'],
            password=request.data['password'],  # Note: This would normally be hashed
            role=request.data['role'],
            display_name=request.data.get('displayName', ''),
            phone_number=request.data.get('phoneNumber', '')
        )
        
        serializer = PendingUserSerializer(pending_user)
        return Response({
            'message': 'Registration successful. Your account is pending approval.',
            'user': serializer.data
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    """Logout a user by invalidating their token"""
    try:
        if hasattr(request.user, 'auth_token'):
            request.user.auth_token.delete()
        return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Logout error: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class UserViewSet(viewsets.ModelViewSet):
    """API endpoints for managing users"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['role', 'is_active']
    search_fields = ['username', 'email', 'display_name']
    ordering_fields = ['date_joined', 'username', 'display_name']
    permission_classes = [AllowAny]  # Allow any user to access these endpoints
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get the current logged in user"""
        if request.user.is_authenticated:
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        return Response({'detail': 'Not authenticated'}, status=status.HTTP_200_OK)

class PendingUserViewSet(viewsets.ModelViewSet):
    """API endpoints for managing pending user registrations"""
    queryset = PendingUser.objects.all()
    serializer_class = PendingUserSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['role', 'status']
    search_fields = ['username', 'email', 'display_name']
    ordering_fields = ['request_date', 'username']
    permission_classes = [AllowAny]  # Allow any user to access these endpoints
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a pending user registration"""
        pending_user = self.get_object()
        if pending_user.status != 'pending':
            return Response({'error': 'This user is not in pending status'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Create a new user
            user = User.objects.create_user(
                username=pending_user.username,
                email=pending_user.email,
                password=pending_user.password,
                role=pending_user.role,
                display_name=pending_user.display_name,
                phone_number=pending_user.phone_number
            )
            
            # Update pending user status
            pending_user.status = 'approved'
            pending_user.save()
            
            return Response({'message': 'User approved successfully'}, 
                            status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error approving user: {str(e)}")
            return Response({'error': str(e)}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a pending user registration"""
        pending_user = self.get_object()
        if pending_user.status != 'pending':
            return Response({'error': 'This user is not in pending status'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        pending_user.status = 'rejected'
        pending_user.save()
        return Response({'message': 'User registration rejected'}, 
                        status=status.HTTP_200_OK)

class FacilityViewSet(viewsets.ModelViewSet):
    """API endpoints for managing facilities"""
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['facility_type', 'district', 'province', 'status']
    search_fields = ['name', 'address', 'contact_name']
    ordering_fields = ['name', 'capacity', 'created_at']
    permission_classes = [AllowAny]  # Allow any user to access these endpoints
    
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

class StaffMemberViewSet(viewsets.ModelViewSet):
    """API endpoints for managing staff members"""
    queryset = StaffMember.objects.all()
    serializer_class = StaffMemberSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['facility', 'position', 'department', 'status']
    search_fields = ['name', 'email', 'phone']
    ordering_fields = ['name', 'join_date', 'created_at']
    permission_classes = [AllowAny]  # Allow any user to access these endpoints
    
    @action(detail=True, methods=['get'])
    def qualifications(self, request, pk=None):
        """Get all qualifications for a specific staff member"""
        staff = self.get_object()
        qualifications = StaffQualification.objects.filter(staff=staff)
        serializer = StaffQualificationSerializer(qualifications, many=True)
        return Response(serializer.data)

class AssessmentCriteriaViewSet(viewsets.ModelViewSet):
    """API endpoints for managing assessment criteria"""
    serializer_class = AssessmentCriteriaSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'purpose']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    permission_classes = [AllowAny]

    def get_queryset(self):
        """Filter queryset based on purpose"""
        purpose = self.request.query_params.get('purpose', 'Assessment')
        return AssessmentCriteria.objects.filter(purpose=purpose)

    @action(detail=True, methods=['get'])
    def indicators(self, request, pk=None):
        """Get all indicators for a specific assessment criteria"""
        criteria = self.get_object()
        indicators = Indicator.objects.filter(criteria=criteria)
        serializer = IndicatorSerializer(indicators, many=True)
        return Response(serializer.data)

class AuditCriteriaViewSet(viewsets.ModelViewSet):
    """API endpoints for managing audit criteria"""
    serializer_class = AssessmentCriteriaSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    permission_classes = [AllowAny]

    def get_queryset(self):
        """Filter queryset to only show Audit criteria"""
        return AssessmentCriteria.objects.filter(purpose='Audit')

    @action(detail=True, methods=['get'])
    def indicators(self, request, pk=None):
        """Get all indicators for a specific audit criteria"""
        criteria = self.get_object()
        indicators = Indicator.objects.filter(criteria=criteria)
        serializer = IndicatorSerializer(indicators, many=True)
        return Response(serializer.data)

class PatientViewSet(viewsets.ModelViewSet):
    """API endpoints for managing patients"""
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['facility', 'gender', 'status']
    search_fields = ['first_name', 'last_name', 'national_id', 'phone']
    ordering_fields = ['registration_date', 'last_name', 'first_name']
    permission_classes = [AllowAny]  # Allow any user to access these endpoints
    
    @action(detail=True, methods=['get'])
    def assessments(self, request, pk=None):
        """Get all assessments for a specific patient"""
        patient = self.get_object()
        assessments = Assessment.objects.filter(patient=patient)
        serializer = AssessmentSerializer(assessments, many=True)
        return Response(serializer.data)

class AssessmentViewSet(viewsets.ModelViewSet):
    """API endpoints for managing assessments"""
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['facility', 'patient', 'evaluator', 'criteria']
    search_fields = ['notes']
    ordering_fields = ['assessment_date', 'score']
    permission_classes = [AllowAny]  # Allow any user to access these endpoints
    
    @action(detail=True, methods=['get'])
    def indicator_scores(self, request, pk=None):
        """Get all indicator scores for a specific assessment"""
        assessment = self.get_object()
        scores = IndicatorScore.objects.filter(assessment=assessment)
        serializer = IndicatorScoreSerializer(scores, many=True)
        return Response(serializer.data)

class AuditViewSet(viewsets.ModelViewSet):
    """API endpoints for managing audits"""
    queryset = Audit.objects.all()
    serializer_class = AuditSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['facility', 'auditor', 'status']
    search_fields = ['notes']
    ordering_fields = ['audit_date', 'overall_score']
    permission_classes = [AllowAny]  # Allow any user to access these endpoints
    
    @action(detail=True, methods=['get'])
    def criteria_scores(self, request, pk=None):
        """Get all criteria scores for a specific audit"""
        audit = self.get_object()
        scores = AuditCriteria.objects.filter(audit=audit)
        serializer = AuditCriteriaSerializer(scores, many=True)
        return Response(serializer.data)

class ReportViewSet(viewsets.ModelViewSet):
    """API endpoints for managing reports"""
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['report_type', 'generated_by']
    search_fields = ['title', 'description']
    ordering_fields = ['generated_at', 'title']
    permission_classes = [AllowAny]  # Allow any user to access these endpoints
    
    @action(detail=False, methods=['get'], url_path='assessment-statistics')
    def assessment_statistics(self, request):
        """
        Get assessment statistics based on provided filters
        This endpoint returns statistics about assessments, including counts by facility, type, and period
        """
        try:
            # Parse filter parameters
            start_date = request.query_params.get('startDate')
            end_date = request.query_params.get('endDate')
            patient_group = request.query_params.get('patientGroup')
            facility_id = request.query_params.get('facilityId')
            
            # Log the received parameters
            print(f"Received assessment statistics request with params: start_date={start_date}, end_date={end_date}, patient_group={patient_group}, facility_id={facility_id}")
            
            # Set default date range if not provided
            if not start_date or not end_date:
                end_date = timezone.now().date()
                start_date = end_date - timedelta(days=365)  # Default to last 12 months
            else:
                try:
                    start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
                    end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
                except ValueError:
                    return Response(
                        {"error": "Invalid date format. Use YYYY-MM-DD."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Set up base queryset for assessments
            assessments = Assessment.objects.filter(
                assessment_date__gte=start_date,
                assessment_date__lte=end_date
            )
            
            # Apply facility filter if provided
            if facility_id and facility_id != 'undefined' and facility_id != 'null':
                try:
                    facility_id_int = int(facility_id)
                    assessments = assessments.filter(facility=facility_id_int)
                except (ValueError, TypeError):
                    # If facility_id is not a valid integer, ignore the filter
                    pass
            
            # Apply patient group filter if provided
            if patient_group and patient_group != 'all' and patient_group != 'undefined' and patient_group != 'null':
                if patient_group == 'children':
                    # Assuming we can identify children by age or some other field
                    assessments = assessments.filter(patient__age__lt=18)
                elif patient_group == 'elderly':
                    # Assuming we can identify elderly by age
                    assessments = assessments.filter(patient__age__gte=65)
                elif patient_group == 'adults':
                    # Adults between 18 and 65
                    assessments = assessments.filter(patient__age__gte=18, patient__age__lt=65)
            
            # Calculate total count
            total_count = assessments.count()
            
            # If no real data is found, return mock data
            if total_count == 0:
                # Generate mock data for development/demo purposes
                mock_data = {
                    "totalCount": 120,
                    "countByFacility": [
                        {"facilityId": "1", "facilityName": "Main Hospital", "count": 60},
                        {"facilityId": "2", "facilityName": "North Clinic", "count": 35},
                        {"facilityId": "3", "facilityName": "South Outpatient Center", "count": 25}
                    ],
                    "countByType": {
                        "initial": 50,
                        "followup": 45,
                        "discharge": 25
                    },
                    "countByPeriod": [
                        {"period": "2023-01", "count": 8},
                        {"period": "2023-02", "count": 10},
                        {"period": "2023-03", "count": 12},
                        {"period": "2023-04", "count": 9},
                        {"period": "2023-05", "count": 11},
                        {"period": "2023-06", "count": 10},
                        {"period": "2023-07", "count": 13},
                        {"period": "2023-08", "count": 9},
                        {"period": "2023-09", "count": 8},
                        {"period": "2023-10", "count": 10},
                        {"period": "2023-11", "count": 12},
                        {"period": "2023-12", "count": 8}
                    ],
                    "averageScore": 72.5,
                    "patientCoverage": 68,
                    "scoreByCriteria": [
                        {"criteriaId": "1", "criteriaName": "Depression Assessment", "averageScore": 75.2},
                        {"criteriaId": "2", "criteriaName": "Anxiety Screening", "averageScore": 68.7},
                        {"criteriaId": "3", "criteriaName": "Substance Abuse Evaluation", "averageScore": 71.4},
                        {"criteriaId": "4", "criteriaName": "Cognitive Function", "averageScore": 79.8},
                        {"criteriaId": "5", "criteriaName": "Social Support Assessment", "averageScore": 67.3}
                    ]
                }
                return Response(mock_data)
            
            # Calculate counts by facility
            facility_counts = assessments.values('facility').annotate(
                count=Count('id')
            ).order_by('-count')
            
            # Enrich with facility names
            facility_stats = []
            for fc in facility_counts:
                try:
                    facility_id = fc['facility']
                    if facility_id is not None:
                        facility = Facility.objects.get(id=facility_id)
                        facility_stats.append({
                            "facilityId": str(facility_id),
                            "facilityName": facility.name,
                            "count": fc['count']
                        })
                except Facility.DoesNotExist:
                    # Skip if facility doesn't exist
                    continue
            
            # Calculate counts by period (month)
            period_counts = assessments.annotate(
                period=TruncMonth('assessment_date')
            ).values('period').annotate(
                count=Count('id')
            ).order_by('period')
            
            period_data = []
            for item in period_counts:
                if item['period'] is not None:
                    period_data.append({
                        "period": item['period'].strftime("%Y-%m-%d"),
                        "count": item['count']
                    })
            
            # Determine assessment types 
            # This is a simplified approach - ideally, assessment type would be a field in the model
            initial_count = assessments.filter(Q(notes__icontains='initial') | Q(notes__icontains='first visit')).count()
            discharge_count = assessments.filter(Q(notes__icontains='discharge') | Q(notes__icontains='final')).count()
            followup_count = total_count - initial_count - discharge_count
            
            # Calculate average assessment score
            average_score = assessments.exclude(score=None).aggregate(avg_score=Avg('score'))['avg_score'] or 0
            
            # Calculate patient coverage (percentage of patients who have been assessed)
            total_patients = Patient.objects.count()
            assessed_patients = assessments.values('patient').distinct().count()
            patient_coverage = int((assessed_patients / total_patients) * 100) if total_patients > 0 else 0
            
            # Calculate scores by criteria
            criteria_scores = []
            criteria_with_assessments = AssessmentCriteria.objects.filter(assessment__in=assessments).distinct()
            
            for criteria in criteria_with_assessments:
                avg_score = assessments.filter(criteria=criteria).exclude(score=None).aggregate(
                    avg_score=Avg('score')
                )['avg_score'] or 0
                
                criteria_scores.append({
                    "criteriaId": str(criteria.id),
                    "criteriaName": criteria.name,
                    "averageScore": round(avg_score, 1)
                })
            
            # Create the response object
            statistics = {
                "totalCount": total_count,
                "countByFacility": facility_stats,
                "countByType": {
                    "initial": initial_count,
                    "followup": followup_count,
                    "discharge": discharge_count
                },
                "countByPeriod": period_data,
                "averageScore": round(average_score, 1),
                "patientCoverage": patient_coverage,
                "scoreByCriteria": criteria_scores
            }
            
            return Response(statistics)
        
        except Exception as e:
            print(f"Error generating assessment statistics: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'], url_path='audit-statistics')
    def audit_statistics(self, request):
        """
        Get audit statistics based on provided filters
        This endpoint returns statistics about audits, including counts by facility, type, and period
        """
        try:
            # Parse filter parameters
            start_date = request.query_params.get('startDate')
            end_date = request.query_params.get('endDate')
            facility_id = request.query_params.get('facilityId')
            
            # Log the received parameters
            print(f"Received audit statistics request with params: start_date={start_date}, end_date={end_date}, facility_id={facility_id}")
            
            # Set default date range if not provided
            if not start_date or not end_date:
                end_date = timezone.now().date()
                start_date = end_date - timedelta(days=365)  # Default to last 12 months
            else:
                try:
                    start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
                    end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
                except ValueError:
                    return Response(
                        {"error": "Invalid date format. Use YYYY-MM-DD."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Set up base queryset for audits
            audits = Audit.objects.filter(
                audit_date__gte=start_date,
                audit_date__lte=end_date
            )
            
            # Apply facility filter if provided
            if facility_id and facility_id != 'undefined' and facility_id != 'null':
                try:
                    facility_id_int = int(facility_id)
                    audits = audits.filter(facility=facility_id_int)
                except (ValueError, TypeError):
                    # If facility_id is not a valid integer, ignore the filter
                    pass
            
            # Calculate total count
            total_count = audits.count()
            
            # If no real data is found, return mock data
            if total_count == 0:
                # Generate mock data for development/demo purposes
                mock_data = {
                    "totalCount": 35,
                    "countByFacility": [
                        {"facilityId": "1", "facilityName": "Central Hospital", "count": 12},
                        {"facilityId": "2", "facilityName": "Eastern District Clinic", "count": 9},
                        {"facilityId": "3", "facilityName": "Northern Community Center", "count": 8},
                        {"facilityId": "4", "facilityName": "Southern District Hospital", "count": 6}
                    ],
                    "countByType": {
                        "initial": 14,  # Infrastructure audits
                        "followup": 12, # Staffing audits
                        "discharge": 9  # Treatment audits
                    },
                    "countByPeriod": [
                        {"period": "2023-01", "count": 2},
                        {"period": "2023-02", "count": 3},
                        {"period": "2023-03", "count": 2},
                        {"period": "2023-04", "count": 4},
                        {"period": "2023-05", "count": 3},
                        {"period": "2023-06", "count": 3},
                        {"period": "2023-07", "count": 4},
                        {"period": "2023-08", "count": 3},
                        {"period": "2023-09", "count": 2},
                        {"period": "2023-10", "count": 3},
                        {"period": "2023-11", "count": 4},
                        {"period": "2023-12", "count": 2}
                    ],
                    "averageScore": 78.5,
                    "patientCoverage": 85,
                    "scoreByCriteria": [
                        {"criteriaId": "1", "criteriaName": "Infrastructure & Safety", "averageScore": 82.5},
                        {"criteriaId": "2", "criteriaName": "Staffing & Training", "averageScore": 76.8},
                        {"criteriaId": "3", "criteriaName": "Treatment & Care", "averageScore": 84.2},
                        {"criteriaId": "4", "criteriaName": "Patient Rights", "averageScore": 79.7},
                        {"criteriaId": "5", "criteriaName": "Documentation", "averageScore": 72.3}
                    ]
                }
                return Response(mock_data)
            
            # Calculate counts by facility
            facility_counts = audits.values('facility').annotate(
                count=Count('id')
            ).order_by('-count')
            
            # Enrich with facility names
            facility_stats = []
            for fc in facility_counts:
                try:
                    facility_id = fc['facility']
                    if facility_id is not None:
                        facility = Facility.objects.get(id=facility_id)
                        facility_stats.append({
                            "facilityId": str(facility_id),
                            "facilityName": facility.name,
                            "count": fc['count']
                        })
                except Facility.DoesNotExist:
                    # Skip if facility doesn't exist
                    continue
            
            # Calculate counts by period (month)
            period_counts = audits.annotate(
                period=TruncMonth('audit_date')
            ).values('period').annotate(
                count=Count('id')
            ).order_by('period')
            
            period_data = []
            for item in period_counts:
                if item['period'] is not None:
                    period_data.append({
                        "period": item['period'].strftime("%Y-%m-%d"),
                        "count": item['count']
                    })
            
            # Determine audit types 
            # This is a simplified approach - for real implementation, we would use a field in the model
            # Here we categorize audits based on notes/description or other fields
            infrastructure_count = audits.filter(Q(notes__icontains='infrastructure') | Q(notes__icontains='facility') | Q(notes__icontains='building')).count()
            staffing_count = audits.filter(Q(notes__icontains='staff') | Q(notes__icontains='personnel') | Q(notes__icontains='training')).count()
            treatment_count = total_count - infrastructure_count - staffing_count
            
            # Calculate average audit score
            average_score = audits.exclude(overall_score=None).aggregate(avg_score=Avg('overall_score'))['avg_score'] or 0
            
            # Calculate coverage (percentage of criteria covered by audits)
            # For simplicity, we use a proxy percentage here - in a real implementation, 
            # this might represent the percentage of required audit criteria that were evaluated
            total_criteria = AssessmentCriteria.objects.filter(purpose='Audit').count()
            covered_criteria = AuditCriteria.objects.filter(audit__in=audits).values('criteria_name').distinct().count()
            coverage = int((covered_criteria / total_criteria) * 100) if total_criteria > 0 else 70
            
            # Calculate scores by criteria
            criteria_scores = []
            audit_criteria = AuditCriteria.objects.filter(audit__in=audits).values('criteria_name').annotate(
                avg_score=Avg('score')
            )
            
            for ac in audit_criteria:
                criteria_name = ac['criteria_name']
                if criteria_name is not None:
                    criteria_scores.append({
                        "criteriaId": criteria_name,
                        "criteriaName": criteria_name,
                        "averageScore": round(ac['avg_score'], 1) if ac['avg_score'] else 0
                    })
            
            # Create the response object
            statistics = {
                "totalCount": total_count,
                "countByFacility": facility_stats,
                "countByType": {
                    "initial": infrastructure_count,  # Infrastructure audits
                    "followup": staffing_count,      # Staffing audits
                    "discharge": treatment_count      # Treatment audits
                },
                "countByPeriod": period_data,
                "averageScore": round(average_score, 1),
                "patientCoverage": coverage,
                "scoreByCriteria": criteria_scores
            }
            
            return Response(statistics)
        
        except Exception as e:
            print(f"Error generating audit statistics: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'])
    def generate_facility_report(self, request):
        """Generate a new facility performance report"""
        # Logic to generate facility report
        # This would typically include data aggregation and file generation
        try:
            # Example implementation (to be customized with actual business logic)
            parameters = request.data.get('parameters', {})
            report = Report.objects.create(
                title=request.data.get('title', 'Facility Performance Report'),
                report_type='facility',
                description=request.data.get('description', ''),
                generated_by=request.user,
                parameters=parameters
            )
            
            # Here you would add logic to generate the actual report file
            # and update the file_path field
            
            serializer = self.get_serializer(report)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error generating facility report: {str(e)}")
            return Response({'error': str(e)}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'])
    def generate_assessment_report(self, request):
        """Generate a new patient assessment report"""
        # Logic to generate assessment report
        try:
            parameters = request.data.get('parameters', {})
            report = Report.objects.create(
                title=request.data.get('title', 'Assessment Report'),
                report_type='assessment',
                description=request.data.get('description', ''),
                generated_by=request.user,
                parameters=parameters
            )
            
            # Here you would add logic to generate the actual report
            
            serializer = self.get_serializer(report)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error generating assessment report: {str(e)}")
            return Response({'error': str(e)}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'])
    def generate_audit_report(self, request):
        """Generate a new audit report"""
        # Logic to generate audit report
        try:
            parameters = request.data.get('parameters', {})
            report = Report.objects.create(
                title=request.data.get('title', 'Audit Report'),
                report_type='audit',
                description=request.data.get('description', ''),
                generated_by=request.user,
                parameters=parameters
            )
            
            # Here you would add logic to generate the actual report
            
            serializer = self.get_serializer(report)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error generating audit report: {str(e)}")
            return Response({'error': str(e)}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
