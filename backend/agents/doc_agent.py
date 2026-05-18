import os
import json
import logging
from typing import Any

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

DOC_ANALYSIS_PROMPT = """You are an EU AI Act compliance analyst. Analyze the following AI system description document and extract structured information.

Return ONLY valid JSON with this exact structure:
{
  "system_type": "string - what kind of AI system is described",
  "risk_tier": "UNACCEPTABLE|HIGH|LIMITED|MINIMAL",
  "annex_iii_categories": ["list of applicable Annex III category IDs, empty if none"],
  "key_facts": {
    "purpose": "string",
    "deployment_context": "string",
    "automation_level": "FULL|HIGH|PARTIAL|NONE",
    "data_used": ["list of data types used"],
    "human_oversight": "YES|NO|PARTIAL",
    "affected_stakeholders": ["list of affected groups"]
  },
  "prohibited_practices_found": ["list of prohibited practice IDs found, empty if none"],
  "violations": ["list of potential violations detected"],
  "summary": "brief summary of the system"
}

Document content:
"""


async def analyze_document(text: str) -> dict[str, Any]:
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your-gemini-api-key":
        logger.warning("No valid GEMINI_API_KEY, returning mock document analysis")
        return _mock_document_analysis(text)

    try:
        import google.generativeai as genai

        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-2.0-flash")

        truncated = text[:30000] if len(text) > 30000 else text
        response = model.generate_content(DOC_ANALYSIS_PROMPT + truncated)
        raw = response.text.strip()

        if raw.startswith("```"):
            raw = raw.split("\n", 1)[-1]
            raw = raw.rsplit("```", 1)[0]

        return json.loads(raw)
    except Exception as e:
        logger.error(f"Gemini analysis failed: {e}")
        return _mock_document_analysis(text)


def _mock_document_analysis(text: str) -> dict[str, Any]:
    text_lower = text.lower()

    is_biometric = any(kw in text_lower for kw in ["biometric", "facial", "fingerprint", "iris"])
    is_hr = any(kw in text_lower for kw in ["recruitment", "hiring", "employee", "hr", "candidate"])
    is_credit = any(kw in text_lower for kw in ["credit", "loan", "insurance", "banking"])
    is_education = any(kw in text_lower for kw in ["education", "student", "exam", "grading"])
    is_law = any(kw in text_lower for kw in ["law enforcement", "policing", "surveillance"])
    is_critical = any(kw in text_lower for kw in ["critical infrastructure", "power grid", "water"])
    is_manipulation = any(kw in text_lower for kw in ["subliminal", "manipulat", "behavioral"])

    annex_categories = []
    if is_biometric:
        annex_categories.append("A3_1")
    if is_critical:
        annex_categories.append("A3_2")
    if is_education:
        annex_categories.append("A3_3")
    if is_hr:
        annex_categories.append("A3_4")
    if is_credit:
        annex_categories.append("A3_5")
    if is_law:
        annex_categories.append("A3_6")

    if is_manipulation:
        risk_tier = "UNACCEPTABLE"
    elif any([is_biometric, is_hr, is_credit, is_education, is_law]):
        risk_tier = "HIGH"
    elif is_critical:
        risk_tier = "LIMITED"
    else:
        risk_tier = "MINIMAL"

    return {
        "system_type": "AI system for automated decision-making",
        "risk_tier": risk_tier,
        "annex_iii_categories": annex_categories,
        "key_facts": {
            "purpose": text[:200] if len(text) > 200 else text,
            "deployment_context": "Enterprise/Organizational",
            "automation_level": "HIGH" if risk_tier == "HIGH" else "PARTIAL",
            "data_used": ["personal data", "behavioral data"] if risk_tier != "MINIMAL" else ["anonymous data"],
            "human_oversight": "PARTIAL" if risk_tier == "HIGH" else "YES",
            "affected_stakeholders": ["employees", "customers", "users"],
        },
        "prohibited_practices_found": ["ART_5_1_A"] if is_manipulation else [],
        "violations": [
            "Article 14: No human oversight mechanism detected",
            "Article 13: Transparency obligations unclear",
        ] if risk_tier == "HIGH" else [],
        "summary": f"AI system classified as {risk_tier} risk. "
                   f"Purpose: {text[:100] if len(text) > 100 else text}",
    }
