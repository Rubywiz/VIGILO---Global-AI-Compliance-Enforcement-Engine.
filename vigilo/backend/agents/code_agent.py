import os
import json
import google.generativeai as genai

def configure_gemini():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return False
    genai.configure(api_key=api_key)
    return True

async def analyze_code(code_content: str):
    """
    Analyzes source code using Gemini Flash to detect AI decision points and prohibited/required patterns.
    """
    if not configure_gemini():
        # Return Mock Data if no API key
        return {
            "ai_decision_points": ["Detected model inference function 'predict()'"],
            "prohibited_patterns_found": [],
            "required_patterns_found": ["Basic logging found"],
            "data_handling": "Reads data from local CSV, no obvious PII masking",
            "risk_assessment": "LIMITED"
        }

    model = genai.GenerativeModel('gemini-2.5-flash')
    
    prompt = f"""
    You are an expert software auditor specializing in the EU AI Act.
    Analyze the following source code to identify AI-related logic and compliance issues.
    
    Code snippet:
    {code_content[:15000]} # Limit code length for prompt
    
    Task:
    1. Identify AI decision points (e.g., model inference, thresholding).
    2. Check for prohibited patterns (e.g., hardcoded un-overridable decisions, biometric processing).
    3. Check for required patterns (e.g., audit logging, human-in-the-loop functions).
    4. Assess data handling practices.
    5. Give a preliminary risk assessment (UNACCEPTABLE, HIGH, LIMITED, MINIMAL).
    
    Respond ONLY with a valid JSON object matching this schema:
    {{
      "ai_decision_points": ["string"],
      "prohibited_patterns_found": ["string"],
      "required_patterns_found": ["string"],
      "data_handling": "string",
      "risk_assessment": "string"
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
        print(f"Error in code_agent: {e}")
        return {
            "ai_decision_points": [],
            "prohibited_patterns_found": [],
            "required_patterns_found": [],
            "data_handling": "Error analyzing code",
            "risk_assessment": "UNKNOWN",
            "error": str(e)
        }
