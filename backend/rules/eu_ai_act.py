EU_AI_ACT = {
    "risk_tiers": {
        "UNACCEPTABLE": {
            "description": "AI systems that are considered a clear threat to safety, livelihoods, and rights of people. Banned under the EU AI Act.",
            "color": "red",
            "score_range": (0, 20),
        },
        "HIGH": {
            "description": "AI systems that create adverse impact on people's safety or fundamental rights. Subject to strict conformity obligations.",
            "color": "orange",
            "score_range": (21, 50),
        },
        "LIMITED": {
            "description": "AI systems with specific transparency obligations. Limited risk of harm.",
            "color": "yellow",
            "score_range": (51, 75),
        },
        "MINIMAL": {
            "description": "AI systems with minimal or no risk. No additional obligations beyond existing legislation.",
            "color": "green",
            "score_range": (76, 100),
        },
    },
    "prohibited_practices": [
        {
            "id": "ART_5_1_A",
            "article": "Article 5(1)(a)",
            "description": "AI systems that deploy subliminal techniques beyond a person's consciousness to materially distort behavior",
        },
        {
            "id": "ART_5_1_B",
            "article": "Article 5(1)(b)",
            "description": "AI systems that exploit vulnerabilities of specific groups to materially distort behavior",
        },
        {
            "id": "ART_5_1_C",
            "article": "Article 5(1)(c)",
            "description": "AI systems used by public authorities for social scoring based on social behavior or personal characteristics",
        },
        {
            "id": "ART_5_1_D",
            "article": "Article 5(1)(d)",
            "description": "AI systems used for real-time remote biometric identification in publicly accessible spaces for law enforcement",
        },
        {
            "id": "ART_5_1_E",
            "article": "Article 5(1)(e)",
            "description": "AI systems that manipulate human behavior to circumvent free will",
        },
        {
            "id": "ART_5_1_F",
            "article": "Article 5(1)(f)",
            "description": "AI systems that infer emotions in workplace or educational institutions",
        },
        {
            "id": "ART_5_1_G",
            "article": "Article 5(1)(g)",
            "description": "AI systems that create or expand facial recognition databases through untargeted scraping",
        },
        {
            "id": "ART_5_1_H",
            "article": "Article 5(1)(h)",
            "description": "AI systems that categorize individuals based on biometric data to infer sensitive characteristics",
        },
    ],
    "annex_iii_categories": [
        {
            "id": "A3_1",
            "category": "Biometric identification and categorization of natural persons",
            "description": "AI systems intended to be used for biometric identification or categorization of natural persons",
        },
        {
            "id": "A3_2",
            "category": "Critical infrastructure management",
            "description": "AI systems intended to be used as safety components in critical digital infrastructure management",
        },
        {
            "id": "A3_3",
            "category": "Education and vocational training",
            "description": "AI systems used in education to determine access, admission, or assessment of learners",
        },
        {
            "id": "A3_4",
            "category": "Employment, worker management, and access to self-employment",
            "description": "AI systems used in employment for recruitment, promotion, termination, or task allocation",
        },
        {
            "id": "A3_5",
            "category": "Access to essential services and benefits",
            "description": "AI systems used to determine access to public assistance, healthcare, credit, or insurance",
        },
        {
            "id": "A3_6",
            "category": "Law enforcement",
            "description": "AI systems used by law enforcement for risk assessment, profiling, or evidence evaluation",
        },
        {
            "id": "A3_7",
            "category": "Migration, asylum, and border control",
            "description": "AI systems used in migration for document authenticity, risk assessment, or visa processing",
        },
        {
            "id": "A3_8",
            "category": "Administration of justice and democratic processes",
            "description": "AI systems used to assist judicial authorities in interpreting facts or applying the law",
        },
    ],
    "obligations": {
        "ARTICLE_9": {
            "title": "Risk management system",
            "description": "Establish, implement, document, and maintain a risk management system throughout the AI system lifecycle.",
            "key_requirements": [
                "Continuous iterative risk management process",
                "Identification and analysis of foreseeable risks",
                "Estimation and evaluation of residual risk",
                "Implementation of risk management measures",
                "Testing to identify most appropriate measures",
            ],
        },
        "ARTICLE_10": {
            "title": "Data governance",
            "description": "Ensure training, validation, and testing datasets are relevant, representative, and free from errors.",
            "key_requirements": [
                "Relevant, representative, and error-free datasets",
                "Appropriate data collection and processing practices",
                "Examination for possible biases",
                "Identification of data gaps",
                "Transparency on data provenance",
            ],
        },
        "ARTICLE_11": {
            "title": "Technical documentation",
            "description": "Create and maintain technical documentation covering design, development, and operational specifications.",
            "key_requirements": [
                "General description of AI system",
                "Detailed design and development methodology",
                "Training data specifications",
                "Performance metrics and testing results",
                "System architecture and dependencies",
            ],
        },
        "ARTICLE_13": {
            "title": "Transparency and provision of information to users",
            "description": "Ensure AI systems are designed to be transparent and users are provided with clear information.",
            "key_requirements": [
                "Clear identification of AI system to users",
                "Information on system capabilities and limitations",
                "Disclosure of changes and updates",
                "Explainability of decisions",
                "User awareness of AI interaction",
            ],
        },
        "ARTICLE_14": {
            "title": "Human oversight",
            "description": "Ensure AI systems are designed to be effectively overseen by natural persons.",
            "key_requirements": [
                "Human review of AI decisions",
                "Ability to override or stop AI system",
                "Human verification of outputs",
                "Meaningful understanding for operators",
                "Appropriate training for human overseers",
            ],
        },
        "ARTICLE_15": {
            "title": "Accuracy, robustness, and cybersecurity",
            "description": "Ensure AI systems achieve appropriate levels of accuracy, robustness, and cybersecurity.",
            "key_requirements": [
                "Appropriate accuracy metrics and benchmarks",
                "Resilience to errors and inconsistencies",
                "Protection against adversarial attacks",
                "Fail-safe mechanisms",
                "Reproducibility of results",
            ],
        },
    },
    "classification_rules": {
        "high_risk_if": [
            "AI system is a safety component of regulated product",
            "AI system falls under Annex III categories",
            "AI system profiles natural persons",
            "AI system makes decisions with legal or significant effects",
        ],
        "unacceptable_if": [
            "Subliminal manipulation techniques",
            "Exploitation of vulnerable populations",
            "Social scoring by public authorities",
            "Real-time biometric surveillance in public spaces",
        ],
    },
}
