# Vigilo AI Governance Rules Engine
# EU AI Act + Experimental Jurisdiction Extensions
# NOTE:
# - EU AI Act mappings are based on publicly available regulation structure.
# - Non-EU jurisdiction mappings are experimental governance interpretations
#   for demo and research purposes only.

from typing import Dict, List, Any


EU_AI_ACT_RULES = {
    "metadata": {
        "framework": "EU AI Act",
        "version": "2024",
        "type": "regulatory",
        "risk_model": "risk_based",
    },

    "risk_tiers": {
        "UNACCEPTABLE": {
            "description": "AI systems prohibited under Article 5",
            "severity_weight": 1.0
        },
        "HIGH": {
            "description": "AI systems subject to strict obligations",
            "severity_weight": 0.8
        },
        "LIMITED": {
            "description": "AI systems requiring transparency obligations",
            "severity_weight": 0.5
        },
        "MINIMAL": {
            "description": "Low-risk AI systems with minimal obligations",
            "severity_weight": 0.2
        }
    },

    "prohibited_practices": [
        {
            "id": "EU-A5-A",
            "article": "Article 5(1)(a)",
            "title": "Subliminal Manipulation",
            "description": (
                "AI systems deploying subliminal or manipulative techniques "
                "that materially distort human behaviour"
            ),
            "severity": "CRITICAL",
            "score_penalty": 40,
            "risk_tier": "UNACCEPTABLE",

            "detectors": [
                "subliminal_manipulation",
                "behavioral_manipulation",
                "covert_influence_patterns"
            ],

            "evidence_required": [
                "behavior_modification_logic",
                "psychological_targeting",
                "hidden_influence_mechanism"
            ],

            "remediation": [
                "Remove manipulative behavioral mechanisms",
                "Implement transparent interaction design",
                "Introduce explicit user consent mechanisms"
            ],

            "confidence_threshold": 0.80
        },

        {
            "id": "EU-A5-B",
            "article": "Article 5(1)(b)",
            "title": "Exploitation of Vulnerabilities",
            "description": (
                "AI exploiting vulnerabilities related to age, disability, "
                "or socio-economic conditions"
            ),
            "severity": "CRITICAL",
            "score_penalty": 40,
            "risk_tier": "UNACCEPTABLE",

            "detectors": [
                "vulnerability_exploitation",
                "sensitive_group_targeting"
            ],

            "evidence_required": [
                "demographic_targeting",
                "vulnerability_based_logic"
            ],

            "remediation": [
                "Remove discriminatory targeting logic",
                "Introduce fairness monitoring",
                "Implement protected-group safeguards"
            ],

            "confidence_threshold": 0.80
        },

        {
            "id": "EU-A5-C",
            "article": "Article 5(1)(c)",
            "title": "Social Scoring",
            "description": (
                "General purpose social scoring by public authorities"
            ),
            "severity": "CRITICAL",
            "score_penalty": 40,
            "risk_tier": "UNACCEPTABLE",

            "detectors": [
                "social_scoring",
                "citizen_ranking",
                "behavioral_reputation_scoring"
            ],

            "evidence_required": [
                "scoring_algorithm",
                "citizen_classification_logic"
            ],

            "remediation": [
                "Remove generalized social scoring mechanisms",
                "Limit scoring to lawful operational contexts",
                "Introduce rights-impact assessment"
            ],

            "confidence_threshold": 0.85
        },

        {
            "id": "EU-A5-D",
            "article": "Article 5(1)(d)",
            "title": "Real-time Biometric Surveillance",
            "description": (
                "Real-time remote biometric identification in public spaces"
            ),
            "severity": "CRITICAL",
            "score_penalty": 40,
            "risk_tier": "UNACCEPTABLE",

            "detectors": [
                "biometric_surveillance",
                "facial_recognition",
                "real_time_tracking"
            ],

            "evidence_required": [
                "live_biometric_processing",
                "identity_tracking_pipeline"
            ],

            "remediation": [
                "Disable real-time biometric identification",
                "Replace with non-identifying analytics",
                "Introduce lawful authorization controls"
            ],

            "confidence_threshold": 0.90
        }
    ],

    "high_risk_obligations": [
        {
            "id": "EU-A9",
            "article": "Article 9",
            "title": "Risk Management System",
            "severity": "HIGH",
            "score_penalty": 20,
            "risk_tier": "HIGH",

            "detectors": [
                "risk_management",
                "continuous_monitoring",
                "risk_documentation"
            ],

            "evidence_required": [
                "risk_register",
                "incident_response_plan",
                "monitoring_process"
            ],

            "remediation": [
                "Implement continuous risk assessment",
                "Create AI lifecycle monitoring procedures",
                "Maintain documented mitigation controls"
            ],

            "confidence_threshold": 0.70
        },

        {
            "id": "EU-A10",
            "article": "Article 10",
            "title": "Data Governance",
            "severity": "HIGH",
            "score_penalty": 15,
            "risk_tier": "HIGH",

            "detectors": [
                "data_governance",
                "dataset_validation",
                "bias_controls"
            ],

            "evidence_required": [
                "dataset_documentation",
                "bias_testing",
                "data_quality_controls"
            ],

            "remediation": [
                "Implement dataset quality validation",
                "Perform bias and fairness testing",
                "Document data lineage and provenance"
            ],

            "confidence_threshold": 0.70
        },

        {
            "id": "EU-A11",
            "article": "Article 11",
            "title": "Technical Documentation",
            "severity": "MEDIUM",
            "score_penalty": 10,
            "risk_tier": "HIGH",

            "detectors": [
                "technical_documentation",
                "architecture_documentation"
            ],

            "evidence_required": [
                "system_architecture_docs",
                "deployment_documentation"
            ],

            "remediation": [
                "Create comprehensive technical documentation",
                "Document model limitations and assumptions",
                "Maintain deployment records"
            ],

            "confidence_threshold": 0.65
        },

        {
            "id": "EU-A12",
            "article": "Article 12",
            "title": "Record Keeping & Audit Logs",
            "severity": "HIGH",
            "score_penalty": 15,
            "risk_tier": "HIGH",

            "detectors": [
                "audit_logs",
                "event_logging",
                "traceability"
            ],

            "evidence_required": [
                "audit_trail",
                "system_logs",
                "decision_traceability"
            ],

            "remediation": [
                "Implement immutable audit logging",
                "Track model decisions and actions",
                "Enable forensic traceability"
            ],

            "confidence_threshold": 0.75
        },

        {
            "id": "EU-A13",
            "article": "Article 13",
            "title": "Transparency",
            "severity": "MEDIUM",
            "score_penalty": 10,
            "risk_tier": "HIGH",

            "detectors": [
                "transparency",
                "user_notification",
                "ai_disclosure"
            ],

            "evidence_required": [
                "ai_usage_disclosure",
                "user_guidance",
                "system_explanation"
            ],

            "remediation": [
                "Provide AI usage disclosure",
                "Explain system capabilities and limitations",
                "Create user-facing transparency documentation"
            ],

            "confidence_threshold": 0.65
        },

        {
            "id": "EU-A14",
            "article": "Article 14",
            "title": "Human Oversight",
            "severity": "HIGH",
            "score_penalty": 25,
            "risk_tier": "HIGH",

            "detectors": [
                "human_oversight",
                "manual_approval",
                "override_capability"
            ],

            "evidence_required": [
                "human_review_step",
                "manual_override",
                "operator_controls"
            ],

            "remediation": [
                "Implement human approval checkpoints",
                "Add operator override capabilities",
                "Introduce escalation workflows"
            ],

            "confidence_threshold": 0.80,

            "sectors": [
                "hr",
                "recruitment",
                "healthcare",
                "education",
                "finance",
                "critical infrastructure"
            ]
        },

        {
            "id": "EU-A15",
            "article": "Article 15",
            "title": "Accuracy, Robustness & Cybersecurity",
            "severity": "MEDIUM",
            "score_penalty": 10,
            "risk_tier": "HIGH",

            "detectors": [
                "robustness",
                "accuracy_testing",
                "cybersecurity_controls"
            ],

            "evidence_required": [
                "security_testing",
                "accuracy_metrics",
                "failure_handling"
            ],

            "remediation": [
                "Perform adversarial testing",
                "Implement cybersecurity hardening",
                "Track model accuracy continuously"
            ],

            "confidence_threshold": 0.70
        }
    ],

    "high_risk_sectors": [
        "hr",
        "recruitment",
        "hiring",
        "healthcare",
        "medical",
        "education",
        "critical infrastructure",
        "law enforcement",
        "migration",
        "justice",
        "finance",
        "credit scoring"
    ]
}


# EXPERIMENTAL JURISDICTION EXTENSIONS
# These are governance interpretations and policy mappings
# intended for research/demo purposes.

ITALY_AI_POLICY_RULES = {
    "metadata": {
        "framework": "Italy AI Governance Policy Mapping",
        "version": "experimental-2025",
        "type": "experimental_mapping"
    },

    "articles": [
        {
            "id": "IT-A3",
            "title": "Human Dignity in Automated Decisions",
            "severity": "CRITICAL",
            "score_penalty": 25,

            "detectors": [
                "human_dignity",
                "binding_automation"
            ],

            "evidence_required": [
                "human_review_process",
                "appeals_mechanism"
            ],

            "remediation": [
                "Introduce mandatory human review",
                "Create user appeal procedures"
            ],

            "confidence_threshold": 0.75
        },

        {
            "id": "IT-A5",
            "title": "Anthropocentric AI",
            "severity": "HIGH",
            "score_penalty": 20,

            "detectors": [
                "anthropocentric_governance",
                "human_authority_controls"
            ],

            "evidence_required": [
                "human_override",
                "operator_supervision"
            ],

            "remediation": [
                "Ensure humans retain final authority",
                "Implement supervisory approval layers"
            ],

            "confidence_threshold": 0.70
        }
    ]
}


def get_all_rules() -> Dict[str, Any]:
    """Return all regulatory and governance rule sets."""
    return {
        "eu_ai_act": EU_AI_ACT_RULES,
        "italy_ai_policy_rules": ITALY_AI_POLICY_RULES
    }


def get_high_risk_sectors() -> List[str]:
    """Return all high-risk sectors."""
    return EU_AI_ACT_RULES["high_risk_sectors"]


def sector_matches(input_sector: str, target_sector: str) -> bool:
    """
    Flexible sector matching.
    Handles partial matches like:
    - health -> healthcare
    - medical -> healthcare
    """

    input_sector = input_sector.lower().strip()
    target_sector = target_sector.lower().strip()

    return (
        input_sector in target_sector or
        target_sector in input_sector
    )


def get_sector_specific_rules(sectors: List[str]) -> List[Dict]:
    """
    Return rules applicable to detected sectors.
    """

    applicable_rules = []

    for rule in EU_AI_ACT_RULES["high_risk_obligations"]:
        rule_sectors = rule.get("sectors", [])

        if not rule_sectors:
            applicable_rules.append(rule)
            continue

        if any(
            sector_matches(user_sector, rule_sector)
            for user_sector in sectors
            for rule_sector in rule_sectors
        ):
            applicable_rules.append(rule)

    for rule in ITALY_AI_POLICY_RULES["articles"]:
        rule_sectors = rule.get("sectors", [])

        if not rule_sectors:
            applicable_rules.append(rule)
            continue

        if any(
            sector_matches(user_sector, rule_sector)
            for user_sector in sectors
            for rule_sector in rule_sectors
        ):
            applicable_rules.append(rule)

    return applicable_rules


def calculate_max_penalty(sectors: List[str]) -> int:
    """
    Calculate maximum theoretical penalty score
    for detected sectors.
    """

    rules = get_sector_specific_rules(sectors)

    return sum(
        rule.get("score_penalty", 0)
        for rule in rules
    )
    # vigilo/backend/rules/eu_ai_act.py

PROHIBITED_PRACTICES = [
    "Biometric categorization using sensitive traits",
    "Untargeted scraping of facial images from CCTV/internet",
    "Emotion recognition in workplaces or educational institutions",
    "AI systems manipulating human behavior to cause harm"
]

ANNEX_III_HIGH_RISK = [
    "Biometric identification and verification",
    "Management and operation of critical infrastructure",
    "Education and vocational training tracking",
    "Employment, worker management, and access to self-employment"
]

FINANCIAL_ESCROW_RULES = {
    "target_token": "USDC",
    "compliance_threshold": 70,
    "lock_action": "arc.lockFunds()",
    "release_action": "arc.releaseFunds()",
    "error_handling": "ESCROW_HOLD_ON_FAILURE"
}