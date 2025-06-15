from rest_framework import viewsets, status
from rest_framework.decorators import action, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Avg, Count
from django.utils import timezone
from datetime import timedelta
from .models import (
    BenchmarkCriteria,
    BenchmarkComparison,
    FacilityRanking,
    Facility,
    Audit,
    Assessment,
    Patient
)
from .serializers import (
    BenchmarkCriteriaSerializer,
    BenchmarkComparisonSerializer,
    FacilityRankingSerializer
)

class BenchmarkCriteriaViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing benchmark criteria.
    """
    queryset = BenchmarkCriteria.objects.all()
    serializer_class = BenchmarkCriteriaSerializer
    permission_classes = [AllowAny]

class BenchmarkComparisonViewSet(viewsets.ModelViewSet):
    """
    ViewSet for comparing facilities based on simplified metrics.
    """
    queryset = BenchmarkComparison.objects.all()
    serializer_class = BenchmarkComparisonSerializer
    permission_classes = [AllowAny]

    @staticmethod
    def _calculate_facility_metrics(facility, start_date):
        """Calculate simplified metrics for a facility."""
        # Calculate audit scores (90-day window)
        audit_window = start_date - timedelta(days=90)
        audit_scores = Audit.objects.filter(
            facility=facility,
            audit_date__gte=audit_window,
            status='completed'
        ).aggregate(
            avg_score=Avg('overall_score'),
            count=Count('id')
        )

        # Calculate patient coverage
        total_patients = Patient.objects.filter(
            facility=facility,
            status='Active'
        ).count()

        patients_with_assessment = Patient.objects.filter(
            facility=facility,
            status='Active',
            assessments__isnull=False
        ).distinct().count()

        # Calculate recent assessments (30 days)
        assessment_window = start_date - timedelta(days=30)
        recent_assessments = Assessment.objects.filter(
            facility=facility,
            assessment_date__gte=assessment_window,
            status='completed'
        ).aggregate(
            count=Count('id'),
            avg_score=Avg('score')
        )

        coverage_percentage = (
            (patients_with_assessment / total_patients * 100)
            if total_patients > 0 else 0
        )

        return {
            'audit_scores': {
                'average': audit_scores['avg_score'] or 0,
                'count': audit_scores['count'] or 0,
                'period': '90 days'
            },
            'patient_coverage': {
                'total_patients': total_patients,
                'assessed_patients': patients_with_assessment,
                'coverage_percentage': round(coverage_percentage, 1)
            },
            'recent_assessments': {
                'count': recent_assessments['count'] or 0,
                'average_score': recent_assessments['avg_score'] or 0,
                'period': '30 days'
            }
        }

    @action(detail=False, methods=['post'])
    def compare_facilities(self, request):
        """Compare two facilities based on simplified metrics."""
        facility_a_id = request.data.get('facility_a')
        facility_b_id = request.data.get('facility_b')

        if not facility_a_id or not facility_b_id:
            return Response(
                {'error': 'Both facility_a and facility_b are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            facility_a = Facility.objects.get(id=facility_a_id)
            facility_b = Facility.objects.get(id=facility_b_id)
        except Facility.DoesNotExist:
            return Response(
                {'error': 'One or both facilities not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        comparison_date = timezone.now()
        metrics_a = self._calculate_facility_metrics(facility_a, comparison_date)
        metrics_b = self._calculate_facility_metrics(facility_b, comparison_date)

        comparison = BenchmarkComparison.objects.create(
            facility_a=facility_a,
            facility_b=facility_b,
            comparison_date=comparison_date,
            overall_score_a=metrics_a['audit_scores']['average'],
            overall_score_b=metrics_b['audit_scores']['average'],
            detailed_results={
                'facility_a': metrics_a,
                'facility_b': metrics_b
            },
            created_by=request.user if request.user.is_authenticated else None
        )

        return Response(
            self.serializer_class(comparison).data,
            status=status.HTTP_201_CREATED
        )

class FacilityRankingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing facility rankings.
    """
    queryset = FacilityRanking.objects.all()
    serializer_class = FacilityRankingSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'])
    def current_rankings(self, request):
        """Get the most recent rankings for all facilities."""
        # Get the latest ranking date
        latest_ranking = FacilityRanking.objects.order_by('-ranking_date').first()
        if not latest_ranking:
            return Response([])

        # Get all rankings for that date
        current_rankings = FacilityRanking.objects.filter(
            ranking_date=latest_ranking.ranking_date
        ).order_by('overall_rank')

        return Response(
            self.serializer_class(current_rankings, many=True).data
        )

    @action(detail=False, methods=['post'])
    def calculate_rankings(self, request):
        """Calculate and update rankings for all facilities."""
        ranking_date = timezone.now()
        facilities = Facility.objects.all()
        
        # Calculate scores for all facilities
        facility_scores = []
        for facility in facilities:
            metrics = BenchmarkComparisonViewSet._calculate_facility_metrics(
                facility, ranking_date
            )
            
            # Use audit score directly as the overall score
            overall_score = metrics['audit_scores']['average']
            
            facility_scores.append({
                'facility': facility,
                'score': overall_score
            })

        # Sort facilities by score
        facility_scores.sort(key=lambda x: x['score'], reverse=True)
        total_facilities = len(facility_scores)

        # Create or update rankings
        rankings = []
        for rank, facility_data in enumerate(facility_scores, 1):
            facility = facility_data['facility']
            
            # Get previous rank if exists
            previous_ranking = FacilityRanking.objects.filter(
                facility=facility
            ).order_by('-ranking_date').first()
            
            previous_rank = previous_ranking.overall_rank if previous_ranking else None

            ranking = FacilityRanking.objects.create(
                facility=facility,
                ranking_date=ranking_date,
                overall_rank=rank,
                total_facilities=total_facilities,
                audit_score=facility_data['score'],
                previous_rank=previous_rank
            )
            rankings.append(ranking)

        return Response(
            self.serializer_class(rankings, many=True).data,
            status=status.HTTP_201_CREATED
        ) 