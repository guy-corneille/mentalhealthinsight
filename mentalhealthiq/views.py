from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
import logging
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
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logout a user by invalidating their token"""
    try:
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
    queryset = User.objects.all()
    serializer_class = UserSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['role', 'is_active']
    search_fields = ['username', 'email', 'display_name']
    ordering_fields = ['date_joined', 'username', 'display_name']
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Get the current logged in user"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class PendingUserViewSet(viewsets.ModelViewSet):
    queryset = PendingUser.objects.all()
    serializer_class = PendingUserSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['role', 'status']
    search_fields = ['username', 'email', 'display_name']
    ordering_fields = ['request_date', 'username']
    
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
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
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

class StaffMemberViewSet(viewsets.ModelViewSet):
    queryset = StaffMember.objects.all()
    serializer_class = StaffMemberSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['facility', 'position', 'department', 'status']
    search_fields = ['name', 'email', 'phone']
    ordering_fields = ['name', 'join_date', 'created_at']
    
    @action(detail=True, methods=['get'])
    def qualifications(self, request, pk=None):
        """Get all qualifications for a specific staff member"""
        staff = self.get_object()
        qualifications = StaffQualification.objects.filter(staff=staff)
        serializer = StaffQualificationSerializer(qualifications, many=True)
        return Response(serializer.data)

class AssessmentCriteriaViewSet(viewsets.ModelViewSet):
    queryset = AssessmentCriteria.objects.all()
    serializer_class = AssessmentCriteriaSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    
    @action(detail=True, methods=['get'])
    def indicators(self, request, pk=None):
        """Get all indicators for a specific assessment criteria"""
        criteria = self.get_object()
        indicators = Indicator.objects.filter(criteria=criteria)
        serializer = IndicatorSerializer(indicators, many=True)
        return Response(serializer.data)

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
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

class AssessmentViewSet(viewsets.ModelViewSet):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['facility', 'patient', 'evaluator', 'criteria']
    search_fields = ['notes']
    ordering_fields = ['assessment_date', 'score']
    
    @action(detail=True, methods=['get'])
    def indicator_scores(self, request, pk=None):
        """Get all indicator scores for a specific assessment"""
        assessment = self.get_object()
        scores = IndicatorScore.objects.filter(assessment=assessment)
        serializer = IndicatorScoreSerializer(scores, many=True)
        return Response(serializer.data)

class AuditViewSet(viewsets.ModelViewSet):
    queryset = Audit.objects.all()
    serializer_class = AuditSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['facility', 'auditor', 'status']
    search_fields = ['notes']
    ordering_fields = ['audit_date', 'overall_score']
    
    @action(detail=True, methods=['get'])
    def criteria_scores(self, request, pk=None):
        """Get all criteria scores for a specific audit"""
        audit = self.get_object()
        scores = AuditCriteria.objects.filter(audit=audit)
        serializer = AuditCriteriaSerializer(scores, many=True)
        return Response(serializer.data)

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['report_type', 'generated_by']
    search_fields = ['title', 'description']
    ordering_fields = ['generated_at', 'title']
    
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
