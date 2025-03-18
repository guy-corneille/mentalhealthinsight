
import os
import django
import sys

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mentalhealthiq.settings')
django.setup()

# Import models
from django.db import transaction
from mentalhealthiq.models import AssessmentCriteria, Indicator

def clear_criteria_data():
    """Clear existing criteria data"""
    print("Clearing existing assessment/audit criteria data...")
    Indicator.objects.all().delete()
    AssessmentCriteria.objects.all().delete()
    print("Criteria data cleared successfully.")

def create_assessment_criteria():
    """Create assessment criteria with indicators"""
    print("Creating assessment criteria and indicators...")
    
    criteria_data = [
        {
            "name": "Mental Health Assessment",
            "category": "Clinical",
            "description": "Evaluation of patient's mental health status",
            "purpose": "Assessment",
            "indicators": [
                {"name": "Depression Screening", "weight": 0.3},
                {"name": "Anxiety Assessment", "weight": 0.3},
                {"name": "Suicide Risk", "weight": 0.4}
            ]
        },
        {
            "name": "Treatment Planning",
            "category": "Clinical",
            "description": "Evaluation of treatment planning process",
            "purpose": "Assessment",
            "indicators": [
                {"name": "Goals Defined", "weight": 0.25},
                {"name": "Patient Involvement", "weight": 0.25},
                {"name": "Evidence-Based Approaches", "weight": 0.25},
                {"name": "Regular Review", "weight": 0.25}
            ]
        },
        {
            "name": "Patient Rights",
            "category": "Ethical",
            "description": "Assessment of respect for patient rights",
            "purpose": "Assessment",
            "indicators": [
                {"name": "Informed Consent", "weight": 0.25},
                {"name": "Confidentiality", "weight": 0.25},
                {"name": "Complaint Process", "weight": 0.25},
                {"name": "Dignity & Respect", "weight": 0.25}
            ]
        },
        {
            "name": "Care Coordination",
            "category": "Administrative",
            "description": "Evaluation of coordination among providers",
            "purpose": "Assessment",
            "indicators": [
                {"name": "Information Sharing", "weight": 0.3},
                {"name": "Referral Process", "weight": 0.3},
                {"name": "Discharge Planning", "weight": 0.4}
            ]
        }
    ]
    
    for data in criteria_data:
        try:
            criterion = AssessmentCriteria.objects.create(
                name=data["name"],
                category=data["category"],
                description=data["description"],
                purpose=data["purpose"]
            )
            
            for indicator_data in data["indicators"]:
                Indicator.objects.create(
                    criteria=criterion,
                    name=indicator_data["name"],
                    weight=indicator_data["weight"]
                )
            
            print(f"Created assessment criterion: {criterion.name} with {len(data['indicators'])} indicators")
        
        except Exception as e:
            print(f"Error creating criterion: {e}")
            raise
    
    print(f"Created {len(criteria_data)} assessment criteria with indicators.")

def create_audit_criteria():
    """Create audit criteria with indicators"""
    print("Creating audit criteria and indicators...")
    
    criteria_data = [
        {
            "name": "Therapeutic Environment",
            "category": "Facility",
            "description": "Assessment of the healing environment",
            "purpose": "Audit",
            "indicators": [
                {"name": "Safety Measures", "weight": 0.3},
                {"name": "Comfort & Privacy", "weight": 0.3},
                {"name": "Therapeutic Activities", "weight": 0.4}
            ]
        },
        {
            "name": "Staff Competency",
            "category": "Administrative",
            "description": "Evaluation of staff qualifications and training",
            "purpose": "Audit",
            "indicators": [
                {"name": "Required Credentials", "weight": 0.4},
                {"name": "Continuing Education", "weight": 0.3},
                {"name": "Supervision Quality", "weight": 0.3}
            ]
        },
        {
            "name": "Outcomes Measurement",
            "category": "Quality Improvement",
            "description": "Assessment of outcome tracking systems",
            "purpose": "Audit",
            "indicators": [
                {"name": "Standard Measures Used", "weight": 0.3},
                {"name": "Regular Data Collection", "weight": 0.3},
                {"name": "Results Utilization", "weight": 0.4}
            ]
        },
        {
            "name": "Documentation Quality",
            "category": "Administrative",
            "description": "Evaluation of record-keeping standards",
            "purpose": "Audit",
            "indicators": [
                {"name": "Completeness", "weight": 0.4},
                {"name": "Timeliness", "weight": 0.3},
                {"name": "Accuracy", "weight": 0.3}
            ]
        }
    ]
    
    for data in criteria_data:
        try:
            criterion = AssessmentCriteria.objects.create(
                name=data["name"],
                category=data["category"],
                description=data["description"],
                purpose=data["purpose"]
            )
            
            for indicator_data in data["indicators"]:
                Indicator.objects.create(
                    criteria=criterion,
                    name=indicator_data["name"],
                    weight=indicator_data["weight"]
                )
            
            print(f"Created audit criterion: {criterion.name} with {len(data['indicators'])} indicators")
        
        except Exception as e:
            print(f"Error creating criterion: {e}")
            raise
    
    print(f"Created {len(criteria_data)} audit criteria with indicators.")

@transaction.atomic
def populate_criteria():
    """Main function to populate criteria"""
    try:
        print("Starting criteria population...")
        clear_criteria_data()
        create_assessment_criteria()
        create_audit_criteria()
        
        total_criteria = AssessmentCriteria.objects.count()
        total_indicators = Indicator.objects.count()
        
        print("\nCriteria populated successfully!")
        print(f"- Created {total_criteria} criteria")
        print(f"- Created {total_indicators} indicators")
        
        assessment_count = AssessmentCriteria.objects.filter(purpose="Assessment").count()
        audit_count = AssessmentCriteria.objects.filter(purpose="Audit").count()
        print(f"- {assessment_count} assessment criteria")
        print(f"- {audit_count} audit criteria")
        
        return True
    except Exception as e:
        print(f"Error populating criteria: {str(e)}")
        return False

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--keep-existing":
        print("Skipping clear step as --keep-existing flag was provided")
        create_assessment_criteria()
        create_audit_criteria()
    else:
        populate_criteria()
