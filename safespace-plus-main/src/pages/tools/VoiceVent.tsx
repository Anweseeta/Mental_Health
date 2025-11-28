import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Shield } from 'lucide-react';

export default function VoiceVent() {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <Mic className="h-16 w-16 text-pink-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Voice Vent Mode</h1>
          <p className="text-muted-foreground">Speak your feelings out loud</p>
        </div>

        {/* Recording UI */}
        <div className="bg-card border border-border rounded-2xl p-12 space-y-8">
          <div
            className={`mx-auto w-40 h-40 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? 'bg-gradient-to-br from-pink-500 to-red-500 animate-pulse-slow'
                : 'bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30'
            }`}
          >
            {isRecording ? (
              <Square className="h-16 w-16 text-white" />
            ) : (
              <Mic className="h-16 w-16 text-pink-500" />
            )}
          </div>

          <div className="space-y-2">
            {isRecording ? (
              <>
                <p className="text-2xl font-bold text-foreground">{formatDuration(duration)}</p>
                <p className="text-sm text-muted-foreground">Recording...</p>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold text-foreground">Ready to listen</p>
                <p className="text-sm text-muted-foreground">Tap to start venting</p>
              </>
            )}
          </div>

          <Button
            size="lg"
            className="w-full"
            variant={isRecording ? 'destructive' : 'default'}
            onClick={() => setIsRecording(!isRecording)}
          >
            {isRecording ? (
              <>
                <Square className="mr-2 h-5 w-5" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="mr-2 h-5 w-5" />
                Start Recording
              </>
            )}
          </Button>
        </div>

        {/* Privacy Notice */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-4 flex items-start gap-3 text-left border border-primary/20">
          <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-sm text-foreground">Your Privacy is Protected</p>
            <p className="text-xs text-muted-foreground">
              Your voice stays on your device. Nothing is recorded or sent anywhere. 
              This feature is for your emotional release only.
            </p>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p className="italic">
            Sometimes just speaking your thoughts out loud can help you process emotions. 
            Let it all out—this is your safe space.
          </p>
        </div>
      </div>
    </div>
  );
}
