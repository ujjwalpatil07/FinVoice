// components/dashboard/VoiceInput.jsx
import React, { useState, useRef } from "react";
import axios from "axios";
import { FaMicrophone } from "react-icons/fa6";

export default function VoiceInput({ onResult }) {
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        await fetchLLMResponse(audioBlob);

        // stop mic
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic access error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  async function fetchLLMResponse(audioBlob) {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.wav");

      const response = await axios.post(
        "http://localhost:8000/process-audio/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // backend should return { user_text: "...", message: "AI response ..." }
      if (onResult) onResult(response.data);
    } catch (err) {
      console.error("LLM request error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      disabled={loading}
      className={`ml-3 p-3 rounded-full ${
        isRecording ? "bg-red-500 text-white" : "bg-indigo-600 text-white"
      }`}
    >
      <FaMicrophone />
    </button>
  );
}
