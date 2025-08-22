import React, { useState } from "react";
import { FaMicrophone } from "react-icons/fa6";

export default function VoiceInput() {
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    setIsRecording(true);
    
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={startRecording}
        className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400"
      >
        <FaMicrophone fontSize={24} />
      </button>

      {/* Animated bars */}
      {isRecording && (
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="w-1 h-4 bg-indigo-500 dark:bg-indigo-300 rounded animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
}
