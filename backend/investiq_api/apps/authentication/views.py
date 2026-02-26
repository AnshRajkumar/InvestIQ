from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from google.auth.transport import requests
from google.oauth2 import id_token
import logging

from .models import User
from .serializers import (
    UserSerializer, 
    RegisterSerializer, 
    LoginSerializer,
    GoogleLoginSerializer,
    ProfileUpdateSerializer,
)

logger = logging.getLogger(__name__)


def get_tokens_for_user(user):
    """Generate JWT tokens for a user."""
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """Handle user registration."""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        return Response(
            {
                'message': 'User registered successfully',
                'user': UserSerializer(user).data,
                'access': tokens['access'],
                'refresh': tokens['refresh'],
            },
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Handle user login with email/password."""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        # Ensure demo user exists in development
        if settings.DEBUG and email == settings.DEMO_USER_EMAIL:
            user, _created = User.objects.get_or_create(
                email=settings.DEMO_USER_EMAIL,
                defaults={
                    'username': settings.DEMO_USER_EMAIL.split('@')[0],
                    'first_name': 'Admin',
                    'last_name': 'User',
                    'is_email_verified': True,
                }
            )
            if not user.check_password(settings.DEMO_USER_PASSWORD):
                user.set_password(settings.DEMO_USER_PASSWORD)
                user.save()
        
        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                tokens = get_tokens_for_user(user)
                return Response(
                    {
                        'message': 'Login successful',
                        'user': UserSerializer(user).data,
                        'access': tokens['access'],
                        'refresh': tokens['refresh'],
                    },
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {'error': 'Invalid credentials'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        except User.DoesNotExist:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def google_login_view(request):
    """Handle Google OAuth login."""
    serializer = GoogleLoginSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    credential = serializer.validated_data['credential']
    google_client_id = settings.GOOGLE_OAUTH_CLIENT_ID
    
    if not google_client_id:
        logger.error("GOOGLE_OAUTH_CLIENT_ID not configured in settings")
        return Response(
            {'error': 'Google OAuth not configured'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    try:
        # Verify the Google token
        id_info = id_token.verify_oauth2_token(credential, requests.Request(), google_client_id)
        
        if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Invalid token issuer')
        
        # Extract user information from token
        google_id = id_info['sub']
        email = id_info['email']
        first_name = id_info.get('given_name', '')
        last_name = id_info.get('family_name', '')
        picture = id_info.get('picture', '')
        
        # Get or create user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email.split('@')[0],
                'first_name': first_name,
                'last_name': last_name,
                'google_id': google_id,
                'profile_picture': picture,
                'is_email_verified': True,
            }
        )
        
        # Update user if they already existed
        if not created:
            user.google_id = google_id
            user.profile_picture = picture
            user.is_email_verified = True
            user.save()
        
        # Generate tokens
        tokens = get_tokens_for_user(user)
        
        return Response(
            {
                'message': 'Google login successful',
                'user': UserSerializer(user).data,
                'access': tokens['access'],
                'refresh': tokens['refresh'],
            },
            status=status.HTTP_200_OK
        )
        
    except ValueError as e:
        logger.error(f"Google token verification failed: {str(e)}")
        return Response(
            {'error': 'Invalid Google token'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    except Exception as e:
        logger.error(f"Google login error: {str(e)}")
        return Response(
            {'error': 'Google login failed'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token_view(request):
    """Refresh JWT token."""
    try:
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {'error': 'Refresh token not provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        refresh = RefreshToken(refresh_token)
        return Response(
            {'access': str(refresh.access_token)},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        logger.error(f"Token refresh error: {str(e)}")
        return Response(
            {'error': 'Invalid refresh token'},
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_me_view(request):
    """Return the authenticated user's profile."""
    return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_profile_view(request):
    """Update editable profile fields."""
    serializer = ProfileUpdateSerializer(
        request.user,
        data=request.data,
        partial=(request.method == 'PATCH')
    )
    if serializer.is_valid():
        serializer.save()
        return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Client-side token removal handles logout."""
    return Response({'message': 'Logged out'}, status=status.HTTP_200_OK)
