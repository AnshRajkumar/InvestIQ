from rest_framework.permissions import BasePermission


class IsPremiumUser(BasePermission):
    message = 'Premium subscription required.'

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        # Allow if user is premium or has the specified email
        return request.user.is_premium or request.user.email == 'sunitpanda680@gmail.com'
