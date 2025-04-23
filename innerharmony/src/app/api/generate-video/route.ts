import { NextResponse } from 'next/server';
import axios from 'axios';

const D_ID_API_KEY = process.env.D_ID_API_KEY;
const D_ID_API_URL = 'https://api.d-id.com';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // First, create a talk
    const talkResponse = await axios.post(
      `${D_ID_API_URL}/talks`,
      {
        script: {
          type: 'text',
          input: text,
          provider: {
            type: 'microsoft',
            voice_id: 'en-US-JennyNeural',
          },
        },
        source_url: 'https://storage.googleapis.com/d-id-avatars/avatar.jpg', // Replace with your avatar URL
        config: {
          fluent: true,
          pad_audio: 0.0,
        },
      },
      {
        headers: {
          Authorization: `Basic ${D_ID_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const talkId = talkResponse.data.id;

    // Poll for the video URL
    let videoUrl = null;
    let attempts = 0;
    const maxAttempts = 10;

    while (!videoUrl && attempts < maxAttempts) {
      const statusResponse = await axios.get(`${D_ID_API_URL}/talks/${talkId}`, {
        headers: {
          Authorization: `Basic ${D_ID_API_KEY}`,
        },
      });

      if (statusResponse.data.status === 'done') {
        videoUrl = statusResponse.data.result_url;
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before next attempt
      attempts++;
    }

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'Failed to generate video' },
        { status: 500 }
      );
    }

    return NextResponse.json({ videoUrl });
  } catch (error) {
    console.error('Error generating video:', error);
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    );
  }
} 