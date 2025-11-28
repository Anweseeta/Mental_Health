import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function Breathing() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(0);

  const phases = {
    inhale: { duration: 4, text: 'Breathe In', color: 'from-blue-400 to-blue-600' },
    hold: { duration: 4, text: 'Hold', color: 'from-teal-400 to-teal-600' },
    exhale: { duration: 6, text: 'Breathe Out', color: 'from-purple-400 to-purple-600' },
  };

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= phases[phase].duration) {
          // Move to next phase
          if (phase === 'inhale') setPhase('hold');
          else if (phase === 'hold') setPhase('exhale');
          else setPhase('inhale');
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const reset = () => {
    setIsActive(false);
    setPhase('inhale');
    setCount(0);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Breathing Exercise</h1>
          <p className="text-muted-foreground">Follow the circle and breathe</p>
        </div>

        {/* Breathing Circle */}
        <div className="relative h-80 flex items-center justify-center">
          <div
            className={`absolute w-64 h-64 rounded-full bg-gradient-to-br ${
              phases[phase].color
            } ${
              isActive ? 'animate-breathing' : ''
            } shadow-2xl flex items-center justify-center transition-all duration-1000`}
          >
            <div className="text-center text-white">
              <p className="text-2xl font-bold mb-2">{phases[phase].text}</p>
              <p className="text-5xl font-bold">
                {phases[phase].duration - count}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => setIsActive(!isActive)}
            className="w-32"
          >
            {isActive ? (
              <>
                <Pause className="mr-2 h-5 w-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                Start
              </>
            )}
          </Button>
          <Button size="lg" variant="outline" onClick={reset} className="w-32">
            <RotateCcw className="mr-2 h-5 w-5" />
            Reset
          </Button>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            Follow the breathing pattern: Inhale for 4 seconds, hold for 4 seconds, 
            then exhale for 6 seconds. This technique helps reduce anxiety and stress.
          </p>
        </div>
      </div>
    </div>
  );
}
