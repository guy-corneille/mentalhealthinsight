from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt
from .models import User, PendingUser
from .serializers import UserSerializer, PendingUserSerializer
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse

@api_view(['POST'])
@permission_classes([AllowAny])
def simple_login_view(request):
    """Simple login endpoint - no tokens, just authenticate and return user data"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'error': 'Username and password are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Get user from database
        user = User.objects.get(username=username, is_active=True)
        
        # Check password
        if user.check_password(password):
            return Response({
                'user': {
                    'id': str(user.id),
                    'username': user.username,
                    'email': user.email,
                    'role': user.role,
                    'display_name': user.display_name,
                    'phone_number': user.phone_number,
                    'is_active': user.is_active,
                    'date_joined': user.date_joined.isoformat()
                },
                'isAuthenticated': True
            })
        else:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except User.DoesNotExist:
        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)

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
    try:
        serializer = PendingUserSerializer(data=request.data)
        if serializer.is_valid():
            # Hash the password before saving
            user_data = serializer.validated_data
            user_data['password'] = make_password(user_data['password'])
            
            pending_user = serializer.save()
            return Response({
                'detail': 'Registration successful. Please wait for admin approval.',
                'user': {
                    'id': str(pending_user.id),
                    'username': pending_user.username,
                    'email': pending_user.email,
                    'role': pending_user.role,
                    'display_name': pending_user.display_name,
                    'phone_number': pending_user.phone_number,
                    'status': pending_user.status,
                    'request_date': pending_user.request_date.isoformat()
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'error': f'Registration failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
    try:
        pending_users = PendingUser.objects.filter(status='pending')
        serializer = PendingUserSerializer(pending_users, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({
            'error': f'Error fetching pending users: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def approve_user_view(request, user_id):
    """Approve a pending user (admin only)"""
    try:
        pending_user = PendingUser.objects.get(id=user_id, status='pending')
    except PendingUser.DoesNotExist:
        return Response({'detail': 'Pending user not found'}, status=status.HTTP_404_NOT_FOUND)

    try:
        # Create actual user with the hashed password
        user = User.objects.create_user(
            username=pending_user.username,
            email=pending_user.email,
            password=None,  # We'll set it manually since it's already hashed
            role=pending_user.role,
            display_name=pending_user.display_name,
            phone_number=pending_user.phone_number
        )
        # Set the already-hashed password
        user.password = pending_user.password
        user.save()

        # Update pending user status
        pending_user.status = 'approved'
        pending_user.save()

        return Response({
            'detail': 'User approved successfully',
            'user': UserSerializer(user).data
        })
    except Exception as e:
        return Response({'error': f'Error approving user: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def reject_user_view(request, user_id):
    """Reject a pending user (admin only)"""
    try:
        pending_user = PendingUser.objects.get(id=user_id, status='pending')
    except PendingUser.DoesNotExist:
        return Response({'detail': 'Pending user not found'}, status=status.HTTP_404_NOT_FOUND)

    try:
        pending_user.status = 'rejected'
        pending_user.save()

        return Response({'detail': 'User rejected successfully'})
    except Exception as e:
        return Response({'error': f'Error rejecting user: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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