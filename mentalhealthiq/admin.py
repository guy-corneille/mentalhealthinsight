
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, PendingUser, Facility, StaffMember, StaffQualification, AssessmentCriteria, Indicator, Patient, Assessment, IndicatorScore, Audit, AuditCriteria, Report

# Register User model with custom admin interface
@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'role', 'display_name', 'is_staff')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('email', 'display_name', 'phone_number')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'display_name', 'phone_number', 'role'),
        }),
    )
    search_fields = ('username', 'email', 'display_name')
    ordering = ('username',)

# Register PendingUser
@admin.register(PendingUser)
class PendingUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'status', 'request_date')
    list_filter = ('status', 'role')
    search_fields = ('username', 'email')
    readonly_fields = ('request_date',)

# Register Facility
@admin.register(Facility)
class FacilityAdmin(admin.ModelAdmin):
    list_display = ('name', 'facility_type', 'district', 'province', 'status')
    list_filter = ('facility_type', 'province', 'status')
    search_fields = ('name', 'address', 'district')

# Register StaffMember
@admin.register(StaffMember)
class StaffMemberAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'position', 'facility', 'status')
    list_filter = ('position', 'department', 'status')
    search_fields = ('name', 'id', 'email')

# Register StaffQualification
admin.site.register(StaffQualification)

# Register AssessmentCriteria
@admin.register(AssessmentCriteria)
class AssessmentCriteriaAdmin(admin.ModelAdmin):
    list_display = ('name', 'category')
    list_filter = ('category',)
    search_fields = ('name', 'description')

# Register Indicator
@admin.register(Indicator)
class IndicatorAdmin(admin.ModelAdmin):
    list_display = ('name', 'criteria', 'weight')
    list_filter = ('criteria',)
    search_fields = ('name',)

# Register Patient
@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name', 'gender', 'facility', 'status')
    list_filter = ('gender', 'status', 'facility')
    search_fields = ('id', 'first_name', 'last_name', 'national_id')

# Register Assessment
@admin.register(Assessment)
class AssessmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'criteria', 'evaluator', 'assessment_date', 'score')
    list_filter = ('criteria', 'facility')
    search_fields = ('id', 'patient__first_name', 'patient__last_name')
    date_hierarchy = 'assessment_date'

# Register IndicatorScore
admin.site.register(IndicatorScore)

# Register Audit
@admin.register(Audit)
class AuditAdmin(admin.ModelAdmin):
    list_display = ('id', 'facility', 'auditor', 'audit_date', 'overall_score', 'status')
    list_filter = ('status',)
    search_fields = ('id', 'facility__name')
    date_hierarchy = 'audit_date'

# Register AuditCriteria
admin.site.register(AuditCriteria)

# Register Report
@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'report_type', 'generated_by', 'generated_at')
    list_filter = ('report_type',)
    search_fields = ('title', 'description')
    date_hierarchy = 'generated_at'
