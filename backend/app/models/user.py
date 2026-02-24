from enum import Enum
from typing import Optional
from datetime import datetime


class UserRole(str, Enum):
    OWNER = "owner"
    SALES_EXECUTIVE = "sales_executive"


def user_doc():
    return {
        "email": str,
        "hashed_password": str,
        "full_name": str,
        "role": UserRole,
        "organization_id": Optional[str],
        "created_at": datetime,
        "updated_at": datetime,
    }
