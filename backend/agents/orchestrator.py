import os
import json
import logging
import zipfile
import io
from pathlib import Path
from typing import Any

from .doc_agent import analyze_document
from .code_agent import analyze_code
from .scorer import score
from .reporter import generate_report

logger = logging.getLogger(__name__)

ALLOWED_DOC_EXTENSIONS = {".pdf", ".docx", ".txt"}
ALLOWED_CODE_EXTENSIONS = {".py", ".js", ".ts", ".jsx", ".tsx", ".java", ".go", ".rs", ".cpp", ".c", ".cs"}
ALLOWED_EXTENSIONS = ALLOWED_DOC_EXTENSIONS | ALLOWED_CODE_EXTENSIONS | {".zip"}


class WebSocketBroadcaster:
    def __init__(self, manager: Any, session_id: str):
        self.manager = manager
        self.session_id = session_id

    async def send(self, step: str, status: str, message: str, data: dict | None = None):
        payload = {
            "step": step,
            "status": status,
            "message": message,
            "data": data or {},
        }
        try:
            await self.manager.broadcast(self.session_id, payload)
        except Exception as e:
            logger.warning(f"WebSocket broadcast failed: {e}")


async def run_pipeline(
    file_path: str,
    filename: str,
    session_id: str,
    ws_manager: Any,
) -> dict[str, Any]:
    ws = WebSocketBroadcaster(ws_manager, session_id)
    ext = Path(filename).suffix.lower()
    is_code = ext in ALLOWED_CODE_EXTENSIONS or ext == ".zip"
    is_doc = ext in ALLOWED_DOC_EXTENSIONS

    await ws.send("pipeline", "running", "Pipeline started", {})

    try:
        text_content, code_files = await _extract_content(file_path, filename, ws)

        if is_code or code_files:
            analysis = await _run_code_analysis(code_files or {"main.py": text_content}, filename, ws)
            is_code = True
        else:
            analysis = await _run_doc_analysis(text_content, ws)
            is_code = False

        scores_result = await _run_scoring(analysis, is_code, ws)
        report = await _run_report_generation(analysis, scores_result, is_code, filename, ws)

        await ws.send("pipeline", "complete", "Pipeline completed successfully", {
            "report": report,
        })

        return report

    except Exception as e:
        logger.exception(f"Pipeline failed: {e}")
        await ws.send("pipeline", "error", f"Pipeline failed: {str(e)}", {})
        raise


async def _extract_content(
    file_path: str, filename: str, ws: WebSocketBroadcaster
) -> tuple[str, dict[str, str] | None]:
    ext = Path(filename).suffix.lower()

    if ext == ".zip":
        await ws.send("extract", "running", "Extracting archive...", {})
        return "", await _extract_zip(file_path)
    elif ext == ".pdf":
        await ws.send("extract", "running", "Extracting PDF content...", {})
        return _extract_pdf(file_path), None
    elif ext == ".docx":
        await ws.send("extract", "running", "Extracting DOCX content...", {})
        return _extract_docx(file_path), None
    else:
        await ws.send("extract", "running", "Reading file content...", {})
        with open(file_path, "r", encoding="utf-8", errors="replace") as f:
            return f.read(), None


def _extract_zip(file_path: str) -> dict[str, str]:
    files = {}
    with zipfile.ZipFile(file_path, "r") as zf:
        for info in zf.infolist():
            if info.filename.startswith("__") or info.filename.startswith("."):
                continue
            ext = Path(info.filename).suffix.lower()
            if ext in ALLOWED_CODE_EXTENSIONS and not info.is_dir():
                try:
                    files[info.filename] = zf.read(info.filename).decode("utf-8", errors="replace")
                except Exception:
                    pass
    return files


def _extract_pdf(file_path: str) -> str:
    try:
        import PyPDF2
        text = []
        with open(file_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                text.append(page.extract_text() or "")
        return "\n".join(text)
    except ImportError:
        try:
            import pdfminer.high_level
            from pdfminer.high_level import extract_text
            return extract_text(file_path)
        except ImportError:
            return f"[PDF content extraction requires PyPDF2 or pdfminer - file: {file_path}]"


def _extract_docx(file_path: str) -> str:
    try:
        import docx
        doc = docx.Document(file_path)
        return "\n".join(p.text for p in doc.paragraphs)
    except ImportError:
        return f"[DOCX content extraction requires python-docx - file: {file_path}]"


async def _run_doc_analysis(text: str, ws: WebSocketBroadcaster) -> dict[str, Any]:
    await ws.send("classification", "running", "Classifying EU AI Act risk tier...", {})

    result = await analyze_document(text)

    risk_tier = result.get("risk_tier", "UNKNOWN")
    await ws.send("classification", "complete", f"Classified as {risk_tier} risk tier", {
        "risk_tier": risk_tier,
        "system_type": result.get("system_type", ""),
    })

    violations = result.get("violations", [])
    if violations:
        await ws.send("violations", "running", f"{len(violations)} potential violations detected", {
            "count": len(violations),
            "violations": violations,
        })

    return result


async def _run_code_analysis(
    files: dict[str, str], filename: str, ws: WebSocketBroadcaster
) -> dict[str, Any]:
    await ws.send("code_analysis", "running", f"Analyzing {len(files)} code file(s)...", {})

    combined = ""
    for fname, content in files.items():
        combined += f"\n{'='*60}\nFile: {fname}\n{'='*60}\n{content}\n"

    result = await analyze_code(combined, filename)

    risk = result.get("overall_risk", "UNKNOWN")
    await ws.send("classification", "complete", f"Code risk classification: {risk}", {
        "risk_tier": risk,
        "files_analyzed": len(files),
    })

    prohibited = result.get("prohibited_patterns", [])
    if prohibited:
        await ws.send("violations", "running", f"{len(prohibited)} prohibited patterns found", {
            "count": len(prohibited),
            "patterns": prohibited,
        })

    return result


async def _run_scoring(
    analysis: dict[str, Any], is_code: bool, ws: WebSocketBroadcaster
) -> dict[str, Any]:
    articles = ["Article 9: Risk Management", "Article 10: Data Governance", "Article 11: Technical Documentation",
                 "Article 13: Transparency", "Article 14: Human Oversight", "Article 15: Accuracy & Robustness"]

    for art in articles:
        await ws.send("scoring", "running", f"Scoring {art}...", {})

    result = await score(analysis, is_code)

    scores = result.get("scores", {})
    for key, art_name in [
        ("ARTICLE_9", "Article 9: Risk Management"),
        ("ARTICLE_10", "Article 10: Data Governance"),
        ("ARTICLE_11", "Article 11: Technical Documentation"),
        ("ARTICLE_13", "Article 13: Transparency"),
        ("ARTICLE_14", "Article 14: Human Oversight"),
        ("ARTICLE_15", "Article 15: Accuracy & Robustness"),
    ]:
        s = scores.get(key, {})
        await ws.send("scoring", "complete", f"{art_name}: {s.get('score', 0)}/100", {
            "article": key,
            "score": s.get("score", 0),
            "pass": s.get("pass", False),
        })

    return result


async def _run_report_generation(
    analysis: dict[str, Any],
    scores_result: dict[str, Any],
    is_code: bool,
    filename: str,
    ws: WebSocketBroadcaster,
) -> dict[str, Any]:
    await ws.send("report", "running", "Generating compliance report...", {})

    report = await generate_report(analysis, scores_result, is_code, filename)

    await ws.send("report", "complete", "Compliance report ready", {
        "overall_score": report.get("compliance_summary", {}).get("overall_score", 0),
        "verdict": report.get("executive_summary", {}).get("verdict", "UNKNOWN"),
    })

    return report
