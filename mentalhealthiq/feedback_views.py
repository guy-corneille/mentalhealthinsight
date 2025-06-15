from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Feedback, FeedbackComment
from .serializers import FeedbackSerializer
from .views import StandardResultsSetPagination

class FeedbackViewSet(viewsets.ModelViewSet):
    """API endpoints for managing feedback"""
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at']

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'superuser']:
            return Feedback.objects.all().order_by('-created_at')
        return Feedback.objects.filter(submitted_by=user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(submitted_by=self.request.user)

    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        feedback = self.get_object()
        comment = request.data.get('comment')
        
        if not comment:
            return Response(
                {'error': 'Comment is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Only admins can add comments
        if request.user.role not in ['admin', 'superuser']:
            return Response(
                {'error': 'Only admins can add comments'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        FeedbackComment.objects.create(
            feedback=feedback,
            comment=comment,
            added_by=request.user
        )
        
        serializer = self.get_serializer(feedback)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        feedback = self.get_object()
        new_status = request.data.get('status')
        
        if not new_status or new_status not in dict(Feedback.STATUS_CHOICES):
            return Response(
                {'error': 'Valid status is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if request.user.role not in ['admin', 'superuser']:
            return Response(
                {'error': 'Only admins can update status'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        feedback.status = new_status
        feedback.save()
        
        serializer = self.get_serializer(feedback)
        return Response(serializer.data) 
 