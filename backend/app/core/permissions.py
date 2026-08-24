from app.core.exceptions import PermissionDeniedError, CentreAccessDeniedError, FarmerOwnershipError

class CurrentUserProvider:
    """Provides current user context encapsulation."""
    def __init__(self, user_id: str, role: str, centre_id: str = None, farmer_id: str = None):
        self.user_id = user_id
        self.role = role
        self.centre_id = centre_id
        self.farmer_id = farmer_id

class RoleChecker:
    """Enforces role-based access control."""
    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = allowed_roles

    def verify(self, current_user: CurrentUserProvider):
        if current_user.role not in self.allowed_roles:
            raise PermissionDeniedError(
                f"Role '{current_user.role}' is not authorized to perform this operation. Allowed: {self.allowed_roles}"
            )

class CentreAccessChecker:
    """Enforces Centre Isolation policy (Requirement 15)."""
    @staticmethod
    def verify_centre_access(current_user: CurrentUserProvider, target_centre_id: str):
        if current_user.role == "ADMIN":
            return  # Admins have global state access
        if current_user.role == "PROCURER":
            if not current_user.centre_id or current_user.centre_id != target_centre_id:
                raise CentreAccessDeniedError(
                    f"Procurer assigned to centre '{current_user.centre_id}' cannot access target centre '{target_centre_id}'."
                )

class FarmerOwnershipChecker:
    """Enforces Farmer Ownership policy (Requirement 16)."""
    @staticmethod
    def verify_ownership(current_user: CurrentUserProvider, resource_farmer_id: str):
        if current_user.role == "ADMIN" or current_user.role == "PROCURER":
            return  # Officers and admins can view specified farmer records for verification
        if current_user.role == "FARMER":
            target_id = current_user.farmer_id or current_user.user_id
            if target_id != resource_farmer_id:
                raise FarmerOwnershipError("Farmer cannot access resources belonging to another farmer.")
