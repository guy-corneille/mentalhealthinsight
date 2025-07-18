"""
URL configuration for mentalhealthiq project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.contrib import admin
from . import views, auth_views, metrics_views, feedback_views, benchmark_views

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'facilities', views.FacilityViewSet)
router.register(r'patients', views.PatientViewSet)
router.register(r'assessments', views.AssessmentViewSet)
router.register(r'audits', views.AuditViewSet)
router.register(r'staff', views.StaffViewSet)
router.register(r'metrics', metrics_views.MetricsViewSet)
router.register(r'reports', metrics_views.ReportViewSet)
router.register(r'assessment-criteria', views.AssessmentCriteriaViewSet, basename='assessment-criteria')
router.register(r'audit-criteria', views.AuditCriteriaViewSet, basename='audit-criteria')

router.register(r'feedback', feedback_views.FeedbackViewSet)
router.register(r'benchmark-criteria', benchmark_views.BenchmarkCriteriaViewSet)
router.register(r'benchmark-comparisons', benchmark_views.BenchmarkComparisonViewSet)
router.register(r'facility-rankings', benchmark_views.FacilityRankingViewSet)


# The API URLs are now determined automatically by the router
urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Simple auth endpoints (no tokens, no CSRF)
    path('auth/simple-login/', auth_views.simple_login_view, name='simple-login'),
    path('auth/register/', auth_views.register_user, name='register'),
    path('auth/pending-users/', auth_views.pending_users_view, name='pending-users'),
    path('auth/approve-user/<str:user_id>/', auth_views.approve_user_view, name='approve-user'),
    path('auth/reject-user/<str:user_id>/', auth_views.reject_user_view, name='reject-user'),
    path('auth/system-users/', auth_views.system_users_view, name='system-users'),
    path('auth/toggle-user/<str:user_id>/', auth_views.toggle_user_status_view, name='toggle-user'),
    
    path('auth/login/', auth_views.login_view, name='login'),
    path('auth/logout/', auth_views.logout_view, name='logout'),
    path('auth/check/', auth_views.check_auth_view, name='check-auth'),

    # API endpoints
    path('api/', include(router.urls)),
]
