'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useAuth } from '@/lib/hooks/useAuth';
import { FaSadTear, FaMeh, FaSmile, FaRegCalendarAlt } from 'react-icons/fa';

const moodEmojis = [
  { icon: FaSadTear, label: 'Very Low', value: 1 },
  { icon: FaMeh, label: 'Neutral', value: 5 },
  { icon: FaSmile, label: 'Very High', value: 10 },
];

export default function FeedbackPage() {
  const { user } = useAuth();
  const [mood, setMood] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);

    try {
      await addDoc(collection(db, 'feedback'), {
        userId: user.uid,
        mood,
        feedback: feedback.trim(),
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      setMood(5);
      setFeedback('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-purple-600 mb-4">
          Mood Tracker
        </h1>
        <p className="text-gray-600">
          Track your emotional well-being and share your thoughts with us.
        </p>
      </div>

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 text-green-600 p-6 rounded-xl text-center"
        >
          <p className="text-lg font-medium">
            Thank you for sharing your feedback!
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 text-green-600 hover:text-green-700"
          >
            Submit another entry
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              How are you feeling today?
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between mb-2">
                {moodEmojis.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center text-gray-600"
                  >
                    <Icon className="text-2xl mb-1" />
                    <span className="text-xs">{label}</span>
                  </div>
                ))}
              </div>

              <input
                type="range"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Additional Feedback
            </h2>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts, feelings, or any specific concerns..."
              className="w-full p-4 rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 min-h-[150px]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {submitting ? (
              <>
                <FaRegCalendarAlt className="animate-pulse mr-2" />
                Submitting...
              </>
            ) : (
              'Submit Feedback'
            )}
          </button>
        </form>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Why Track Your Mood?
        </h2>
        <ul className="space-y-3 text-gray-600">
          <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            Gain insights into your emotional patterns and triggers
          </li>
          <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            Identify what activities or situations affect your well-being
          </li>
          <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            Track your progress over time
          </li>
          <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            Share your experiences with your therapist or counselor
          </li>
        </ul>
      </div>
    </div>
  );
} 