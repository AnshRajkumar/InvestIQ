from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Serialize user information."""

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'profile_picture',
            'is_email_verified',
            'is_premium',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class RegisterSerializer(serializers.ModelSerializer):
    """Serialize user registration data."""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password',
            'password_confirm',
            'first_name',
            'last_name',
        ]

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    """Serialize login credentials."""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class GoogleLoginSerializer(serializers.Serializer):
    """Serialize Google OAuth token."""
    credential = serializers.CharField()


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Serialize editable profile fields."""

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'profile_picture']


class PublicProfileSerializer(serializers.ModelSerializer):
    """Serialize public user profile with activity counts."""
    total_posts = serializers.SerializerMethodField()
    total_likes = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'profile_picture',
            'is_email_verified',
            'is_premium',
            'created_at',
            'total_posts',
            'total_likes'
        ]

    def get_total_posts(self, obj):
        from investiq_api.apps.community.models import CommunityPost
        return CommunityPost.objects.filter(author=obj).count()

    def get_total_likes(self, obj):
        from investiq_api.apps.community.models import PostLike
        return PostLike.objects.filter(post__author=obj).count()

class ChangePasswordSerializer(serializers.Serializer):
    """Serialize password change request."""
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({'new_password': 'Passwords do not match.'})
        if data['old_password'] == data['new_password']:
            raise serializers.ValidationError({'new_password': 'New password must be different from old password.'})
        return data