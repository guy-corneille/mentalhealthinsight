import os
import django
import random
from datetime import date, datetime, timedelta
import json

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'healthquality.settings')
django.setup()

# Import models
from django.db import transaction
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db.utils import IntegrityError

from healthcare.models import (
    User, PendingUser, Facility, StaffMember, StaffQualification,
    AssessmentCriteria, Indicator, Patient, Assessment, IndicatorScore,
    Audit, AuditCriteria, Report
)

User = get_user_model()

# Clear all existing data
def clear_data():
    print("Clearing existing data...")
    Report.objects.all().delete()
    AuditCriteria.objects.all().delete()
    Audit.objects.all().delete()
    IndicatorScore.objects.all().delete()
    Assessment.objects.all().delete()
    Patient.objects.all().delete()
    Indicator.objects.all().delete()
    AssessmentCriteria.objects.all().delete()
    StaffQualification.objects.all().delete()
    StaffMember.objects.all().delete()
    Facility.objects.all().delete()
    PendingUser.objects.filter(status__in=['pending', 'rejected']).delete()
    User.objects.exclude(is_superuser=True).delete()  # Keep superusers intact
    print("Data cleared successfully.")

# Helper Functions
def random_date(start, end):
    """Generate a random date between start and end."""
    return start + timedelta(days=random.randint(0, (end - start).days))

def random_datetime(start, end):
    """Generate a random datetime between start and end."""
    return random_date(start, end)

def random_phone():
    """Generate a random phone number."""
    return f"+{random.randint(1, 9)}{random.randint(10, 99)}{random.randint(1000000, 9999999)}"

def random_email(name):
    """Generate a random email from a name."""
    domains = ["gmail.com", "yahoo.com", "outlook.com", "example.com", "healthorg.com"]
    sanitized_name = name.lower().replace(" ", ".")
    return f"{sanitized_name}@{random.choice(domains)}"

# Populate Users
def create_users(count=20):
    print(f"Creating {count} users...")
    users = []
    roles = ['admin', 'evaluator', 'viewer']
    first_names = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", 
                 "Linda", "William", "Elizabeth", "David", "Susan", "Richard", "Jessica", 
                 "Joseph", "Sarah", "Thomas", "Karen", "Charles", "Nancy"]
    
    last_names = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", 
                "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", 
                "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson"]

    # Create superuser if it doesn't exist
    if not User.objects.filter(username="admin").exists():
        User.objects.create_superuser(
            username="admin",
            email="admin@healthquality.org",
            password="admin123",
            role="superuser",
            display_name="System Administrator",
            phone_number=random_phone()
        )
        print("Superuser created.")

    for i in range(count):
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        display_name = f"{first_name} {last_name}"
        username = f"{first_name.lower()}{last_name.lower()}{random.randint(1, 999)}"
        email = random_email(f"{first_name} {last_name}")
        role = random.choice(roles)
        
        # Create active users
        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password="password123",
                role=role,
                display_name=display_name,
                phone_number=random_phone(),
                date_joined=random_datetime(datetime(2022, 1, 1), datetime.now())
            )
            users.append(user)
        except IntegrityError:
            # Skip if username already exists
            continue
    
    # Create some pending users
    for i in range(max(3, count // 5)):
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        display_name = f"{first_name} {last_name}"
        username = f"pending_{first_name.lower()}{random.randint(1, 999)}"
        email = random_email(f"pending.{first_name}")
        role = random.choice(roles)
        
        try:
            pending_user = PendingUser.objects.create(
                username=username,
                email=email,
                role=role,
                display_name=display_name,
                phone_number=random_phone(),
                status='pending',
                request_date=random_datetime(datetime.now() - timedelta(days=30), datetime.now())
            )
        except IntegrityError:
            # Skip if username already exists
            continue
    
    print(f"Created {len(users)} users and {PendingUser.objects.filter(status='pending').count()} pending users.")
    return users

# Populate Facilities
def create_facilities(count=15):
    print(f"Creating {count} facilities...")
    facilities = []
    facility_types = ["Hospital", "Clinic", "Community Center", "Specialized Unit", "Treatment Center"]
    provinces = ["Northern", "Southern", "Eastern", "Western", "Central"]
    districts = ["District A", "District B", "District C", "District D", "District E"]
    status_options = ["Active", "Under Review", "Probation", "Inactive"]
    
    for i in range(1, count + 1):
        facility_type = random.choice(facility_types)
        province = random.choice(provinces)
        district = random.choice(districts)
        name = f"{province} {facility_type} {i}"
        
        facility = Facility.objects.create(
            name=name,
            facility_type=facility_type,
            address=f"{random.randint(100, 999)} Main St, {district}",
            city=f"City {random.randint(1, 5)}",
            province=province,
            district=district,
            postal_code=f"{random.randint(10000, 99999)}",
            country="Country",
            phone=random_phone(),
            email=f"info@{name.lower().replace(' ', '')}.org",
            website=f"https://www.{name.lower().replace(' ', '')}.org",
            capacity=random.randint(20, 500),
            established_date=random_date(date(2000, 1, 1), date(2020, 12, 31)),
            last_inspection_date=random_date(date(2022, 1, 1), date.today()),
            contact_name=f"Contact Person {i}",
            contact_phone=random_phone(),
            contact_email=f"contact{i}@example.com",
            status=random.choice(status_options),
            description=f"Description for {name}. This is a {facility_type} located in {province}, {district}.",
            created_at=timezone.now(),
            updated_at=timezone.now()
        )
        facilities.append(facility)
    
    print(f"Created {len(facilities)} facilities.")
    return facilities

# Populate Staff with Qualifications
def create_staff(facilities, count_per_facility=10):
    print(f"Creating staff for {len(facilities)} facilities...")
    staff_members = []
    positions = ["Doctor", "Nurse", "Therapist", "Psychologist", "Psychiatrist", "Social Worker", "Administrator"]
    departments = ["Psychiatry", "Psychology", "Therapy", "Admin", "Social Services", "Outpatient", "Emergency"]
    status_options = ["Active", "On Leave", "Terminated", "Contract"]
    qualifications = ["MD", "PhD", "RN", "MSW", "LCSW", "PsyD", "MBA", "MPH", "BSc Nursing", "Certified Therapist"]
    
    for facility in facilities:
        for i in range(1, count_per_facility + 1):
            position = random.choice(positions)
            department = random.choice(departments)
            
            staff = StaffMember.objects.create(
                name=f"Staff Member {facility.id}-{i}",
                position=position,
                department=department,
                facility=facility,
                join_date=random_date(facility.established_date, date.today()),
                status=random.choice(status_options),
                email=f"staff{facility.id}.{i}@example.com",
                phone=random_phone(),
                created_at=timezone.now(),
                updated_at=timezone.now()
            )
            
            # Add 1-3 qualifications per staff
            for _ in range(random.randint(1, 3)):
                qual = random.choice(qualifications)
                StaffQualification.objects.create(
                    staff=staff,
                    qualification=qual
                )
            
            staff_members.append(staff)
    
    print(f"Created {len(staff_members)} staff members with qualifications.")
    return staff_members

# Populate Assessment Criteria and Indicators
def create_assessment_criteria():
    print("Creating assessment criteria and indicators...")
    criteria = []
    
    criteria_data = [
        {
            "name": "Mental Health Assessment",
            "category": "Clinical",
            "description": "Evaluation of patient's mental health status",
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
            "indicators": [
                {"name": "Goals Defined", "weight": 0.25},
                {"name": "Patient Involvement", "weight": 0.25},
                {"name": "Evidence-Based Approaches", "weight": 0.25},
                {"name": "Regular Review", "weight": 0.25}
            ]
        },
        {
            "name": "Medication Management",
            "category": "Clinical",
            "description": "Assessment of medication protocols",
            "indicators": [
                {"name": "Appropriate Prescription", "weight": 0.4},
                {"name": "Side Effects Monitoring", "weight": 0.3},
                {"name": "Medication Adherence", "weight": 0.3}
            ]
        },
        {
            "name": "Therapeutic Environment",
            "category": "Facility",
            "description": "Assessment of the healing environment",
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
            "indicators": [
                {"name": "Required Credentials", "weight": 0.4},
                {"name": "Continuing Education", "weight": 0.3},
                {"name": "Supervision Quality", "weight": 0.3}
            ]
        },
        {
            "name": "Patient Rights",
            "category": "Ethical",
            "description": "Assessment of respect for patient rights",
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
            "indicators": [
                {"name": "Information Sharing", "weight": 0.3},
                {"name": "Referral Process", "weight": 0.3},
                {"name": "Discharge Planning", "weight": 0.4}
            ]
        },
        {
            "name": "Outcomes Measurement",
            "category": "Quality Improvement",
            "description": "Assessment of outcome tracking systems",
            "indicators": [
                {"name": "Standard Measures Used", "weight": 0.3},
                {"name": "Regular Data Collection", "weight": 0.3},
                {"name": "Results Utilization", "weight": 0.4}
            ]
        }
    ]
    
    for data in criteria_data:
        criterion = AssessmentCriteria.objects.create(
            name=data["name"],
            category=data["category"],
            description=data["description"],
            created_at=timezone.now(),
            updated_at=timezone.now()
        )
        
        for indicator_data in data["indicators"]:
            Indicator.objects.create(
                criteria=criterion,
                name=indicator_data["name"],
                weight=indicator_data["weight"]
            )
        
        criteria.append(criterion)
    
    print(f"Created {len(criteria)} assessment criteria with indicators.")
    return criteria

# Populate Patients
def create_patients(facilities, count_per_facility=30):
    print(f"Creating patients for {len(facilities)} facilities...")
    patients = []
    genders = ["Male", "Female", "Other"]
    status_options = ["Active", "Discharged", "Transferred", "Deceased"]
    
    for facility in facilities:
        for i in range(1, count_per_facility + 1):
            dob = random_date(date(1950, 1, 1), date(2005, 12, 31))
            registration_date = random_date(date(2020, 1, 1), date.today())
            
            patient = Patient.objects.create(
                first_name=f"Patient{facility.id}{i}First",
                last_name=f"Patient{facility.id}{i}Last",
                date_of_birth=dob,
                gender=random.choice(genders),
                address=f"{random.randint(100, 999)} Patient St, City {random.randint(1, 10)}",
                phone=random_phone(),
                email=f"patient{facility.id}.{i}@example.com",
                national_id=f"ID{random.randint(10000000, 99999999)}",
                status=random.choice(status_options),
                facility=facility,
                registration_date=registration_date,
                emergency_contact_name=f"Emergency Contact {i}",
                emergency_contact_phone=random_phone(),
                notes=f"Patient notes for Patient {facility.id}-{i}.",
                created_at=timezone.now(),
                updated_at=timezone.now()
            )
            
            patients.append(patient)
    
    print(f"Created {len(patients)} patients.")
    return patients

# Populate Assessments and Indicator Scores
def create_assessments(patients, criteria, users, count_per_patient=3):
    print(f"Creating assessments for {len(patients)} patients...")
    assessments = []
    evaluators = [user for user in users if user.role == 'evaluator']
    
    if not evaluators:
        # If no evaluators, use any users
        evaluators = users
    
    for patient in patients:
        for i in range(count_per_patient):
            assessment_date = random_date(patient.registration_date, date.today())
            facility = patient.facility
            evaluator = random.choice(evaluators)
            criterion = random.choice(criteria)
            score = random.randint(60, 95)
            
            assessment = Assessment.objects.create(
                patient=patient,
                criteria=criterion,
                evaluator=evaluator,
                facility=facility,
                assessment_date=assessment_date,
                score=score,
                notes=f"Assessment notes for patient {patient.id}, assessment #{i+1}.",
                created_at=timezone.now(),
                updated_at=timezone.now()
            )
            
            # Create indicator scores for each indicator in the criterion
            indicators = Indicator.objects.filter(criteria=criterion)
            for indicator in indicators:
                indicator_score = random.randint(max(50, score-20), min(100, score+20))
                IndicatorScore.objects.create(
                    assessment=assessment,
                    indicator=indicator,
                    score=indicator_score,
                    notes=f"Notes for indicator {indicator.name} score."
                )
            
            assessments.append(assessment)
    
    print(f"Created {len(assessments)} assessments with indicator scores.")
    return assessments

# Populate Audits
def create_audits(facilities, criteria, users, count_per_facility=2):
    print(f"Creating audits for {len(facilities)} facilities...")
    audits = []
    status_options = ["Completed", "In Progress", "Scheduled", "Reported"]
    auditors = [user for user in users if user.role in ['admin', 'evaluator']]
    
    if not auditors:
        # If no appropriate users, use any users
        auditors = users
    
    for facility in facilities:
        for i in range(count_per_facility):
            audit_date = random_date(date(2022, 1, 1), date.today())
            auditor = random.choice(auditors)
            overall_score = random.randint(60, 95)
            
            audit = Audit.objects.create(
                facility=facility,
                auditor=auditor,
                audit_date=audit_date,
                overall_score=overall_score,
                status=random.choice(status_options),
                notes=f"Audit notes for facility {facility.name}, audit #{i+1}.",
                created_at=timezone.now(),
                updated_at=timezone.now()
            )
            
            # Create audit criteria scores (3-6 criteria per audit)
            selected_criteria = random.sample(list(criteria), min(random.randint(3, 6), len(criteria)))
            for criterion in selected_criteria:
                criterion_score = random.randint(max(50, overall_score-15), min(100, overall_score+15))
                AuditCriteria.objects.create(
                    audit=audit,
                    criteria_name=criterion.name,
                    score=criterion_score,
                    notes=f"Audit criteria notes for {criterion.name}."
                )
            
            audits.append(audit)
    
    print(f"Created {len(audits)} audits with criteria scores.")
    return audits

# Populate Reports
def create_reports(facilities, users, assessments, audits, count=15):
    print(f"Creating {count} reports...")
    reports = []
    report_types = ["assessment", "audit", "facility"]
    
    for i in range(count):
        report_type = random.choice(report_types)
        user = random.choice(users)
        generated_at = random_datetime(datetime(2022, 1, 1), datetime.now())
        
        # Create report parameters based on type
        parameters = {}
        if report_type == "assessment":
            assessment_ids = [assessment.id for assessment in random.sample(assessments, min(3, len(assessments)))]
            parameters = {
                "assessment_ids": assessment_ids,
                "date_range": {
                    "start": str(date.today() - timedelta(days=90)),
                    "end": str(date.today())
                }
            }
            title = f"Assessment Report {i+1}"
        elif report_type == "audit":
            audit_ids = [audit.id for audit in random.sample(audits, min(2, len(audits)))]
            parameters = {
                "audit_ids": audit_ids,
                "include_criteria": random.choice([True, False])
            }
            title = f"Audit Report {i+1}"
        else:  # facility
            facility_ids = [facility.id for facility in random.sample(facilities, min(3, len(facilities)))]
            parameters = {
                "facility_ids": facility_ids,
                "metrics": ["staff_ratio", "patient_outcomes", "compliance_rate"]
            }
            title = f"Facility Performance Report {i+1}"
        
        report = Report.objects.create(
            title=title,
            report_type=report_type,
            description=f"Description for {title}",
            generated_by=user,
            generated_at=generated_at,
            file_path=f"/reports/{report_type}_{i+1}_{generated_at.strftime('%Y%m%d')}.pdf",
            parameters=parameters
        )
        
        reports.append(report)
    
    print(f"Created {len(reports)} reports.")
    return reports

# Main execution
@transaction.atomic
def populate_database():
    try:
        print("Starting database population...")
        clear_data()
        
        # Create base data
        users = create_users(30)
        facilities = create_facilities(20)
        staff = create_staff(facilities, 15)
        criteria = create_assessment_criteria()
        
        # Create patients
        patients = create_patients(facilities, 40)
        
        # Create assessments and audits
        assessments = create_assessments(patients, criteria, users, 5)
        audits = create_audits(facilities, criteria, users, 3)
        
        # Create reports
        reports = create_reports(facilities, users, assessments, audits, 25)
        
        print("\nDatabase populated successfully!")
        print(f"Created:")
        print(f"- {User.objects.count()} users")
        print(f"- {PendingUser.objects.count()} pending users")
        print(f"- {Facility.objects.count()} facilities")
        print(f"- {StaffMember.objects.count()} staff members")
        print(f"- {StaffQualification.objects.count()} staff qualifications")
        print(f"- {AssessmentCriteria.objects.count()} assessment criteria")
        print(f"- {Indicator.objects.count()} indicators")
        print(f"- {Patient.objects.count()} patients")
        print(f"- {Assessment.objects.count()} assessments")
        print(f"- {IndicatorScore.objects.count()} indicator scores")
        print(f"- {Audit.objects.count()} audits")
        print(f"- {AuditCriteria.objects.count()} audit criteria scores")
        print(f"- {Report.objects.count()} reports")
        
        return True
    except Exception as e:
        print(f"Error populating database: {str(e)}")
        return False

if __name__ == "__main__":
    populate_database()