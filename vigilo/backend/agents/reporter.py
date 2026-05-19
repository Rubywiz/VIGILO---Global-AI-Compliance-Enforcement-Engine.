import json

async def generate_report(extracted_data: dict, scores: dict):
    """
    Combines data from extraction and scoring to generate a final JSON compliance report.
    """
    
    # Calculate overall score
    total_score = 0
    num_articles = 0
    violations = []
    
    for article, data in scores.items():
        total_score += data.get("score", 0)
        num_articles += 1
        if not data.get("pass", False):
            violations.append(f"Violation of {article.replace('_', ' ')}: {data.get('reason')}")
            
    # Check for prohibited practices from extracted data
    prohibited = extracted_data.get("prohibited_patterns_found", [])
    for p in prohibited:
        violations.append(f"PROHIBITED PRACTICE DETECTED: {p}")
        
    overall_score = round(total_score / num_articles) if num_articles > 0 else 0
    
    # Determine Risk Tier based on data and violations
    risk_tier = extracted_data.get("risk_tier") or extracted_data.get("risk_assessment", "UNKNOWN")
    if len(prohibited) > 0:
        risk_tier = "UNACCEPTABLE"
        
    # Generate Remediation Steps
    remediation_steps = []
    if risk_tier == "UNACCEPTABLE":
        remediation_steps.append("IMMEDIATE ACTION REQUIRED: Cease deployment of system due to prohibited practices.")
    else:
        for article, data in scores.items():
            if not data.get("pass", False):
                if article == "Article_9":
                    remediation_steps.append("Implement a continuous, documented risk management system.")
                elif article == "Article_10":
                    remediation_steps.append("Audit and improve data governance, ensuring training datasets are representative and error-free.")
                elif article == "Article_11":
                    remediation_steps.append("Draft comprehensive technical documentation detailing system architecture, data, and design choices.")
                elif article == "Article_13":
                    remediation_steps.append("Develop clear instructions for use and transparency measures for end users.")
                elif article == "Article_14":
                    remediation_steps.append("Design and implement effective human-in-the-loop oversight mechanisms.")
                elif article == "Article_15":
                    remediation_steps.append("Conduct rigorous accuracy, robustness, and cybersecurity testing.")

    if len(remediation_steps) == 0:
         remediation_steps.append("Maintain current compliance posture and conduct annual reviews.")

    report = {
        "executive_summary": f"This system is classified as {risk_tier} risk under the EU AI Act. It achieved an overall compliance score of {overall_score}/100 across applicable obligations.",
        "risk_tier": risk_tier,
        "overall_score": overall_score,
        "article_scores": scores,
        "violations": violations,
        "remediation_steps": remediation_steps
    }
    
    return report
