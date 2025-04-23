'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaSpinner, FaRobot } from 'react-icons/fa';

export default function GeneratePage() {
  const [concern, setConcern] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [generatedText, setGeneratedText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concern.trim()) return;

    setLoading(true);
    setError('');
    setVideoUrl('');
    setGeneratedText('');

    try {
      // First, generate the counseling text using OpenAI/Groq
      const textResponse = await axios.post('/api/generate-text', {
        concern: concern.trim(),
      });

      const counselingText = textResponse.data.text;
      setGeneratedText(counselingText);

      // Then, generate the video using D-ID API
      const videoResponse = await axios.post('/api/generate-video', {
        text: counselingText,
      });

      setVideoUrl(videoResponse.data.videoUrl);
    } catch (error) {
      console.error('Error generating video:', error);
      setError('Failed to generate video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-purple-600 mb-4">
          AI Counseling Video Generator
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Share your concerns, and our AI will generate a personalized counseling
          video to help you navigate through your challenges.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div>
          <label
            htmlFor="concern"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            What's on your mind?
          </label>
          <textarea
            id="concern"
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            placeholder="For example: I've been feeling anxious about my work-life balance..."
            className="w-full p-4 rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 min-h-[150px]"
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>
              <FaRobot className="mr-2" />
              Generate Video
            </>
          )}
        </button>
      </form>

      {generatedText && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Generated Counseling
          </h2>
          <p className="text-gray-600 whitespace-pre-line">{generatedText}</p>
        </motion.div>
      )}

      {videoUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Your Personalized Video
          </h2>
          <div className="aspect-video bg-black rounded-xl overflow-hidden">
            <video
              src={videoUrl}
              controls
              className="w-full h-full"
              poster="/assets/video-placeholder.jpg"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
} 