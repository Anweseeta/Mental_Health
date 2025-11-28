import { useState } from 'react';
import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowRight, Brain, Heart, Activity } from 'lucide-react';
import { toast } from 'sonner';

export default function TEBAnalyzer() {
  const [thought, setThought] = useState('');
  const [emotion, setEmotion] = useState('');
  const [behavior, setBehavior] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!thought.trim() || !emotion.trim() || !behavior.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    await storage.addCBTEntry({
      type: 'teb',
      content: {
        thought,
        emotion,
        behavior,
      },
    });

    toast.success('TEB analysis saved!');
    setSaved(true);
    
    // Check achievements
    const entries = await storage.getCBTEntries();
    await storage.checkAchievements('cbt', entries.length);
  };

  const handleReset = () => {
    setThought('');
    setEmotion('');
    setBehavior('');
    setSaved(false);
  };

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2 pt-8">
          <Brain className="h-12 w-12 text-purple-500 mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-foreground">TEB Analyzer</h1>
          <p className="text-muted-foreground">
            Understand the connection between Thoughts, Emotions, and Behaviors
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="thought" className="text-base font-semibold flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Thought
              </Label>
              <Textarea
                id="thought"
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                placeholder="What thought went through your mind?"
                className="min-h-24 mt-2"
              />
            </div>

            <div className="flex justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>

            <div>
              <Label htmlFor="emotion" className="text-base font-semibold flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Emotion
              </Label>
              <Textarea
                id="emotion"
                value={emotion}
                onChange={(e) => setEmotion(e.target.value)}
                placeholder="What emotion did you feel as a result?"
                className="min-h-24 mt-2"
              />
            </div>

            <div className="flex justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>

            <div>
              <Label htmlFor="behavior" className="text-base font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                Behavior
              </Label>
              <Textarea
                id="behavior"
                value={behavior}
                onChange={(e) => setBehavior(e.target.value)}
                placeholder="What did you do (or want to do) as a result?"
                className="min-h-24 mt-2"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1"
              disabled={saved}
            >
              Start Over
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
              disabled={!thought.trim() || !emotion.trim() || !behavior.trim() || saved}
            >
              {saved ? 'Saved!' : 'Save Analysis'}
            </Button>
          </div>
        </div>

        <div className="bg-secondary/50 rounded-xl p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Understanding TEB:</strong> Our thoughts influence our emotions,
            which then influence our behaviors. By identifying these connections,
            we can learn to change unhelpful patterns.
          </p>
        </div>
      </div>
    </div>
  );
}



