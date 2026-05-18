import logging
from typing import Any

logger = logging.getLogger(__name__)


async def generate_report(
    analysis: dict[str, Any],
    scores: dict[str, Any],
    is_code: bool = False,
    filename: str = "",
) -> dict[str, Any]:
    logger.info("Generating compliance report")

    article_scores = scores.get("scores", {})
    overall_score = scores.get("overall_score", 0)
    overall_pass = scores.get("overall_pass", False)

    if is_code:
        risk_tier = analysis.get("overall_risk", "UNKNOWN")
        system_type = analysis.get("language", "Unknown")
        violations = analysis.get("violations", [])
        prohibited = analysis.get("prohibited_patterns", [])
        summary_text = analysis.get("summary", "No summary available")
        system_name = filename or "Code Analysis"
    else:
        risk_tier = analysis.get("risk_tier", "UNKNOWN")
        system_type = analysis.get("system_type", "Unknown")
        violations = analysis.get("violations", [])
        prohibited = analysis.get("prohibited_practices_found", [])
        summary_text = analysis.get("summary", "No summary available")

        facts = analysis.get("key_facts", {})
        system_name = f"AI System: {facts.get('purpose', system_type)[:100]}"

    remediation = _generate_remediation(violations, article_scores, risk_tier)

    return {
        "executive_summary": {
            "title": "EU AI Act Compliance Report",
            "system_name": system_name,
            "system_type": system_type,
            "analysis_type": "CODE" if is_code else "DOCUMENT",
            "overall_compliance_score": overall_score,
            "verdict": "PASS" if overall_pass else "FAIL",
            "risk_tier": risk_tier,
            "total_violations": len(violations) + len(prohibited),
            "summary": summary_text,
        },
        "risk_tier_verdict": {
            "tier": risk_tier,
            "color": {
                "UNACCEPTABLE": "red",
                "HIGH": "orange",
                "LIMITED": "yellow",
                "MINIMAL": "green",
            }.get(risk_tier, "gray"),
            "description": {
                "UNACCEPTABLE": "Prohibited under EU AI Act. System poses clear threat to safety or rights.",
                "HIGH": "Subject to strict conformity obligations. Requires CE marking and conformity assessment.",
                "LIMITED": "Subject to transparency obligations only.",
                "MINIMAL": "No additional obligations beyond existing legislation.",
            }.get(risk_tier, "Unknown risk classification."),
        },
        "article_scores": article_scores,
        "violations": [
            {
                "id": f"V{i+1}",
                "description": v,
                "severity": "CRITICAL" if risk_tier == "UNACCEPTABLE" else "HIGH",
            }
            for i, v in enumerate(violations)
        ],
        "prohibited_patterns": prohibited,
        "remediation_steps": remediation,
        "compliance_summary": {
            "overall_score": overall_score,
            "pass": overall_pass,
            "risk_tier": risk_tier,
            "articles_passed": sum(
                1 for s in article_scores.values() if s.get("pass", False)
            ),
            "articles_failed": sum(
                1 for s in article_scores.values() if not s.get("pass", False)
            ),
            "total_articles": len(article_scores),
        },
    }


def _generate_remediation(
    violations: list[str],
    article_scores: dict[str, Any],
    risk_tier: str,
) -> list[dict[str, str]]:
    steps = [
        {
            "step": 1,
            "action": "Conduct a formal risk assessment and establish a risk management system",
            "article": "Article 9",
            "priority": "HIGH" if risk_tier == "HIGH" else "MEDIUM",
        },
        {
            "step": 2,
            "action": "Implement comprehensive data governance practices including bias detection",
            "article": "Article 10",
            "priority": "HIGH",
        },
        {
            "step": 3,
            "action": "Create and maintain technical documentation for the AI system",
            "article": "Article 11",
            "priority": "MEDIUM",
        },
        {
            "step": 4,
            "action": "Ensure transparency by providing clear user information about AI interaction",
            "article": "Article 13",
            "priority": "HIGH",
        },
        {
            "step": 5,
            "action": "Implement human oversight mechanisms with override capabilities",
            "article": "Article 14",
            "priority": "HIGH",
        },
        {
            "step": 6,
            "action": "Strengthen accuracy metrics, robustness testing, and cybersecurity measures",
            "article": "Article 15",
            "priority": "HIGH",
        },
    ]

    if violations:
        steps.insert(
            0,
            {
                "step": 0,
                "action": f"Address identified violations: {', '.join(violations[:3])}",
                "article": "General",
                "priority": "CRITICAL",
            },
        )
        for i, s in enumerate(steps[1:], start=1):
            s["step"] = i

    return steps
