# main.py - FastAPI server for FinVoice AI Assistant
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn
from backend import process_audio_file_async, process_message_async # ✅ use async version
from datetime import datetime
import os
import aiofiles

# Import backend functions
from backend import (
    process_audio_file,
    process_message_sync,
    initialize_workflow_async  
)

# Initialize FastAPI app
app = FastAPI(title="FinVoice API", version="1.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class ChatRequest(BaseModel):
    user_id: str
    message: Optional[str] = None

class ChatResponse(BaseModel):
    success: bool
    response: str
    error: Optional[str] = None
    user_id: Optional[str] = None

class VoiceResponse(BaseModel):
    success: bool
    message: str
    user_text: Optional[str] = None

# Session management
user_sessions = {}

@app.on_event("startup")
async def startup_event():
    """Initialize workflow on server startup"""
    print("🚀 FinVoice API Server starting up...")
    try:
        await initialize_workflow_async()
        print("✅ Workflow initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize workflow: {e}")
        raise

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Main chat endpoint"""
    try:
        if not request.message or not request.message.strip():
            return ChatResponse(success=False, response="Please provide a message", user_id=request.user_id)

        # ✅ Use the async version of the processing function
        result = await process_message_async(request.user_id, request.message)

        # Manage sessions
        if request.user_id not in user_sessions:
            user_sessions[request.user_id] = {"conversation_history": [], "last_interaction": datetime.now()}

        session = user_sessions[request.user_id]
        session["conversation_history"].append({"role": "user", "content": request.message, "timestamp": datetime.now()})
        if result.get("response"):
            session["conversation_history"].append({"role": "assistant", "content": result["response"], "timestamp": datetime.now()})
        session["last_interaction"] = datetime.now()

        return ChatResponse(success=result["success"], response=result["response"], user_id=request.user_id)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")

@app.post("/api/chat/audio", response_model=VoiceResponse)
async def chat_audio_endpoint(file: UploadFile = File(...)):
    """Endpoint for audio input with enhanced response"""
    audio_path = None
    try:
        # Validate file type
        if not file.filename.lower().endswith(('.wav', '.mp3', '.m4a', '.webm')):
            raise HTTPException(status_code=400, detail="Unsupported file format. Please use WAV, MP3, M4A, or WEBM.")
        
        os.makedirs("temp_audio", exist_ok=True)
        audio_path = f"temp_audio/api_{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}"
        
        async with aiofiles.open(audio_path, "wb") as f:
            content = await file.read()
            if not content:
                raise HTTPException(status_code=400, detail="Empty audio file")
            await f.write(content)

        # ✅ use async version
        final_state = await process_audio_file_async(audio_path)

        if os.path.exists(audio_path):
            os.remove(audio_path)
            
        return VoiceResponse(
            success=True,
            message=final_state.get("final_response", "No response generated"),
            user_text=final_state.get("transcribed_text", "Audio input")
        )
        
    except HTTPException:
        raise
    except Exception as e:
        if audio_path and os.path.exists(audio_path):
            os.remove(audio_path)
        print(f"❌ Audio processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Audio processing failed: {str(e)}")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(), "service": "FinVoice API", "version": "1.0"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)