
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
from django.urls import include, path
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from django.contrib import admin
from . import views

# Create a router for our viewsets
router = routers.DefaultRouter()

# Register all viewsets with the router
router.register(r'users', views.UserViewSet)
router.register(r'pending-users', views.PendingUserViewSet)
router.register(r'facilities', views.FacilityViewSet)
router.register(r'staff', views.StaffMemberViewSet)
router.register(r'assessment-criteria', views.AssessmentCriteriaViewSet)
router.register(r'patients', views.PatientViewSet)
router.register(r'assessments', views.AssessmentViewSet)
router.register(r'audits', views.AuditViewSet)
router.register(r'reports', views.ReportViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    
    # Authentication endpoints
    path('api/users/login/', obtain_auth_token, name='api-token-auth'),
    path('api/users/logout/', views.logout_view, name='api-logout'),
    path('api/users/register/', views.register_user, name='api-register'),
]

# Optional: Add a nice API root for browsing the API
urlpatterns += [
    path('', include(router.urls)),
]
