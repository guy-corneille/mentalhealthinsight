from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q, Max, Avg, Count
from .models import MetricSnapshot, Facility, Assessment, Report, Audit, Patient
from .serializers import MetricSnapshotSerializer, ReportSerializer
from datetime import timedelta
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny
from .pagination import StandardResultsSetPagination
from .views import BaseViewSet
from django.db.models.functions import TruncMonth

class MetricsViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing facility metrics.
    """
    queryset = MetricSnapshot.objects.all()
    serializer_class = MetricSnapshotSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        # Order by most recent first
        return queryset.order_by('-timestamp')

    @action(detail=False, methods=['get'])
    def facility(self, request):
        """Get metrics for all facilities"""
        # Get all active facilities
        facilities = Facility.objects.filter(status='Active')
        facility_metrics = []
        
        # For each facility, get its latest metric
        for facility in facilities:
            latest = MetricSnapshot.objects.filter(
                facility=facility
            ).order_by('-timestamp').first()
            
            if latest:
                facility_metrics.append(latest)
        
        serializer = self.get_serializer(facility_metrics, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        """Get historical metrics for a specific facility"""
        # Get date range from query params
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        queryset = self.get_queryset().filter(facility=pk)
        
        if start_date:
            queryset = queryset.filter(timestamp__gte=start_date)
        if end_date:
            queryset = queryset.filter(timestamp__lte=end_date)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def detailed(self, request, pk=None):
        """Get detailed metrics for a specific facility"""
        try:
            facility = Facility.objects.get(pk=pk)
            current_time = timezone.now()
            today_start = current_time.replace(hour=0, minute=0, second=0, microsecond=0)
            ninety_days_ago = current_time - timedelta(days=90)

            # Get latest metrics
            latest_metrics = MetricSnapshot.objects.filter(
                facility=facility
            ).order_by('-timestamp').first()

            if not latest_metrics:
                return Response({
                    'error': 'No metrics found for this facility'
                }, status=404)

            # Get assessment status breakdown
            today_assessments = Assessment.objects.filter(
                facility=facility,
                scheduled_date__range=(today_start, current_time)
            ).values('status').count()

            ninety_day_assessments = Assessment.objects.filter(
                facility=facility,
                scheduled_date__range=(ninety_days_ago, current_time)
            ).values('status').count()

            # Prepare the response
            response_data = {
                'facility': {
                    'id': facility.id,
                    'name': facility.name,
                    'status': facility.status,
                    'capacity': facility.capacity,
                    'type': facility.facility_type,
                },
                'current_metrics': {
                    'timestamp': latest_metrics.timestamp,
                    'active_patients': latest_metrics.active_patients,
                    'capacity_utilization': latest_metrics.capacity_utilization,
                    'today': {
                        'total_assessments': latest_metrics.scheduled_assessments,
                        'completed_assessments': latest_metrics.completed_assessments,
                        'completion_rate': latest_metrics.completion_rate,
                    },
                    'ninety_days': {
                        'total_assessments': getattr(latest_metrics, 'ninety_day_total_assessments', 0),
                        'completed_assessments': getattr(latest_metrics, 'ninety_day_completed_assessments', 0),
                        'completion_rate': getattr(latest_metrics, 'ninety_day_completion_rate', 0.0),
                    }
                },
                'assessment_breakdown': {
                    'today': today_assessments,
                    'ninety_days': ninety_day_assessments,
                }
            }

            return Response(response_data)
        except Facility.DoesNotExist:
            return Response({
                'error': 'Facility not found'
            }, status=404)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=500) 
        return Response(serializer.data) 

class ReportViewSet(BaseViewSet):
    """API endpoints for managing reports"""
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    filterset_fields = ['report_type', 'generated_by']
    search_fields = ['title', 'description']
    ordering_fields = ['generated_at', 'title']
    
    @action(detail=False, methods=['get'], url_path='assessment-statistics')
    def assessment_statistics(self, request):
        """Get basic assessment statistics"""
        try:
            # Get date range from query params
            start_date = request.query_params.get('params[startDate]')
            end_date = request.query_params.get('params[endDate]')
            
            # Get base queryset for all assessments
            assessments = Assessment.objects.all()
            
            # Apply date filters if provided
            if start_date:
                assessments = assessments.filter(assessment_date__gte=start_date)
            if end_date:
                assessments = assessments.filter(assessment_date__lte=end_date)
            
            # Calculate basic statistics
            total_count = assessments.count()
            avg_score = assessments.exclude(score=None).aggregate(
                avg_score=Avg('score')
            )['avg_score'] or 0
            
            # Calculate patient coverage
            total_patients = Patient.objects.filter(status='Active').count()
            patients_with_assessment = Patient.objects.filter(
                status='Active',
                assessments__isnull=False
            ).distinct().count()
            
            patient_coverage = (
                (patients_with_assessment / total_patients * 100)
                if total_patients > 0 else 0
            )
            
            # Count by facility - format for frontend
            facility_counts = assessments.values('facility__id', 'facility__name').annotate(
                count=Count('id')
            ).order_by('-count')
            
            # Format facility data for frontend
            count_by_facility = [
                {
                    'facilityId': str(item['facility__id']),
                    'facilityName': item['facility__name'],
                    'count': item['count']
                }
                for item in facility_counts
            ]
            
            # Generate count by period (monthly breakdown)
            count_by_period = assessments.annotate(
                month=TruncMonth('assessment_date')
            ).values('month').annotate(
                count=Count('id')
            ).order_by('month')
            
            # Format period data for frontend
            period_data = [
                {
                    'period': item['month'].strftime('%Y-%m'),
                    'count': item['count']
                }
                for item in count_by_period if item['month']
            ]
            
            # Get criteria data and calculate averages
            criteria_data = {}
            for assessment in assessments:
                for indicator_score in assessment.indicator_scores.all():
                    criteria_name = indicator_score.indicator.criteria.name
                    criteria_id = str(indicator_score.indicator.criteria.id)
                    if criteria_id not in criteria_data:
                        criteria_data[criteria_id] = {
                            'criteriaId': criteria_id,
                            'criteriaName': criteria_name,
                            'total_score': 0,
                            'count': 0
                        }
                    criteria_data[criteria_id]['total_score'] += indicator_score.score
                    criteria_data[criteria_id]['count'] += 1
            
            # Calculate average scores for each criteria
            score_by_criteria = [
                {
                    'criteriaId': data['criteriaId'],
                    'criteriaName': data['criteriaName'],
                    'averageScore': round(data['total_score'] / data['count'], 2)
                }
                for data in criteria_data.values()
            ]
            
            return Response({
                'totalCount': total_count,
                'averageScore': round(avg_score, 2),
                'patientCoverage': round(patient_coverage, 1),
                'countByFacility': count_by_facility,
                'countByPeriod': period_data,
                'scoreByCriteria': score_by_criteria
            })
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'], url_path='audits/count')
    def audit_count(self, request):
        """Get count of audits within a date range"""
        try:
            # Get date range from nested params
            params = request.query_params.get('params', {})
            if isinstance(params, str):
                import json
                params = json.loads(params)
            
            start_date = params.get('startDate')
            end_date = params.get('endDate')
            
            # Get base queryset for all audits
            audits = Audit.objects.all()
            
            # Apply date filters if provided
            if start_date:
                audits = audits.filter(audit_date__gte=start_date)
            if end_date:
                audits = audits.filter(audit_date__lte=end_date)
            
            # Calculate total count
            total_count = audits.count()
            
            return Response({
                'total_audits': total_count
            })
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'], url_path='audit-statistics')
    def audit_statistics(self, request):
        """Get basic audit statistics"""
        try:
            # Get date range from query params
            start_date = request.query_params.get('params[startDate]')
            end_date = request.query_params.get('params[endDate]')
            
            # Get base queryset for all audits
            audits = Audit.objects.all()
            
            # Apply date filters if provided
            if start_date:
                audits = audits.filter(audit_date__gte=start_date)
            if end_date:
                audits = audits.filter(audit_date__lte=end_date)
            
            # Calculate basic statistics
            total_count = audits.count()
            avg_score = audits.exclude(overall_score=None).aggregate(
                avg_score=Avg('overall_score')
            )['avg_score'] or 0
            
            # Count by facility
            facility_counts = audits.values('facility__name').annotate(
                count=Count('id')
            ).order_by('-count')
            
            # Get criteria data and calculate averages
            criteria_data = {}
            for audit in audits:
                for criteria_score in audit.criteria_scores.all():
                    if criteria_score.criteria_name not in criteria_data:
                        criteria_data[criteria_score.criteria_name] = {
                            'name': criteria_score.criteria_name,
                            'total_score': 0,
                            'count': 0
                        }
                    criteria_data[criteria_score.criteria_name]['total_score'] += criteria_score.score
                    criteria_data[criteria_score.criteria_name]['count'] += 1
            
            # Calculate average scores for each criteria
            criteria_list = [
                {
                    'name': name,
                    'averageScore': round(data['total_score'] / data['count'], 2)
                }
                for name, data in criteria_data.items()
            ]
            
            # Format the response to match frontend expectations
            response_data = {
                'summary': {
                    'totalCount': total_count,
                    'averageScore': round(avg_score, 2)
                },
                'facilities': [
                    {
                        'facilityName': item['facility__name'],
                        'count': item['count']
                    }
                    for item in facility_counts
                ],
                'criteria': criteria_list
            }
            
            return Response(response_data)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 