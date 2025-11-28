import { useState } from 'react';
import { storage, MoodEntry } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Smile, Meh, Frown, AlertCircle, Zap, X } from 'lucide-react';
import { toast } from 'sonner';

type Mood = 'happy' | 'neutral' | 'sad' | 'worried' | 'stressed';

const moodConfig = {
  happy: { icon: Smile, label: 'Happy', color: 'text-mood-happy bg-mood-happy/10' },
  neutral: { icon: Meh, label: 'Neutral', color: 'text-mood-neutral bg-mood-neutral/10' },
  sad: { icon: Frown, label: 'Sad', color: 'text-mood-sad bg-mood-sad/10' },
  worried: { icon: AlertCircle, label: 'Worried', color: 'text-mood-worried bg-mood-worried/10' },
  stressed: { icon: Zap, label: 'Stressed', color: 'text-mood-stressed bg-mood-stressed/10' },
};

interface DailyCheckInProps {
  open: boolean;
  onClose: () => void;
}

export function DailyCheckIn({ open, onClose }: DailyCheckInProps) {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedMood) {
      toast.error('Please select how you\'re feeling');
      return;
    }

    setIsSaving(true);
    try {
      await storage.addMoodEntry(selectedMood, note || undefined);
      await storage.addDailyCheckIn({ mood: selectedMood, note: note || undefined });
      
      // Check for achievements
      const moods = await storage.getMoodEntries();
      await storage.checkAchievements('mood', moods.length);
      
      toast.success('Check-in saved!');
      onClose();
      setSelectedMood(null);
      setNote('');
    } catch (error) {
      toast.error('Failed to save check-in');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Daily Check-In</DialogTitle>
          <DialogDescription>
            How are you feeling today? This helps us understand your emotional journey.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Mood Selection */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              How are you feeling?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(Object.entries(moodConfig) as [Mood, typeof moodConfig[Mood]][]).map(([mood, config]) => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    selectedMood === mood
                      ? `${config.color} border-current scale-105`
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <config.icon className="h-6 w-6" />
                  <span className="text-xs font-medium">{config.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Anything on your mind? (Optional)
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Share what's affecting your mood today..."
              className="min-h-24 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1"
              disabled={isSaving}
            >
              Skip
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
              disabled={!selectedMood || isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}



