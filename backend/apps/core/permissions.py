from rest_framework.permissions import BasePermission


class IsAdminUserOrReadOnly(BasePermission):
    """
    Admin can create, update, delete.
    Normal users can only read.
    """

    def has_permission(self, request, view):
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True

        return bool(request.user and request.user.is_staff)


class IsOwnerOrAdmin(BasePermission):
    """
    Users can access their own data.
    Admin can access everything.
    """

    def has_object_permission(self, request, view, obj):
        if request.user and request.user.is_staff:
            return True

        if hasattr(obj, "user"):
            return obj.user == request.user

        return False