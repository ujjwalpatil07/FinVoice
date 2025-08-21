import React from 'react';
import { Link } from 'react-router-dom';
import { FileWarning, ArrowLeftCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 px-6 text-center">
      <FileWarning className="text-indigo-600 dark:text-indigo-400 w-24 h-24 mb-8 animate-pulse" />
      <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-300 mb-6">
        Oops! Page Not Found
      </h2>
      <p className="max-w-xl text-gray-600 dark:text-gray-400 mb-8">
        The financial insights you’re looking for aren’t available here. Maybe your wallet took a detour? Don’t worry, let's get you back on track with <strong>FinVoice</strong> — your AI-powered financial assistant.
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-600 transition"
      >
        <ArrowLeftCircle className="w-6 h-6 mr-2" />
        Back to Landing
      </Link>
    </div>
  );
}
