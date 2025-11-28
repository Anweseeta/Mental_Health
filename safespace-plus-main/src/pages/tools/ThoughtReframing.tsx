import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Brain, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';

export default function ThoughtReframing() {
  const [negativeThought, setNegativeThought] = useState('');
  const [evidenceFor, setEvidenceFor] = useState('');
  const [evidenceAgainst, setEvidenceAgainst] = useState('');
  const [reframedThought, setReframedThought] = useState('');
  const [saved, setSaved] = useState(false);

  const handleReframe = () => {
    if (!negativeThought.trim()) {
      toast.error('Please enter a negative thought');
      return;
    }

    // Simple reframing logic - in a real app, this would use AI
    const reframed = `Instead of "${negativeThought}", consider: This thought may not be entirely accurate. ${evidenceAgainst || 'There may be alternative perspectives.'} I can choose to focus on what I can control and be kind to myself.`;
    setReframedThought(reframed);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!negativeThought.trim() || !reframedThought.trim()) {
      toast.error('Please complete the reframing exercise first');
      return;
    }

    await storage.addCBTEntry({
      type: 'reframing',
      content: {
        negativeThought,
        evidenceFor,
        evidenceAgainst,
        reframedThought,
      },
    });

    toast.success('Reframing saved!');
    setSaved(true);
    
    // Check achievements
    const entries = await storage.getCBTEntries();
    await storage.checkAchievements('cbt', entries.length);
  };

  const handleReset = () => {
    setNegativeThought('');
    setEvidenceFor('');
    setEvidenceAgainst('');
    setReframedThought('');
    setSaved(false);
  };

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2 pt-8">
          <Brain className="h-12 w-12 text-primary mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-foreground">Thought Reframing</h1>
          <p className="text-muted-foreground">
            Challenge negative thoughts and find balanced perspectives
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
          <div>
            <Label htmlFor="negative-thought" className="text-base font-semibold">
              What's the negative thought?
            </Label>
            <Textarea
              id="negative-thought"
              value={negativeThought}
              onChange={(e) => setNegativeThought(e.target.value)}
              placeholder="e.g., 'I always mess things up'"
              className="min-h-24 mt-2"
            />
          </div>

          <div>
            <Label htmlFor="evidence-for" className="text-base font-semibold">
              Evidence FOR this thought
            </Label>
            <Textarea
              id="evidence-for"
              value={evidenceFor}
              onChange={(e) => setEvidenceFor(e.target.value)}
              placeholder="What makes you think this might be true?"
              className="min-h-20 mt-2"
            />
          </div>

          <div>
            <Label htmlFor="evidence-against" className="text-base font-semibold">
              Evidence AGAINST this thought
            </Label>
            <Textarea
              id="evidence-against"
              value={evidenceAgainst}
              onChange={(e) => setEvidenceAgainst(e.target.value)}
              placeholder="What contradicts this thought? What would a friend say?"
              className="min-h-20 mt-2"
            />
          </div>

          <Button onClick={handleReframe} className="w-full" size="lg">
            <Lightbulb className="mr-2 h-5 w-5" />
            Generate Reframed Thought
          </Button>

          {reframedThought && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 space-y-3">
              <Label className="text-base font-semibold text-primary">Reframed Thought</Label>
              <p className="text-foreground whitespace-pre-wrap">{reframedThought}</p>
            </div>
          )}

          {reframedThought && (
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
                disabled={saved}
              >
                {saved ? 'Saved!' : 'Save This Reframing'}
              </Button>
            </div>
          )}
        </div>

        <div className="bg-secondary/50 rounded-xl p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Tip:</strong> This CBT technique helps you examine your thoughts more objectively.
            By looking at evidence for and against a thought, you can develop a more balanced perspective.
          </p>
        </div>
      </div>
    </div>
  );
}



