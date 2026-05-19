PROHIBITED_PRACTICES = [
    "Subliminal manipulation causing physical or psychological harm",
    "Exploitation of vulnerabilities (age, disability, social/economic situation)",
    "Biometric categorization based on sensitive characteristics (race, political opinions, union membership, religious/philosophical beliefs, sex life/sexual orientation)",
    "Social scoring for general purpose by public or private actors",
    "Real-time remote biometric identification in publicly accessible spaces by law enforcement (with limited exceptions)",
    "Individual predictive policing based solely on profiling",
    "Emotion recognition in workplace and education institutions",
    "Untargeted scraping of facial images from the internet or CCTV for facial recognition databases"
]

HIGH_RISK_ANNEX_III = [
    "Biometrics (remote biometric identification, biometric categorization, emotion recognition)",
    "Critical infrastructure (management and operation of critical digital infrastructure, road traffic, supply of water, gas, heating, electricity)",
    "Education and vocational training (determining access, evaluating learning outcomes, assessing appropriate level of education)",
    "Employment, workers management and access to self-employment (recruitment, task allocation, performance evaluation)",
    "Access to and enjoyment of essential private services and essential public services and benefits (credit scoring, risk assessment and pricing in life/health insurance, evaluating eligibility for public assistance)",
    "Law enforcement (assessing risk of offending, polygraphs, deepfake detection, evaluating reliability of evidence)",
    "Migration, asylum and border control management (polygraphs, assessing risk, verifying travel documents)",
    "Administration of justice and democratic processes (assisting judicial authorities, influencing elections)"
]

OBLIGATIONS = {
    "Article 9": {
        "title": "Risk Management System",
        "description": "A continuous iterative process to identify, analyze, and mitigate risks to health, safety, and fundamental rights throughout the AI system's lifecycle."
    },
    "Article 10": {
        "title": "Data and Data Governance",
        "description": "Training, validation and testing data sets shall be relevant, representative, free of errors and complete. They must be subject to appropriate data governance and management practices."
    },
    "Article 11": {
        "title": "Technical Documentation",
        "description": "Comprehensive documentation must be drawn up before the system is placed on the market and kept up to date to prove compliance with obligations."
    },
    "Article 13": {
        "title": "Transparency and Provision of Information to Users",
        "description": "High-risk AI systems must be designed to enable users to understand their output and use them appropriately. Instructions for use must be provided."
    },
    "Article 14": {
        "title": "Human Oversight",
        "description": "Systems must be designed to be effectively overseen by natural persons to prevent or minimize risks, including the ability to intervene, override, or stop the system."
    },
    "Article 15": {
        "title": "Accuracy, Robustness and Cybersecurity",
        "description": "Systems must achieve an appropriate level of accuracy, robustness, and cybersecurity, and perform consistently throughout their lifecycle."
    }
}
