
import os
import django
import sys
import random
from datetime import datetime, timedelta

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mentalhealthiq.settings')
django.setup()

# Import models
from django.db import transaction
from mentalhealthiq.models import (
    User, Facility, Patient, AssessmentCriteria, Indicator, 
    Assessment, IndicatorScore, Audit, AuditCriteria
)

def clear_assessment_data():
    """Clear existing assessment data"""
    print("Clearing existing assessment/audit data...")
    IndicatorScore.objects.all().delete()
    AuditCriteria.objects.all().delete()
    Assessment.objects.all().delete()
    Audit.objects.all().delete()
    print("Assessment/audit data cleared successfully.")

def get_random_rating():
    """Get a random rating"""
    ratings = ["pass", "high-partial", "partial", "low-partial", "fail"]
    weights = [0.3, 0.25, 0.2, 0.15, 0.1]  # Higher probability for better ratings
    return random.choices(ratings, weights=weights, k=1)[0]

def convert_rating_to_score(rating):
    """Convert rating to score"""
    rating_map = {
        "pass": 100,
        "high-partial": 75,
        "partial": 50,
        "low-partial": 25,
        "fail": 0
    }
    return rating_map.get(rating, 0)

def create_assessments():
    """Create patient assessments"""
    print("Creating patient assessments...")
    
    # Check required data
    if User.objects.count() == 0 or Patient.objects.count() == 0:
        print("Error: Users and patients must exist before creating assessments.")
        return False
    
    if AssessmentCriteria.objects.filter(purpose="Assessment").count() == 0:
        print("Error: Assessment criteria must exist before creating assessments.")
        return False
    
    # Get available users, patients, facilities, and criteria
    users = list(User.objects.filter(role__in=["evaluator", "admin", "superuser"]))
    if not users:
        users = list(User.objects.all())  # Fallback to any user
        
    patients = list(Patient.objects.all())
    criteria_list = list(AssessmentCriteria.objects.filter(purpose="Assessment"))
    
    # Create assessments
    assessment_count = min(50, len(patients) * 2)  # Up to 2 assessments per patient
    assessments_created = 0
    
    for _ in range(assessment_count):
        try:
            # Select random patient, user, and criterion
            patient = random.choice(patients)
            evaluator = random.choice(users)
            criterion = random.choice(criteria_list)
            
            # Get facility from patient
            facility = patient.facility
            if not facility:
                continue
                
            # Generate random date within the last year
            days_ago = random.randint(1, 365)
            assessment_date = datetime.now() - timedelta(days=days_ago)
            
            # Calculate weighted score based on indicators
            indicators = list(Indicator.objects.filter(criteria=criterion))
            total_score = 0
            total_weight = 0
            
            # Create the assessment
            with transaction.atomic():
                assessment = Assessment.objects.create(
                    patient=patient,
                    criteria=criterion,
                    evaluator=evaluator,
                    facility=facility,
                    assessment_date=assessment_date,
                    score=0,  # Will update after scoring indicators
                    notes=f"Assessment for {patient.first_name} {patient.last_name}. Generated on {assessment_date.strftime('%Y-%m-%d')}."
                )
                
                # Create indicator scores
                for indicator in indicators:
                    rating = get_random_rating()
                    score = convert_rating_to_score(rating)
                    
                    IndicatorScore.objects.create(
                        assessment=assessment,
                        indicator=indicator,
                        score=score,
                        rating=rating,  # Store the rating string for better reporting
                        notes=f"Score: {rating.replace('-', ' ').title()}"
                    )
                    
                    total_score += score * indicator.weight
                    total_weight += indicator.weight
                
                # Update overall assessment score
                final_score = round(total_score / total_weight, 1) if total_weight > 0 else 0
                assessment.score = final_score
                assessment.save()
                
                assessments_created += 1
                print(f"Created assessment for {patient.first_name} {patient.last_name} with score {final_score}")
        
        except Exception as e:
            print(f"Error creating assessment: {e}")
    
    print(f"Created {assessments_created} patient assessments.")
    return True

def create_audits():
    """Create facility audits"""
    print("Creating facility audits...")
    
    # Check required data
    if User.objects.count() == 0 or Facility.objects.count() == 0:
        print("Error: Users and facilities must exist before creating audits.")
        return False
    
    if AssessmentCriteria.objects.filter(purpose="Audit").count() == 0:
        print("Error: Audit criteria must exist before creating audits.")
        return False
    
    # Get available users, facilities, and criteria
    users = list(User.objects.filter(role__in=["evaluator", "admin", "superuser"]))
    if not users:
        users = list(User.objects.all())  # Fallback to any user
        
    facilities = list(Facility.objects.all())
    criteria_list = list(AssessmentCriteria.objects.filter(purpose="Audit"))
    
    # Create audits
    audit_count = min(30, len(facilities) * 3)  # Up to 3 audits per facility
    audits_created = 0
    
    for facility in facilities:
        # Create 1-3 audits per facility with different dates
        for audit_num in range(random.randint(1, 3)):
            try:
                # Select random user
                auditor = random.choice(users)
                
                # Generate random date within the last year, with newer audits for higher numbers
                # This creates a time series of audits
                recency = audit_num * 2  # 0, 2, 4 months ago
                days_ago = random.randint(recency * 30, (recency + 2) * 30)
                audit_date = datetime.now() - timedelta(days=days_ago)
                
                # Calculate overall score from criteria
                overall_score = 0
                criteria_scores = []
                
                for criterion in criteria_list:
                    # Random score between 50 and 100 for each criterion
                    criterion_score = random.randint(50, 100)
                    overall_score += criterion_score
                    
                    criteria_scores.append({
                        "criterion": criterion,
                        "score": criterion_score,
                        "notes": f"Audit score for {criterion.name}"
                    })
                
                # Calculate average score
                overall_score = round(overall_score / len(criteria_list), 1) if criteria_list else 0
                
                # Create the audit
                with transaction.atomic():
                    audit = Audit.objects.create(
                        facility=facility,
                        auditor=auditor,
                        audit_date=audit_date,
                        overall_score=overall_score,
                        status="Completed",
                        notes=f"Facility audit for {facility.name}. Generated on {audit_date.strftime('%Y-%m-%d')}."
                    )
                    
                    # Create criteria scores
                    for score_data in criteria_scores:
                        AuditCriteria.objects.create(
                            audit=audit,
                            criteria_name=score_data["criterion"].name,
                            score=score_data["score"],
                            notes=score_data["notes"]
                        )
                    
                    audits_created += 1
                    print(f"Created audit for {facility.name} with score {overall_score}")
            
            except Exception as e:
                print(f"Error creating audit: {e}")
    
    print(f"Created {audits_created} facility audits.")
    return True

@transaction.atomic
def populate_assessments_and_audits():
    """Main function to populate assessments and audits"""
    try:
        print("Starting assessment/audit population...")
        
        if len(sys.argv) > 1 and sys.argv[1] == "--keep-existing":
            print("Skipping clear step as --keep-existing flag was provided")
        else:
            clear_assessment_data()
        
        create_assessments()
        create_audits()
        
        total_assessments = Assessment.objects.count()
        total_indicators = IndicatorScore.objects.count()
        total_audits = Audit.objects.count()
        total_audit_criteria = AuditCriteria.objects.count()
        
        print("\nPopulation completed successfully!")
        print(f"- Created {total_assessments} patient assessments")
        print(f"- Created {total_indicators} indicator scores")
        print(f"- Created {total_audits} facility audits")
        print(f"- Created {total_audit_criteria} audit criteria scores")
        
        return True
    except Exception as e:
        print(f"Error populating assessment/audit data: {str(e)}")
        return False

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--keep-existing":
        print("Skipping clear step as --keep-existing flag was provided")
        create_assessments()
        create_audits()
    else:
        populate_assessments_and_audits()
