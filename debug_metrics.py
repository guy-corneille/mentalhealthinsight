import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mentalhealthiq.settings')
django.setup()

from mentalhealthiq.models import AssessmentCriteria, Assessment, IndicatorScore, Facility, Audit, AuditCriteria
from django.db.models import Count, Avg

def debug_assessment_data():
    print("=== ASSESSMENT DATA DEBUG ===\n")
    
    # Check assessment criteria
    print("1. Assessment Criteria:")
    assessment_criteria = AssessmentCriteria.objects.filter(purpose="Assessment")
    for criteria in assessment_criteria:
        print(f"   - {criteria.name} (ID: {criteria.id})")
        indicators = criteria.indicators.all()
        print(f"     Indicators: {[i.name for i in indicators]}")
    print(f"   Total: {assessment_criteria.count()}\n")
    
    # Check assessments
    print("2. Assessments:")
    assessments = Assessment.objects.all()
    print(f"   Total assessments: {assessments.count()}\n")
    
    # Check assessments by criteria
    print("3. Assessments by Criteria:")
    for criteria in assessment_criteria:
        count = assessments.filter(criteria=criteria).count()
        print(f"   - {criteria.name}: {count} assessments")
    print()
    
    # Check indicator scores
    print("4. Indicator Scores:")
    indicator_scores = IndicatorScore.objects.all()
    print(f"   Total indicator scores: {indicator_scores.count()}\n")
    
    # Check indicator scores by criteria
    print("5. Indicator Scores by Criteria:")
    for criteria in assessment_criteria:
        scores = indicator_scores.filter(indicator__criteria=criteria)
        count = scores.count()
        avg_score = scores.aggregate(avg=Avg('score'))['avg'] if count > 0 else 0
        print(f"   - {criteria.name}: {count} scores, avg: {avg_score:.1f}")
    print()
    
    # Check audits
    print("6. Audits:")
    audits = Audit.objects.all()
    print(f"   Total audits: {audits.count()}\n")
    
    # Check audit criteria
    print("7. Audit Criteria:")
    audit_criteria = AssessmentCriteria.objects.filter(purpose="Audit")
    for criteria in audit_criteria:
        print(f"   - {criteria.name} (ID: {criteria.id})")
    print(f"   Total: {audit_criteria.count()}\n")
    
    # Check audit criteria scores
    print("8. Audit Criteria Scores:")
    audit_criteria_scores = AuditCriteria.objects.all()
    print(f"   Total audit criteria scores: {audit_criteria_scores.count()}")
    
    # Check audit criteria scores by criteria
    print("9. Audit Criteria Scores by Criteria:")
    for criteria in audit_criteria:
        scores = audit_criteria_scores.filter(criteria_name=criteria.name)
        count = scores.count()
        avg_score = scores.aggregate(avg=Avg('score'))['avg'] if count > 0 else 0
        print(f"   - {criteria.name}: {count} scores, avg: {avg_score:.1f}")
    print()

if __name__ == "__main__":
    debug_assessment_data()
