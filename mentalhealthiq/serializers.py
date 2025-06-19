from rest_framework import serializers
from .models import (
    User, PendingUser, Facility, StaffMember, StaffQualification,
    AssessmentCriteria, Indicator, Patient, Assessment, IndicatorScore,
    Audit, AuditCriteria, Report, BenchmarkCriteria, BenchmarkComparison, FacilityRanking, MetricSnapshot,
    FeedbackComment, Feedback
)
from django.utils import timezone

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'display_name', 'phone_number', 'status', 'date_joined']
        read_only_fields = ['id', 'date_joined']

class PendingUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = PendingUser
        fields = ['id', 'username', 'email', 'role', 'display_name', 'phone_number', 'position', 'password', 'status', 'request_date']
        read_only_fields = ['id', 'request_date']
        extra_kwargs = {
            'password': {'write_only': True}
        }

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
    indicators = IndicatorSerializer(many=True, read_only=False, required=False)
    
    class Meta:
        model = AssessmentCriteria
        fields = ['id', 'name', 'category', 'description', 'purpose', 'indicators', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        indicators_data = validated_data.pop('indicators', [])
        criterion = AssessmentCriteria.objects.create(**validated_data)
        
        for indicator_data in indicators_data:
            Indicator.objects.create(criteria=criterion, **indicator_data)
        
        return criterion
    
    def update(self, instance, validated_data):
        indicators_data = validated_data.pop('indicators', [])
        
        # Update criterion fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Clear existing indicators and create new ones
        instance.indicators.all().delete()
        for indicator_data in indicators_data:
            Indicator.objects.create(criteria=instance, **indicator_data)
        
        return instance

class PatientSerializer(serializers.ModelSerializer):
    facility_name = serializers.CharField(source='facility.name', read_only=True)
    primary_staff_name = serializers.CharField(source='primary_staff.name', read_only=True)
    
    class Meta:
        model = Patient
        fields = ['id', 'first_name', 'last_name', 'date_of_birth', 'gender', 
                 'address', 'phone', 'email', 'national_id', 'status', 
                 'facility', 'facility_name', 'primary_staff', 'primary_staff_name',
                 'registration_date', 'emergency_contact_name', 
                 'emergency_contact_phone', 'notes', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
        
    def validate_facility(self, value):
        """Ensure the facility exists in the database."""
        if not Facility.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Facility does not exist.")
        return value
        
    def validate_primary_staff(self, value):
        """Ensure the staff member belongs to the patient's facility."""
        if value and self.initial_data.get('facility'):
            if value.facility.id != self.initial_data['facility']:
                raise serializers.ValidationError("Staff member must belong to the patient's facility.")
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
    is_upcoming = serializers.BooleanField(read_only=True)
    is_overdue = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Assessment
        fields = ['id', 'patient', 'patient_name', 'criteria', 'criteria_name',
                 'evaluator', 'evaluator_name', 'facility', 'facility_name',
                 'assessment_date', 'scheduled_date', 'score', 'status',
                 'missed_reason', 'notes', 'indicator_scores', 'is_upcoming',
                 'is_overdue', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_upcoming', 'is_overdue']
    
    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"
    
    def validate(self, data):
        """
        Check that the assessment makes sense.
        """
        # Ensure patient belongs to the specified facility
        patient = data['patient']
        facility = data['facility']
        # patient may be a Patient instance or a string (id)
        if isinstance(patient, str):
            try:
                patient_obj = Patient.objects.get(id=patient)
            except Patient.DoesNotExist:
                raise serializers.ValidationError("Patient does not exist.")
        else:
            patient_obj = patient
        if patient_obj.facility is None or patient_obj.facility.id != facility.id:
            raise serializers.ValidationError("Patient does not belong to the specified facility.")
        
        # Validate scheduled_date is not in the past for new assessments
        if not self.instance and 'scheduled_date' in data:
            current_time = timezone.now()
            if data['scheduled_date'] < current_time:
                raise serializers.ValidationError("Scheduled date cannot be in the past.")
        
        # Make criteria and evaluator optional for scheduled assessments
        if data.get('status') == 'scheduled':
            # For scheduled assessments, ensure these fields are not set
            data['criteria'] = None
            data['evaluator'] = None
            data['assessment_date'] = None
            data['score'] = 0
        else:
            # For completed assessments, ensure all required fields are provided
            if not data.get('criteria'):
                raise serializers.ValidationError("Criteria is required for completed assessments.")
            if not data.get('assessment_date'):
                raise serializers.ValidationError("Assessment date is required for completed assessments.")
        return data

class AuditCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditCriteria
        fields = ['id', 'criteria_name', 'score', 'notes']

class AuditSerializer(serializers.ModelSerializer):
    criteria_scores = AuditCriteriaSerializer(many=True, read_only=True)
    facility_name = serializers.CharField(source='facility.name', read_only=True)
    auditor_name = serializers.CharField(source='auditor.display_name', read_only=True)
    is_upcoming = serializers.BooleanField(read_only=True)
    is_overdue = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Audit
        fields = ['id', 'facility', 'facility_name', 'auditor', 'auditor_name',
                 'audit_date', 'scheduled_date', 'overall_score', 'status', 
                 'missed_reason', 'notes', 'criteria_scores', 'is_upcoming',
                 'is_overdue', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_upcoming', 'is_overdue']
    
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
        
    def validate(self, data):
        """
        Validate the audit data.
        """
        # For partial updates (PATCH), we only validate fields that are being updated
        if self.instance:  # This is an update
            # Only validate facility if it's being updated
            if 'facility' in data:
                facility_id = data['facility'].id if hasattr(data['facility'], 'id') else data['facility']
                if not Facility.objects.filter(id=facility_id).exists():
                    raise serializers.ValidationError({"facility": "Facility does not exist."})
        else:  # This is a creation
            if 'facility' not in data:
                raise serializers.ValidationError({"facility": "Facility is required when creating an audit."})
            facility_id = data['facility'].id if hasattr(data['facility'], 'id') else data['facility']
            if not Facility.objects.filter(id=facility_id).exists():
                raise serializers.ValidationError({"facility": "Facility does not exist."})
        
        # Validate scheduled_date is not in the past for new audits
        if not self.instance and 'scheduled_date' in data:
            current_time = timezone.now()
            if data['scheduled_date'] < current_time:
                raise serializers.ValidationError({"scheduled_date": "Scheduled date cannot be in the past."})
            
        return data

class ReportSerializer(serializers.ModelSerializer):
    generated_by_name = serializers.CharField(source='generated_by.display_name', read_only=True)
    
    class Meta:
        model = Report
        fields = ['id', 'title', 'report_type', 'description', 'generated_by', 
                 'generated_by_name', 'generated_at', 'file_path', 'parameters']
        read_only_fields = ['id', 'generated_at']

class BenchmarkCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = BenchmarkCriteria
        fields = ['id', 'name', 'description', 'category', 'weight', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class BenchmarkComparisonSerializer(serializers.ModelSerializer):
    facility_a_name = serializers.CharField(source='facility_a.name', read_only=True)
    facility_b_name = serializers.CharField(source='facility_b.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.display_name', read_only=True)

    class Meta:
        model = BenchmarkComparison
        fields = [
            'id', 'facility_a', 'facility_a_name', 'facility_b', 'facility_b_name',
            'comparison_date', 'overall_score_a', 'overall_score_b', 'detailed_results',
            'created_by', 'created_by_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, data):
        """
        Check that the comparison makes sense.
        """
        if data['facility_a'] == data['facility_b']:
            raise serializers.ValidationError("Cannot compare a facility with itself.")
        return data

class FacilityRankingSerializer(serializers.ModelSerializer):
    facility_name = serializers.CharField(source='facility.name', read_only=True)

    class Meta:
        model = FacilityRanking
        fields = [
            'id', 'facility', 'facility_name', 'ranking_date',
            'overall_rank', 'total_facilities', 'audit_score',
            'previous_rank', 'created_at', 'updated_at'
        ]
        read_only_fields = ['ranking_date', 'created_at', 'updated_at']

    def validate(self, data):
        """
        Validate the ranking data.
        """
        if data['overall_rank'] < 1 or data['overall_rank'] > data['total_facilities']:
            raise serializers.ValidationError("Invalid rank number.")
        return data

class MetricSnapshotSerializer(serializers.ModelSerializer):
    facility_name = serializers.CharField(source='facility.name', read_only=True)
    
    class Meta:
        model = MetricSnapshot
        fields = [
            'id', 'facility', 'facility_name', 'metric_type', 'timestamp',
            'active_patients', 'discharged_patients', 'inactive_patients',
            'capacity_utilization', 'scheduled_assessments', 'completed_assessments',
            'completion_rate', 'ninety_day_total_assessments', 'ninety_day_completed_assessments',
            'ninety_day_completion_rate'
        ]
        read_only_fields = fields

class FeedbackCommentSerializer(serializers.ModelSerializer):
    added_by_name = serializers.CharField(source='added_by.username', read_only=True)

    class Meta:
        model = FeedbackComment
        fields = ['id', 'comment', 'added_by', 'added_by_name', 'created_at']
        read_only_fields = ['added_by']

class FeedbackSerializer(serializers.ModelSerializer):
    comments = FeedbackCommentSerializer(many=True, read_only=True)
    submitted_by_name = serializers.CharField(source='submitted_by.username', read_only=True, required=False)

    class Meta:
        model = Feedback
        fields = ['id', 'title', 'description', 'status', 'submitted_by', 
                 'submitted_by_name', 'created_at', 'updated_at', 'comments']
        read_only_fields = ['created_at', 'updated_at']
        extra_kwargs = {
            'submitted_by': {'required': False},
            'submitted_by_name': {'required': False}
        }
