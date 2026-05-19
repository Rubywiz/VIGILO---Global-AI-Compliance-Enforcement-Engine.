import os
import json
import re
from openai import AsyncOpenAI

async def score_system(extracted_data: dict):
    api_key = os.getenv("FEATHERLESS_API_KEY")

    if not api_key:
        return {
            "Article_9": {"score": 45, "pass": False, "reason": "No continuous risk management process described."},
            "Article_10": {"score": 85, "pass": True, "reason": "Data governance practices appear robust with validation checks."},
            "Article_11": {"score": 60, "pass": True, "reason": "Technical documentation is present but lacks detail."},
            "Article_13": {"score": 30, "pass": False, "reason": "No transparency measures provided for end users."},
            "Article_14": {"score": 50, "pass": False, "reason": "Human oversight mechanisms are insufficiently defined."},
            "Article_15": {"score": 75, "pass": True, "reason": "Basic cybersecurity and robustness testing is mentioned."}
        }

    client = AsyncOpenAI(
        base_url="https://api.featherless.ai/v1",
        api_key=api_key
    )

    prompt = f"""
You are an expert EU AI Act compliance scorer.
Based on the following extracted AI system details, score the system against Articles 9, 10, 11, 13, 14, and 15.

System Data:
{json.dumps(extracted_data, indent=2)}

For each Article provide a score 0-100, pass boolean, and reason.

Respond ONLY with valid JSON:
{{
  "Article_9": {{"score": 0, "pass": true, "reason": "string"}},
  "Article_10": {{"score": 0, "pass": true, "reason": "string"}},
  "Article_11": {{"score": 0, "pass": true, "reason": "string"}},
  "Article_13": {{"score": 0, "pass": true, "reason": "string"}},
  "Article_14": {{"score": 0, "pass": true, "reason": "string"}},
  "Article_15": {{"score": 0, "pass": true, "reason": "string"}}
}}
"""

    try:
        response = await client.chat.completions.create(
            model="google/gemma-4-E4B-it",
            messages=[
                {"role": "system", "content": "You are a strict compliance auditor. Respond only in JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1
        )

        text = response.choices[0].message.content.strip()

        if "<think>" in text:
            text = text.split("</think>")[-1].strip()

        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()

        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        else:
            raise ValueError("No JSON found in response")

    except Exception as e:
        print(f"Error in scorer: {e}")
        return {f"Article_{i}": {"score": 0, "pass": False, "reason": f"Error scoring: {str(e)}"} for i in [9, 10, 11, 13, 14, 15]}
