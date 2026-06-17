from rest_framework import permissions

class IsAdminOrSuperAdmin(permissions.BasePermission):
    """
    Allows access only to Admin or SuperAdmin users.
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['ADMIN', 'SUPERADMIN']
        )

class IsSuperAdmin(permissions.BasePermission):
    """
    Allows access only to SuperAdmin users.
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'SUPERADMIN'
        )

class IsClientUser(permissions.BasePermission):
    """
    Allows access only to Client users.
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'CLIENT'
        )
