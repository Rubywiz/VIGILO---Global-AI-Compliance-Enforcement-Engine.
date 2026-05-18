import os
import json
import logging
from typing import Any

from openai import OpenAI

logger = logging.getLogger(__name__)

FEATHERLESS_API_KEY = os.getenv("FEATHERLESS_API_KEY", "")
FEATHERLESS_BASE_URL = "https://api.featherless.ai/v1"
FEATHERLESS_MODEL = "meta-llama/Llama-3.1-70B-Instruct"

SCORING_SYSTEM_PROMPT = """You are an EU AI Act compliance scoring system. Score the AI system against Articles 9-15 of the EU AI Act.

For each article, provide:
1. A score from 0-100
2. A pass/fail status
3. A detailed reason explaining the score

Return ONLY valid JSON with this exact structure:
{
  "scores": {
    "ARTICLE_9": {"score": 0-100, "pass": true/false, "reason": "string"},
    "ARTICLE_10": {"score": 0-100, "pass": true/false, "reason": "string"},
    "ARTICLE_11": {"score": 0-100, "pass": true/false, "reason": "string"},
    "ARTICLE_13": {"score": 0-100, "pass": true/false, "reason": "string"},
    "ARTICLE_14": {"score": 0-100, "pass": true/false, "reason": "string"},
    "ARTICLE_15": {"score": 0-100, "pass": true/false, "reason": "string"}
  },
  "overall_score": 0-100,
  "overall_pass": true/false
}

Scoring guidelines:
- 0-30: Critical non-compliance, major violations found
- 31-50: Significant gaps, multiple obligations not met
- 51-70: Partial compliance, some obligations met but gaps remain
- 71-90: Good compliance, most obligations satisfied
- 91-100: Full compliance, all obligations met

The articles:
- Article 9: Risk management system
- Article 10: Data governance  
- Article 11: Technical documentation
- Article 13: Transparency & user information
- Article 14: Human oversight
- Article 15: Accuracy, robustness, cybersecurity
"""


async def score(analysis: dict[str, Any], is_code: bool = False) -> dict[str, Any]:
    if not FEATHERLESS_API_KEY or FEATHERLESS_API_KEY == "your-featherless-api-key":
        logger.warning("No valid FEATHERLESS_API_KEY, returning mock scoring")
        return _mock_scoring(analysis, is_code)

    try:
        client = OpenAI(
            api_key=FEATHERLESS_API_KEY,
            base_url=FEATHERLESS_BASE_URL,
        )

        response = client.chat.completions.create(
            model=FEATHERLESS_MODEL,
            messages=[
                {"role": "system", "content": SCORING_SYSTEM_PROMPT},
                {"role": "user", "content": json.dumps(analysis, indent=2)},
            ],
            temperature=0.1,
            max_tokens=2000,
        )

        raw = response.choices[0].message.content.strip()
        if raw.startswith("```"):
            raw = raw.split("\n", 1)[-1]
            raw = raw.rsplit("```", 1)[0]

        return json.loads(raw)
    except Exception as e:
        logger.error(f"Featherless scoring failed: {e}")
        return _mock_scoring(analysis, is_code)


def _mock_scoring(analysis: dict[str, Any], is_code: bool) -> dict[str, Any]:
    risk_tier = analysis.get("risk_tier") if not is_code else analysis.get("overall_risk")

    scores_map = {
        "UNACCEPTABLE": (15, 20, 25, 10, 5, 20),
        "HIGH": (35, 40, 45, 30, 25, 40),
        "LIMITED": (65, 60, 70, 55, 50, 65),
        "MINIMAL": (90, 85, 88, 92, 80, 85),
    }

    default_scores = scores_map.get(risk_tier, scores_map["LIMITED"])
    art_9_s, art_10_s, art_11_s, art_13_s, art_14_s, art_15_s = default_scores

    violations = analysis.get("violations", [])
    if violations:
        penalty = len(violations) * 5
        art_9_s = max(0, art_9_s - penalty)
        art_10_s = max(0, art_10_s - penalty)
        art_14_s = max(0, art_14_s - penalty)

    scores = {
        "ARTICLE_9": {
            "score": art_9_s,
            "pass": art_9_s >= 50,
            "reason": f"Risk management {'partially' if art_9_s < 70 else 'adequately'} implemented. "
                      f"Score reflects {'gaps in' if art_9_s < 50 else 'reasonable'} risk identification and mitigation processes.",
        },
        "ARTICLE_10": {
            "score": art_10_s,
            "pass": art_10_s >= 50,
            "reason": f"Data governance {'needs improvement' if art_10_s < 50 else 'meets minimum standards'}. "
                      f"{'Bias detection and data quality processes require attention.' if art_10_s < 50 else 'Data practices are generally sound.'}",
        },
        "ARTICLE_11": {
            "score": art_11_s,
            "pass": art_11_s >= 50,
            "reason": f"Technical documentation is {'insufficient' if art_11_s < 50 else 'adequate'}. "
                      f"{'Key design and development details are missing.' if art_11_s < 50 else 'Documentation standards are met.'}",
        },
        "ARTICLE_13": {
            "score": art_13_s,
            "pass": art_13_s >= 50,
            "reason": f"Transparency obligations are {'not fully met' if art_13_s < 50 else 'largely satisfied'}. "
                      f"{'Users may not be adequately informed about AI interaction.' if art_13_s < 50 else 'User information requirements are addressed.'}",
        },
        "ARTICLE_14": {
            "score": art_14_s,
            "pass": art_14_s >= 50,
            "reason": f"Human oversight is {'inadequate' if art_14_s < 50 else 'established'}. "
                      f"{'No meaningful human review or override capability detected.' if art_14_s < 50 else 'Oversight mechanisms are in place.'}",
        },
        "ARTICLE_15": {
            "score": art_15_s,
            "pass": art_15_s >= 50,
            "reason": f"Accuracy and robustness {'need improvement' if art_15_s < 50 else 'are addressed'}. "
                      f"{'Cybersecurity measures require strengthening.' if art_15_s < 50 else 'Security measures meet requirements.'}",
        },
    }

    overall = sum(s["score"] for s in scores.values()) // len(scores)

    return {
        "scores": scores,
        "overall_score": overall,
        "overall_pass": overall >= 50,
    }
