from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Avg, Count
from django.utils.dateparse import parse_date

from .models import Facility, AssessmentCriteria, Audit, AuditCriteria

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def audit_statistics(request):
    try:
        # Parse filter parameters from request
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        facility_id = request.query_params.get('facility')
        
        # Start with all audits
        audits = Audit.objects.all()
        
        # Apply filters if provided
        if start_date and end_date:
            try:
                start = parse_date(start_date)
                end = parse_date(end_date)
                audits = audits.filter(audit_date__date__range=[start, end])
            except:
                return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)
        
        if facility_id:
            try:
                facility_id = int(facility_id)
                audits = audits.filter(facility_id=facility_id)
            except ValueError:
                return Response({"error": f"Invalid facility ID: {facility_id}"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate basic statistics
        total_count = audits.count()
        average_score = audits.aggregate(Avg('overall_score'))['overall_score__avg']
        average_score = round(average_score, 1) if average_score else 0
        
        # Count by period (month)
        counts_by_month = {}
        for audit in audits:
            month_key = audit.audit_date.strftime('%Y-%m')
            counts_by_month[month_key] = counts_by_month.get(month_key, 0) + 1
        
        count_by_period = []
        for month, count in sorted(counts_by_month.items()):
            count_by_period.append({
                "period": f"{month}-01",  # First day of the month
                "count": count
            })
        
        # Count by facility
        count_by_facility = []
        facility_counts = audits.values('facility').annotate(count=Count('id'))
        
        for fc in facility_counts:
            facility_id = fc['facility']
            try:
                facility = Facility.objects.get(id=facility_id)
                count_by_facility.append({
                    "facilityId": facility_id,
                    "facilityName": facility.name,
                    "count": fc['count']
                })
            except Facility.DoesNotExist:
                # Skip if facility doesn't exist
                continue
        
        # Count by type (using a mock data approach since we don't have explicit types)
        count_by_type = {
            "initial": audits.filter(status="scheduled").count(),
            "followup": audits.filter(status="in_progress").count(),
            "discharge": audits.filter(status="completed").count()
        }
        
        # Calculate "patient" coverage - this is a proxy for how comprehensive the audits are
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
            "averageScore": average_score,
            "patientCoverage": coverage,
            "countByPeriod": count_by_period,
            "countByFacility": count_by_facility,
            "countByType": count_by_type,
            "scoreByCriteria": criteria_scores
        }
        
        return Response(statistics, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
