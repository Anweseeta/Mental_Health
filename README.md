🌱 SafeSpace

A compassionate mental health companion app designed to provide immediate support, coping tools, and a safe emotional space.

🔗 Live Demo: [https://mental-health-ten-kappa.vercel.app/](https://mental-health-ten-kappa.vercel.app/)



✨ Features

🔒 Anonymous & Private

 Anonymous Access: Auto-generated usernames (e.g., `User_4832`) — no email or password required
 Privacy Mode: Option to clear chat history automatically when the app closes
 Local Storage Only: All data stays on your device



 💬 AI Chat Companion

 Supportive AI conversation flow
 Typing animations for realistic chat
 Quick reply suggestions
 Day-separated chat history
 Smooth auto-scroll and animations



 🧘 Mental Health Tools

 Breathing Exercise: Animated inhale → hold → exhale guidance
 Grounding Technique: 5-4-3-2-1 sensory grounding
 Gratitude Journal: Capture positive moments daily
 Free Journal: Safe place to express thoughts
 Voice Vent Mode: UI for verbal expression (placeholder)



 📊 Mood Tracking

 Log moods: Happy, Neutral, Sad, Worried, Stressed
 Weekly mood patterns & insights
 Streak counter for daily tracking
 Dynamic UI themes based on selected mood



 🆘 Crisis Support

 Crisis mode screen for emergencies
 Hotline resources
 Quick access to calming tools



 👥 Trusted Contacts

 Save trusted emergency contacts
 Store name, relationship, and phone
 Locally stored for privacy



 🎨 Emotion-Based Themes

Dynamic themes that match your mood:

 Sad: Cool calming blues
 Worried: Soft teal tones
 Stressed: Warm-to-cool animated gradient
 Neutral: Balanced tones
 Happy: Bright pastels



## 🛠️ Tech Stack

 Framework: React 18 + TypeScript
 Build Tool: Vite
 Styling: Tailwind CSS
 Components: shadcn/ui + Radix UI
 Routing: React Router v6
 State Management: React Query
 Animations: Lucide Icons + Custom CSS
 Storage: LocalStorage



## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Go to project folder
cd safespace

# Install dependencies
npm install

# Start development server
npm run dev
```



## 🚀 Usage

1. Open the app — you'll get an anonymous username
2. Explore the home screen
3. Chat with the AI companion
4. Use breathing, grounding, and journaling tools
5. Track your mood
6. Save trusted contacts
7. Access emergency help anytime with the red button



## 📁 Project Structure

```
src/
├── components/
│   ├── Layout.tsx
│   ├── NavLink.tsx
│   └── ui/
├── pages/
│   ├── Home.tsx
│   ├── Chat.tsx
│   ├── Tools.tsx
│   ├── MoodHistory.tsx
│   ├── Crisis.tsx
│   ├── Settings.tsx
│   ├── TrustedContacts.tsx
│   └── tools/
│       ├── Breathing.tsx
│       ├── Grounding.tsx
│       ├── GratitudeJournal.tsx
│       ├── FreeJournal.tsx
│       └── VoiceVent.tsx
├── hooks/
│   └── useMoodTheme.ts
├── lib/
│   ├── storage.ts
│   ├── username.ts
│   └── utils.ts
└── index.css
```



## 🎨 Design System

 Mood-based color tokens
 Smooth animations and transitions
 Fully responsive
 (Coming soon) Dark Mode



🔐 Privacy

 No backend — everything is stored locally
 No trackers or analytics
 No login required
 Optional data clearing


🚧 Limitations

 AI responses are simulated (no backend yet)
 Voice Vent is UI only
 Mood chart uses placeholder data
 No cloud sync across devices
 No reminder notifications yet



🛣️ Roadmap

 [ ] Real AI integration
 [ ] Cloud sync
 [ ] Voice recording
 [ ] More therapeutic tools
 [ ] Onboarding flow
 [ ] Notifications
 [ ] Advanced analytics
 [ ] Meditation timer
 [ ] Community resources



🤝 Contributing

```bash
# Create a feature branch
git checkout -b feature/AmazingFeature

# Commit changes
git commit -m "Add AmazingFeature"

# Push the branch
git push origin feature/AmazingFeature
```

Then open a Pull Request.



⚠️ Disclaimer

SafeSpace is a supportive tool — not a replacement for professional mental health care.
If you’re in crisis, please contact your local emergency hotline or visit:

IASP Crisis Centres: [https://www.iasp.info/resources/Crisis_Centres/](https://www.iasp.info/resources/Crisis_Centres/)


💙 Acknowledgments

Made with care for anyone who needs a safe place to breathe, feel, and heal.
You matter. You are not alone. 💚

 
