
from rest_framework import serializers
from .models import (
    User, PendingUser, Facility, StaffMember, StaffQualification,
    AssessmentCriteria, Indicator, Patient, Assessment, IndicatorScore,
    Audit, AuditCriteria, Report
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'display_name', 'phone_number', 'date_joined']
        read_only_fields = ['id', 'date_joined']

class PendingUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = PendingUser
        fields = ['id', 'username', 'email', 'role', 'display_name', 'phone_number', 'status', 'request_date']
        read_only_fields = ['id', 'request_date']

class FacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class StaffQualificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffQualification
        fields = ['id', 'qualification']

class StaffMemberSerializer(serializers.ModelSerializer):
    qualifications = StaffQualificationSerializer(many=True, read_only=True)
    facility_name = serializers.CharField(source='facility.name', read_only=True)
    
    class Meta:
        model = StaffMember
        fields = ['id', 'name', 'position', 'department', 'facility', 'facility_name', 
                 'join_date', 'status', 'email', 'phone', 'qualifications', 
                 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def validate_facility(self, value):
        """Ensure the facility exists in the database."""
        if not Facility.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Facility does not exist.")
        return value

class IndicatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Indicator
        fields = ['id', 'name', 'weight']

class AssessmentCriteriaSerializer(serializers.ModelSerializer):
    indicators = IndicatorSerializer(many=True, read_only=True)
    
    class Meta:
        model = AssessmentCriteria
        fields = ['id', 'name', 'category', 'description', 'indicators', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class PatientSerializer(serializers.ModelSerializer):
    facility_name = serializers.CharField(source='facility.name', read_only=True)
    
    class Meta:
        model = Patient
        fields = ['id', 'first_name', 'last_name', 'date_of_birth', 'gender', 
                 'address', 'phone', 'email', 'national_id', 'status', 
                 'facility', 'facility_name', 'registration_date', 
                 'emergency_contact_name', 'emergency_contact_phone', 
                 'notes', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
        
    def validate_facility(self, value):
        """Ensure the facility exists in the database."""
        if not Facility.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Facility does not exist.")
        return value

class IndicatorScoreSerializer(serializers.ModelSerializer):
    indicator_name = serializers.CharField(source='indicator.name', read_only=True)
    
    class Meta:
        model = IndicatorScore
        fields = ['id', 'indicator', 'indicator_name', 'score', 'notes']

class AssessmentSerializer(serializers.ModelSerializer):
    indicator_scores = IndicatorScoreSerializer(many=True, read_only=True)
    patient_name = serializers.SerializerMethodField()
    criteria_name = serializers.CharField(source='criteria.name', read_only=True)
    evaluator_name = serializers.CharField(source='evaluator.display_name', read_only=True)
    facility_name = serializers.CharField(source='facility.name', read_only=True)
    
    class Meta:
        model = Assessment
        fields = ['id', 'patient', 'patient_name', 'criteria', 'criteria_name',
                 'evaluator', 'evaluator_name', 'facility', 'facility_name',
                 'assessment_date', 'score', 'notes', 'indicator_scores',
                 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"
    
    def validate(self, data):
        """
        Check that the assessment makes sense.
        """
        # Ensure facility exists
        if not Facility.objects.filter(id=data['facility'].id).exists():
            raise serializers.ValidationError("Facility does not exist.")
        
        # Ensure patient exists and belongs to the specified facility
        try:
            patient = Patient.objects.get(id=data['patient'].id)
            if patient.facility.id != data['facility'].id:
                raise serializers.ValidationError("Patient does not belong to the specified facility.")
        except Patient.DoesNotExist:
            raise serializers.ValidationError("Patient does not exist.")
            
        return data

class AuditCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditCriteria
        fields = ['id', 'criteria_name', 'score', 'notes']

class AuditSerializer(serializers.ModelSerializer):
    criteria_scores = AuditCriteriaSerializer(many=True, read_only=True)
    facility_name = serializers.CharField(source='facility.name', read_only=True)
    auditor_name = serializers.CharField(source='auditor.display_name', read_only=True)
    
    class Meta:
        model = Audit
        fields = ['id', 'facility', 'facility_name', 'auditor', 'auditor_name',
                 'audit_date', 'overall_score', 'status', 'notes', 
                 'criteria_scores', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_overall_score(self, value):
        """
        Check that the overall score is between 0 and 100.
        """
        if value < 0 or value > 100:
            raise serializers.ValidationError("Overall score must be between 0 and 100.")
        return value
    
    def validate_facility(self, value):
        """Ensure the facility exists in the database."""
        if not Facility.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Facility does not exist.")
        return value

class ReportSerializer(serializers.ModelSerializer):
    generated_by_name = serializers.CharField(source='generated_by.display_name', read_only=True)
    
    class Meta:
        model = Report
        fields = ['id', 'title', 'report_type', 'description', 'generated_by', 
                 'generated_by_name', 'generated_at', 'file_path', 'parameters']
        read_only_fields = ['id', 'generated_at']
