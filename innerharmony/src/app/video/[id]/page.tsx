'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Video } from '@/firebase/config';
import { useAuth } from '@/lib/hooks/useAuth';
import { FaHeart, FaComment, FaBookmark, FaShare } from 'react-icons/fa';

export default function VideoPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<string[]>([]);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const videoDoc = await getDoc(doc(db, 'videos', id as string));
        if (videoDoc.exists()) {
          const videoData = { id: videoDoc.id, ...videoDoc.data() } as Video;
          setVideo(videoData);
          setIsLiked(videoData.likes?.includes(user?.uid || '') || false);
          setIsSaved(videoData.savedBy?.includes(user?.uid || '') || false);
          setComments(videoData.comments || []);
        }
      } catch (error) {
        console.error('Error fetching video:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id, user]);

  const handleLike = async () => {
    if (!user || !video) return;

    try {
      const videoRef = doc(db, 'videos', video.id);
      if (isLiked) {
        await updateDoc(videoRef, {
          likes: arrayRemove(user.uid),
        });
      } else {
        await updateDoc(videoRef, {
          likes: arrayUnion(user.uid),
        });
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleSave = async () => {
    if (!user || !video) return;

    try {
      const videoRef = doc(db, 'videos', video.id);
      if (isSaved) {
        await updateDoc(videoRef, {
          savedBy: arrayRemove(user.uid),
        });
      } else {
        await updateDoc(videoRef, {
          savedBy: arrayUnion(user.uid),
        });
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error updating save:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !video || !comment.trim()) return;

    try {
      const videoRef = doc(db, 'videos', video.id);
      const newComment = `${user.email || 'Anonymous'}: ${comment}`;
      await updateDoc(videoRef, {
        comments: arrayUnion(newComment),
      });
      setComments([...comments, newComment]);
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Video not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="aspect-video bg-black rounded-xl overflow-hidden">
        <video
          src={video.videoUrl}
          controls
          className="w-full h-full"
          poster={video.thumbnailUrl}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{video.title}</h1>
            <p className="text-gray-600 mt-2">{video.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isLiked
                  ? 'bg-pink-100 text-pink-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaHeart className={isLiked ? 'fill-current' : ''} />
              <span>Like</span>
            </button>

            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isSaved
                  ? 'bg-purple-100 text-purple-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaBookmark className={isSaved ? 'fill-current' : ''} />
              <span>Save</span>
            </button>

            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">
              <FaShare />
              <span>Share</span>
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Benefits</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {video.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Affirmations</h2>
            <ul className="space-y-2">
              {video.affirmations.map((affirmation, index) => (
                <li
                  key={index}
                  className="bg-purple-50 text-purple-600 p-4 rounded-lg"
                >
                  {affirmation}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Comments
            </h2>
            <form onSubmit={handleComment} className="mb-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-3 rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                rows={3}
              />
              <button
                type="submit"
                className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Post Comment
              </button>
            </form>

            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg text-gray-600"
                >
                  {comment}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 