# SafeSpace - Setup & Run Guide

## Prerequisites

- **Node.js** (version 18 or higher recommended)
- **npm** (comes with Node.js) or **yarn**

### Check if you have Node.js installed:
```bash
node --version
npm --version
```

If not installed, download from [nodejs.org](https://nodejs.org/)

## Quick Start

### 1. Navigate to the project directory
```bash
cd safespace-plus-main
```

### 2. Install dependencies
```bash
npm install
```

This will install all required packages (React, Vite, TypeScript, Tailwind CSS, etc.)

### 3. Start the development server
```bash
npm run dev
```

The app will start and you'll see output like:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: http://[your-ip]:8080/
```

### 4. Open in browser
Open [http://localhost:8080](http://localhost:8080) in your browser.

## Available Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build for production
- **`npm run preview`** - Preview production build locally
- **`npm run lint`** - Run ESLint to check code quality

## Building for Production

To create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist/` directory. You can then deploy this to any static hosting service (Vercel, Netlify, GitHub Pages, etc.).

## Troubleshooting

### Port already in use
If port 8080 is already in use, you can change it in `vite.config.ts`:
```typescript
server: {
  port: 3000, // or any other port
}
```

### Dependencies installation issues
Try clearing cache and reinstalling:
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
Make sure all dependencies are installed:
```bash
npm install
```

## Features Available

Once running, you'll have access to:
- ✅ AI Chat with multiple personality modes
- ✅ Daily mood check-ins
- ✅ CBT Tools (Thought Reframing, Worry Journal, TEB Analyzer, Coping Strategies)
- ✅ Journaling with AI insights
- ✅ Mood tracking and weekly summaries
- ✅ Breathing and grounding exercises
- ✅ Trusted contacts management
- ✅ Achievements system
- ✅ Multiple themes
- ✅ Voice-to-text input
- ✅ Offline support with IndexedDB
- ✅ Encrypted local storage

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

**Note:** Voice features require a browser with Web Speech API support (Chrome/Edge recommended).

## Need Help?

If you encounter any issues:
1. Check that Node.js version is 18+
2. Ensure all dependencies are installed (`npm install`)
3. Check the browser console for errors
4. Try clearing browser cache and localStorage



