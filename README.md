# InnerHarmony - Mental Well-being Platform for Women

InnerHarmony is a full-stack web application built with Next.js and Firebase, designed to support women's mental well-being through therapy sessions, AI-generated counseling videos, and mood tracking.

## Features

- 🎥 Therapy video sessions with filtering and search
- 🤖 AI-generated personalized counseling videos
- 📊 Mood tracking and feedback system
- 🔐 Secure authentication (Email + Anonymous)
- 💬 Interactive video comments and engagement
- 🎨 Beautiful, responsive UI with animations

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Firebase (Auth, Firestore, Storage)
- **AI Integration**: OpenAI/Groq, D-ID API
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ and npm
- Firebase account
- OpenAI API key
- D-ID API key

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# D-ID
D_ID_API_KEY=your_d_id_api_key

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/inner-harmony.git
   cd inner-harmony
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a new Firebase project
   - Enable Authentication (Email/Password and Anonymous)
   - Create a Firestore database
   - Set up Firebase Storage
   - Add your Firebase configuration to `.env.local`

4. Set up OpenAI and D-ID:
   - Get API keys from OpenAI and D-ID
   - Add them to `.env.local`

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── therapy/           # Therapy sessions page
│   ├── video/             # Video player page
│   ├── generate/          # AI video generation
│   ├── feedback/          # Mood tracking
│   └── login/             # Authentication
├── components/            # Reusable components
├── firebase/             # Firebase configuration
├── lib/                  # Utility functions and hooks
└── public/              # Static assets
```

## Firebase Setup

1. Create a new Firebase project
2. Enable Authentication:
   - Email/Password
   - Anonymous
3. Create Firestore database with the following collections:
   - `videos`: Store video metadata
   - `feedback`: Store user feedback and mood data
4. Set up Firebase Storage for video files
5. Update security rules for Firestore and Storage

## Deployment

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [OpenAI](https://openai.com/)
- [D-ID](https://www.d-id.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) 