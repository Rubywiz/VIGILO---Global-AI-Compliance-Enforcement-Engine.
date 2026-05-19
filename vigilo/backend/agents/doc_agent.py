import os
import json
import google.generativeai as genai
from rules.eu_ai_act import HIGH_RISK_ANNEX_III, PROHIBITED_PRACTICES

def configure_gemini():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return False
    genai.configure(api_key=api_key)
    return True

async def analyze_document(text_content: str):
    """
    Analyzes a document using Gemini Flash to extract system details and classify risk tier.
    """
    if not configure_gemini():
        # Return Mock Data if no API key
        return {
            "system_description": "Mock AI system analyzing documents.",
            "risk_tier": "HIGH",
            "annex_iii_categories": ["Biometrics (remote biometric identification)"],
            "key_facts": {
                "purpose": "Document analysis and identity verification",
                "automation_level": "High",
                "data_used": "Documents, IDs"
            }
        }

    model = genai.GenerativeModel('gemini-2.5-flash')
    
    prompt = f"""
    You are an expert EU AI Act compliance officer. Analyze the following document describing an AI system.
    
    Document text:
    {text_content[:15000]} # Limit text length for prompt
    
    Based on the EU AI Act, determine:
    1. A brief system description.
    2. The Risk Tier (UNACCEPTABLE, HIGH, LIMITED, or MINIMAL).
    3. If HIGH risk, which Annex III categories apply? (List them if any)
    4. Key facts: purpose, automation_level, data_used.
    
    Respond ONLY with a valid JSON object matching this schema:
    {{
      "system_description": "string",
      "risk_tier": "string",
      "annex_iii_categories": ["string"],
      "key_facts": {{
         "purpose": "string",
         "automation_level": "string",
         "data_used": "string"
      }}
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3]
        elif text.startswith("```"):
            text = text[3:-3]
            
        return json.loads(text.strip())
    except Exception as e:
        print(f"Error in doc_agent: {e}")
        return {
            "system_description": "Error analyzing document",
            "risk_tier": "UNKNOWN",
            "annex_iii_categories": [],
            "key_facts": {"purpose": "N/A", "automation_level": "N/A", "data_used": "N/A"},
            "error": str(e)
        }
