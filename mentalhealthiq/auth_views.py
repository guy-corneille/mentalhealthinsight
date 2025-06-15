from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from .models import User, PendingUser
from .serializers import UserSerializer, PendingUserSerializer
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse

@api_view(['POST', 'OPTIONS'])
@permission_classes([AllowAny])
@csrf_exempt
def login_view(request):
    if request.method == 'OPTIONS':
        response = JsonResponse({})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response

    return Response({
        'user': {
            'id': '1',
            'username': 'dummy_user',
            'email': 'dummy@example.com',
            'role': 'admin',
            'display_name': 'Dummy User',
            'phone_number': None,
            'date_joined': '2024-01-01T00:00:00Z'
        },
        'isAuthenticated': True
    })

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """Register a new pending user"""
    serializer = PendingUserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'detail': 'Registration successful. Please wait for admin approval.',
            'user': serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST', 'OPTIONS'])
@permission_classes([AllowAny])
@csrf_exempt
def logout_view(request):
    if request.method == 'OPTIONS':
        response = JsonResponse({})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response

    return Response({'message': 'Successfully logged out'})

@api_view(['GET', 'OPTIONS'])
@permission_classes([AllowAny])
def check_auth_view(request):
    if request.method == 'OPTIONS':
        response = JsonResponse({})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response

    return Response({
        'user': {
            'id': '1',
            'username': 'dummy_user',
            'email': 'dummy@example.com',
            'role': 'admin',
            'display_name': 'Dummy User',
            'phone_number': None,
            'date_joined': '2024-01-01T00:00:00Z'
        },
        'isAuthenticated': True
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def pending_users_view(request):
    """Get list of pending users (admin only)"""
    if not request.user.role in ['admin', 'superuser']:
        return Response({
            'detail': 'Permission denied'
        }, status=status.HTTP_403_FORBIDDEN)
    
    pending_users = PendingUser.objects.filter(status='pending')
    serializer = PendingUserSerializer(pending_users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_user_view(request, user_id):
    """Approve a pending user (admin only)"""
    if not request.user.role in ['admin', 'superuser']:
        return Response({
            'detail': 'Permission denied'
        }, status=status.HTTP_403_FORBIDDEN)

    try:
        pending_user = PendingUser.objects.get(id=user_id, status='pending')
    except PendingUser.DoesNotExist:
        return Response({
            'detail': 'Pending user not found'
        }, status=status.HTTP_404_NOT_FOUND)

    # Create actual user
    user = User.objects.create_user(
        username=pending_user.username,
        email=pending_user.email,
        password=pending_user.password,
        role=pending_user.role,
        display_name=pending_user.display_name,
        phone_number=pending_user.phone_number
    )

    # Update pending user status
    pending_user.status = 'approved'
    pending_user.save()

    return Response({
        'detail': 'User approved successfully',
        'user': UserSerializer(user).data
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_user_view(request, user_id):
    """Reject a pending user (admin only)"""
    if not request.user.role in ['admin', 'superuser']:
        return Response({
            'detail': 'Permission denied'
        }, status=status.HTTP_403_FORBIDDEN)

    try:
        pending_user = PendingUser.objects.get(id=user_id, status='pending')
    except PendingUser.DoesNotExist:
        return Response({
            'detail': 'Pending user not found'
        }, status=status.HTTP_404_NOT_FOUND)

    pending_user.status = 'rejected'
    pending_user.save()

    return Response({
        'detail': 'User rejected successfully'
    })

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def register_view(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'message': 'User registered successfully',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 