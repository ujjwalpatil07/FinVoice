from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend import process_audio_file
import aiofiles
import os
from fastapi.middleware.cors import CORSMiddleware
import openai
import tempfile

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process-audio/")
async def process_audio(file: UploadFile = File(...)):
    
    try:  
        
        
        # Create temp directory if it doesn't exist
        os.makedirs("temp_audio", exist_ok=True)
        
        audio_path = f"temp_audio/temp_{file.filename}"
        async with aiofiles.open(audio_path, "wb") as f:
            await f.write(await file.read())

        final_state = process_audio_file(audio_path)
        
        # Clean up the temporary file
        if os.path.exists(audio_path):
            os.remove(audio_path)
            
        return {"message": final_state.get("final_message")}
    except Exception as e:
        # Clean up if file was created but error occurred
        if 'audio_path' in locals() and os.path.exists(audio_path):
            os.remove(audio_path)
        raise HTTPException(status_code=500, detail=f"Error processing audio: {str(e)}")