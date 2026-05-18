import os
import json
import logging
from typing import Any

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

CODE_ANALYSIS_PROMPT = """You are an EU AI Act compliance analyst specializing in code review. Analyze the following source code for AI compliance issues.

Return ONLY valid JSON with this exact structure:
{
  "language": "programming language detected",
  "ai_decision_points": [
    {
      "line": number,
      "description": "what decision the AI makes here",
      "risk_level": "HIGH|MEDIUM|LOW",
      "compliance_issue": "description or null"
    }
  ],
  "prohibited_patterns": [
    {
      "pattern": "pattern name",
      "location": "file or line reference",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW",
      "description": "why this is prohibited"
    }
  ],
  "required_patterns": {
    "logging": "FOUND|NOT_FOUND|PARTIAL",
    "audit_trail": "FOUND|NOT_FOUND|PARTIAL",
    "human_checkpoints": "FOUND|NOT_FOUND|PARTIAL",
    "error_handling": "FOUND|NOT_FOUND|PARTIAL",
    "fairness_checks": "FOUND|NOT_FOUND|PARTIAL"
  },
  "data_handling": {
    "personal_data_processing": "YES|NO|UNCLEAR",
    "encryption_found": "YES|NO|PARTIAL",
    "data_minimization": "YES|NO|PARTIAL",
    "bias_detection": "YES|NO|PARTIAL"
  },
  "overall_risk": "UNACCEPTABLE|HIGH|LIMITED|MINIMAL",
  "violations": ["list of specific violations found"],
  "summary": "brief summary of code compliance posture"
}

Code content:
"""


async def analyze_code(code_text: str, filename: str = "") -> dict[str, Any]:
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your-gemini-api-key":
        logger.warning("No valid GEMINI_API_KEY, returning mock code analysis")
        return _mock_code_analysis(code_text, filename)

    try:
        import google.generativeai as genai

        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-2.0-flash")

        header = f"Filename: {filename}\n\n"
        truncated = code_text[:28000] if len(code_text) > 28000 else code_text
        response = model.generate_content(CODE_ANALYSIS_PROMPT + header + truncated)
        raw = response.text.strip()

        if raw.startswith("```"):
            raw = raw.split("\n", 1)[-1]
            raw = raw.rsplit("```", 1)[0]

        return json.loads(raw)
    except Exception as e:
        logger.error(f"Gemini code analysis failed: {e}")
        return _mock_code_analysis(code_text, filename)


def _mock_code_analysis(code_text: str, filename: str) -> dict[str, Any]:
    text_lower = code_text.lower()

    has_no_override = "no_override" in text_lower or "force_decision" in text_lower
    has_biometric = any(kw in text_lower for kw in ["face_recognition", "facial", "biometric", "opencv"])
    has_manipulation = any(kw in text_lower for kw in ["nudge", "dark_pattern", "manipulat"])
    has_logging = "logging" in text_lower or "log.info" in text_lower or "logger" in text_lower
    has_audit = "audit" in text_lower or "audit_trail" in text_lower
    has_human = "human" in text_lower or "override" in text_lower or "approval" in text_lower
    has_error = "try" in text_lower and "except" in text_lower
    has_encryption = "encrypt" in text_lower or "hash" in text_lower or "crypto" in text_lower

    prohibited = []
    if has_no_override:
        prohibited.append({
            "pattern": "No human override mechanism",
            "location": filename or "main module",
            "severity": "CRITICAL",
            "description": "AI decisions cannot be overridden by humans",
        })
    if has_biometric:
        prohibited.append({
            "pattern": "Biometric processing without safeguards",
            "location": filename or "detection module",
            "severity": "HIGH",
            "description": "Biometric data processing detected without compliance safeguards",
        })

    return {
        "language": filename.split(".")[-1] if "." in filename else "unknown",
        "ai_decision_points": [
            {
                "line": 1,
                "description": "Automated decision-making logic",
                "risk_level": "HIGH" if prohibited else "MEDIUM",
                "compliance_issue": "No human oversight" if not has_human else None,
            }
        ],
        "prohibited_patterns": prohibited,
        "required_patterns": {
            "logging": "FOUND" if has_logging else "NOT_FOUND",
            "audit_trail": "FOUND" if has_audit else "NOT_FOUND",
            "human_checkpoints": "FOUND" if has_human else "NOT_FOUND",
            "error_handling": "FOUND" if has_error else "NOT_FOUND",
            "fairness_checks": "NOT_FOUND",
        },
        "data_handling": {
            "personal_data_processing": "YES" if has_biometric else "UNCLEAR",
            "encryption_found": "YES" if has_encryption else "NOT_FOUND",
            "data_minimization": "PARTIAL",
            "bias_detection": "NOT_FOUND",
        },
        "overall_risk": "HIGH" if prohibited else "LIMITED",
        "violations": [
            "Article 14: Human oversight not implemented",
            "Article 13: No transparency mechanism found",
        ] if not has_human else [],
        "summary": f"Code analysis completed for {filename}. "
                   f"Risk level: {'HIGH' if prohibited else 'LIMITED'}. "
                   f"Found {len(prohibited)} prohibited patterns.",
    }
