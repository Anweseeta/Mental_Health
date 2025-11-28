import { useEffect } from 'react';

export type Mood = 'happy' | 'neutral' | 'sad' | 'worried' | 'stressed';

const moodThemes = {
  happy: {
    background: 'linear-gradient(135deg, hsl(45, 90%, 90%), hsl(340, 80%, 92%))',
  },
  neutral: {
    background: 'hsl(var(--background))',
  },
  sad: {
    background: 'linear-gradient(135deg, hsl(210, 65%, 85%), hsl(220, 60%, 90%))',
  },
  worried: {
    background: 'linear-gradient(135deg, hsl(180, 50%, 85%), hsl(195, 55%, 90%))',
  },
  stressed: {
    background: 'linear-gradient(135deg, hsl(20, 70%, 88%), hsl(195, 65%, 88%))',
  },
};

export function useMoodTheme(mood: Mood | null) {
  useEffect(() => {
    if (mood && mood !== 'neutral') {
      document.body.style.background = moodThemes[mood].background;
      document.body.style.transition = 'background 1s ease-in-out';
    } else {
      document.body.style.background = '';
    }

    return () => {
      document.body.style.background = '';
    };
  }, [mood]);
}
