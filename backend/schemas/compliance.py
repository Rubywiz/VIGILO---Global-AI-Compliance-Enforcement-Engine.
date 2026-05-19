from datetime import datetime, timezone
from typing import List, Optional

from pydantic import BaseModel


class Violation(BaseModel):
    article: str
    law: str
    description: str
    severity: str


class RemediationStep(BaseModel):
    priority: int
    action: str
    estimated_effort: str
    article_reference: str


class ComplianceReport(BaseModel):
    session_id: str
    system_name: str
    score: int
    verdict: str
    risk_level: str
    violations: List[Violation]
    compliant_areas: List[str]
    remediation: List[RemediationStep]
    escrow_status: str
    transaction_id: Optional[str] = None
    generated_at: str = ""
