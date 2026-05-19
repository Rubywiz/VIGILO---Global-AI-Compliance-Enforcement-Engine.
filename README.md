# VIGILO---Global-AI-Compliance-Enforcement-Engine.
VIGILO is a full-stack autonomous AI compliance enforcement engine built for the EU AI Act. Unlike chatbots that wait for user instructions, VIGILO operates as a true agent: upload one document or code file describing your AI system, and VIGILO takes over completely.

Its multi-agent pipeline — powered by Google Gemini 2.0 Flash for analysis, Featherless Llama 3.1 70B for obligation scoring, and Speechmatics for voice input — autonomously reads the submission, classifies the EU AI Act risk tier (Unacceptable/High/Limited/Minimal), maps it to applicable Annex III categories, scores compliance across Articles 9-15, and generates a detailed remediation report. Every step streams live to the UI via WebSockets.

VIGILO covers both document compliance (policy docs, system descriptions) and technical compliance (code scanning for prohibited patterns, missing human oversight, lack of audit trails). Deployed on Vultr, orchestrated visually via n8n, and open-source under MIT.

Target users: legal teams, CTOs, and AI product managers at companies deploying AI systems in the EU who face real compliance obligations coming into force in 2025-2026.
