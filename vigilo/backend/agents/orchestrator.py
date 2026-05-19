import asyncio
from agents.doc_agent import analyze_document
from agents.code_agent import analyze_code
from agents.scorer import score_system
from agents.reporter import generate_report

async def send_status(websocket, step_name, status, message, data=None):
    if websocket:
        await websocket.send_json({
            "step": step_name,
            "status": status,
            "message": message,
            "data": data or {}
        })

async def run_pipeline(session_id: str, file_path: str, is_code: bool, websocket):
    try:
        # Read file content
        await send_status(websocket, "initialization", "running", "Reading file content...")
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        await send_status(websocket, "initialization", "complete", "File read successfully.")

        # Step 1: Extraction & Classification
        step_name = "extracting_and_classifying"
        await send_status(websocket, step_name, "running", "Analyzing system and determining risk tier...")
        
        if is_code:
            extracted_data = await analyze_code(content)
        else:
            extracted_data = await analyze_document(content)
            
        if "error" in extracted_data:
            await send_status(websocket, step_name, "error", f"Analysis failed: {extracted_data['error']}")
            return
            
        await send_status(websocket, step_name, "complete", "System analyzed and risk tier determined.", extracted_data)

        # Step 2: Scoring Articles
        for article in [9, 10, 11, 13, 14, 15]:
            step_article = f"scoring_article_{article}"
            await send_status(websocket, step_article, "running", f"Evaluating compliance with Article {article}...")
            await asyncio.sleep(1) # Fake delay for better UX visualization
            # The actual scoring happens in bulk, but we simulate article-by-article progress for UX
            
        scores = await score_system(extracted_data)
        
        for article in [9, 10, 11, 13, 14, 15]:
            step_article = f"scoring_article_{article}"
            await send_status(websocket, step_article, "complete", f"Article {article} evaluation complete.")

        # Step 3: Reporting
        step_report = "generating_report"
        await send_status(websocket, step_report, "running", "Compiling final compliance report...")
        report = await generate_report(extracted_data, scores)
        await send_status(websocket, step_report, "complete", "Report compilation finished.")
        
        # Send Final
        await send_status(websocket, "report_generated", "complete", "Done", data=report)

    except Exception as e:
        print(f"Pipeline error: {e}")
        await send_status(websocket, "pipeline_error", "error", f"A critical error occurred: {str(e)}")
