from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
import uuid

class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'superuser')
        
        return self.create_user(username, email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('superuser', 'Superuser'),
        ('admin', 'Admin'),
        ('evaluator', 'Evaluator'),
        ('viewer', 'Viewer'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    display_name = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    first_name = models.CharField(max_length=150, blank=True, default='')
    last_name = models.CharField(max_length=150, blank=True, default='')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    
    objects = UserManager()
    
    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['email', 'role']
    
    def __str__(self):
        return self.username

class PendingUser(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=User.ROLE_CHOICES)
    display_name = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    position = models.CharField(max_length=100, blank=True, default='')
    password = models.CharField(max_length=128)  # Temporary storage until approved
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    request_date = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"{self.username} - {self.status}"

class Facility(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    facility_type = models.CharField(max_length=100)
    address = models.TextField()
    city = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100)
    province = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=100, default="Country")
    coordinates = models.CharField(max_length=100, blank=True, null=True)
    capacity = models.IntegerField(default=0)
    status = models.CharField(max_length=20, default='Active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    contact_name = models.CharField(max_length=255, blank=True, null=True)
    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=20, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    established_date = models.DateField(blank=True, null=True)
    last_inspection_date = models.DateField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Facilities"

class StaffMember(models.Model):
    STATUS_CHOICES = (
        ('Active', 'Active'),
        ('On Leave', 'On Leave'),
        ('Former', 'Former'),
    )
    
    id = models.CharField(primary_key=True, max_length=20)
    name = models.CharField(max_length=255)
    position = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='staff')
    join_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.position}"

class StaffQualification(models.Model):
    staff = models.ForeignKey(StaffMember, on_delete=models.CASCADE, related_name='qualifications')
    qualification = models.CharField(max_length=255)
    
    def __str__(self):
        return f"{self.qualification} - {self.staff.name}"

class AssessmentCriteria(models.Model):
    CATEGORY_CHOICES = (
        ('Clinical', 'Clinical'),
        ('Facility', 'Facility'),
        ('Administrative', 'Administrative'),
        ('Ethical', 'Ethical'),
        ('Quality Improvement', 'Quality Improvement'),
    )

    PURPOSE_CHOICES = (
        ('Assessment', 'Patient Assessment'),
        ('Audit', 'Facility Audit'),
    )

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True, null=True)
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.category})"

    class Meta:
        verbose_name_plural = "Assessment Criteria"

class Indicator(models.Model):
    criteria = models.ForeignKey(AssessmentCriteria, on_delete=models.CASCADE, related_name='indicators')
    name = models.CharField(max_length=255)
    weight = models.FloatField()
    
    def __str__(self):
        return f"{self.name} - {self.criteria.name}"

class Patient(models.Model):
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    )
    
    STATUS_CHOICES = (
        ('Active', 'Active'),
        ('Discharged', 'Discharged'),
        ('Referred', 'Referred'),
        ('Inactive', 'Inactive'),
    )
    
    id = models.CharField(primary_key=True, max_length=20)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    address = models.TextField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    national_id = models.CharField(max_length=20, blank=True, null=True, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    facility = models.ForeignKey(Facility, on_delete=models.SET_NULL, null=True, related_name='patients')
    primary_staff = models.ForeignKey(StaffMember, on_delete=models.SET_NULL, null=True, blank=True, related_name='primary_patients')
    registration_date = models.DateField()
    emergency_contact_name = models.CharField(max_length=255, blank=True, null=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.id}"

class Assessment(models.Model):
    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('missed', 'Missed'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='assessments', to_field='id')
    criteria = models.ForeignKey(AssessmentCriteria, on_delete=models.CASCADE, null=True, blank=True)
    evaluator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='conducted_assessments')
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE)
    assessment_date = models.DateTimeField(null=True, blank=True)
    scheduled_date = models.DateTimeField(default=timezone.now)
    score = models.FloatField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    missed_reason = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Assessment {self.id} - {self.patient}"
    
    def save(self, *args, **kwargs):
        # Ensure assessment_date is None for scheduled assessments
        if self.status == 'scheduled':
            self.assessment_date = None
            self.criteria = None
            self.evaluator = None
            self.score = 0
        super().save(*args, **kwargs)
    
    def mark_completed(self):
        """Utility method to mark assessment as completed"""
        self.status = 'completed'
        self.save()
    
    def mark_missed(self, reason=None):
        """Utility method to mark assessment as missed with optional reason"""
        self.status = 'missed'
        if reason:
            self.missed_reason = reason
        self.save()
    
    @property
    def is_upcoming(self):
        """Check if the assessment is upcoming"""
        return self.status == 'scheduled' and self.scheduled_date > timezone.now()
    
    @property
    def is_overdue(self):
        """Check if the scheduled assessment is overdue"""
        return self.status == 'scheduled' and self.scheduled_date < timezone.now()

class IndicatorScore(models.Model):
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='indicator_scores')
    indicator = models.ForeignKey(Indicator, on_delete=models.CASCADE)
    score = models.FloatField()
    notes = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.indicator.name}: {self.score}"

class Audit(models.Model):
    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('missed', 'Missed'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='audits')
    auditor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='conducted_audits')
    audit_date = models.DateTimeField(null=True, blank=True)
    scheduled_date = models.DateTimeField(default=timezone.now)
    overall_score = models.FloatField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    missed_reason = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Audit {self.id} - {self.facility.name}"

    def mark_completed(self):
        """Utility method to mark audit as completed"""
        self.status = 'completed'
        self.save()

    def mark_missed(self, reason=None):
        """Utility method to mark audit as missed with optional reason"""
        self.status = 'missed'
        if reason:
            self.missed_reason = reason
        self.save()
        
    @property
    def is_upcoming(self):
        """Check if the audit is upcoming"""
        return self.status == 'scheduled' and self.scheduled_date > timezone.now()
    
    @property
    def is_overdue(self):
        """Check if the audit is overdue."""
        if self.status == 'scheduled' and self.scheduled_date:
            return timezone.now() > self.scheduled_date
        return False

    def save(self, *args, **kwargs):
        """Override save to automatically mark as missed if overdue."""
        if self.is_overdue and self.status == 'scheduled':
            self.status = 'missed'
            self.missed_reason = 'Automatically marked as missed - scheduled date passed'
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-scheduled_date']

class AuditCriteria(models.Model):
    audit = models.ForeignKey(Audit, on_delete=models.CASCADE, related_name='criteria_scores')
    criteria_name = models.CharField(max_length=255)
    score = models.FloatField()
    notes = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.criteria_name}: {self.score}"

class Report(models.Model):
    REPORT_TYPES = (
        ('assessment', 'Assessment Report'),
        ('audit', 'Audit Report'),
        ('facility', 'Facility Performance Report'),
        ('patient', 'Patient Outcomes Report'),
        ('staff', 'Staff Efficiency Report'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    description = models.TextField(blank=True, null=True)
    generated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    generated_at = models.DateTimeField(default=timezone.now)
    file_path = models.CharField(max_length=255, blank=True, null=True)
    parameters = models.JSONField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.title} - {self.report_type}"

class BenchmarkCriteria(models.Model):
    CATEGORY_CHOICES = (
        ('audit', 'Audit Score'),
        ('assessment', 'Assessment Completion'),
    )

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    weight = models.FloatField(default=1.0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.category})"

    class Meta:
        verbose_name_plural = "Benchmark Criteria"

class BenchmarkComparison(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    facility_a = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='comparisons_as_a')
    facility_b = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='comparisons_as_b')
    comparison_date = models.DateTimeField(default=timezone.now)
    overall_score_a = models.FloatField()
    overall_score_b = models.FloatField()
    detailed_results = models.JSONField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Comparison: {self.facility_a.name} vs {self.facility_b.name} ({self.comparison_date.date()})"

    class Meta:
        ordering = ['-comparison_date']

class FacilityRanking(models.Model):
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='rankings')
    ranking_date = models.DateTimeField(default=timezone.now)
    overall_rank = models.IntegerField()
    total_facilities = models.IntegerField()
    audit_score = models.FloatField()
    previous_rank = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.facility.name} - Rank #{self.overall_rank}"

    class Meta:
        ordering = ['overall_rank', '-ranking_date']
        unique_together = ['facility', 'ranking_date']

class MetricSnapshot(models.Model):
    METRIC_TYPES = (
        ('patient_load', 'Patient Load'),
        ('assessment_completion', 'Assessment Completion'),
    )
    
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='metrics')
    metric_type = models.CharField(max_length=50, choices=METRIC_TYPES)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    # Patient Load Metrics
    active_patients = models.IntegerField()
    discharged_patients = models.IntegerField()
    inactive_patients = models.IntegerField()
    capacity_utilization = models.FloatField()  # Percentage
    
    # Assessment Metrics (Daily)
    scheduled_assessments = models.IntegerField()
    completed_assessments = models.IntegerField()
    completion_rate = models.FloatField()  # Percentage
    
    # 90-day Assessment Metrics (Added back to prevent crashes)
    ninety_day_total_assessments = models.IntegerField(default=0)
    ninety_day_completed_assessments = models.IntegerField(default=0)
    ninety_day_completion_rate = models.FloatField(default=0.0)  # Percentage

    def __str__(self):
        return f"{self.facility.name} - {self.metric_type} - {self.timestamp.strftime('%Y-%m-%d %H:%M')}"
    
    class Meta:
        indexes = [
            models.Index(fields=['facility', 'metric_type', 'timestamp'])
        ]
        ordering = ['-timestamp']

class Feedback(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('under_review', 'Under Review'),
        ('done', 'Done')
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    submitted_by = models.ForeignKey('User', on_delete=models.CASCADE, related_name='submitted_feedback', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.status}"

class FeedbackComment(models.Model):
    feedback = models.ForeignKey(Feedback, on_delete=models.CASCADE, related_name='comments')
    comment = models.TextField()
    added_by = models.ForeignKey('User', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment on {self.feedback.title} by {self.added_by.username if self.added_by else 'Anonymous'}"
