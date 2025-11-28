import { useState } from 'react';
import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function WorryJournal() {
  const [worry, setWorry] = useState('');
  const [canControl, setCanControl] = useState<'yes' | 'no' | null>(null);
  const [actionPlan, setActionPlan] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!worry.trim()) {
      toast.error('Please describe your worry');
      return;
    }

    await storage.addCBTEntry({
      type: 'worry',
      content: {
        worry,
        canControl,
        actionPlan,
      },
    });

    toast.success('Worry journal entry saved!');
    setSaved(true);
    
    // Check achievements
    const entries = await storage.getCBTEntries();
    await storage.checkAchievements('cbt', entries.length);
  };

  const handleReset = () => {
    setWorry('');
    setCanControl(null);
    setActionPlan('');
    setSaved(false);
  };

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2 pt-8">
          <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-foreground">Worry Journal</h1>
          <p className="text-muted-foreground">
            Process worries and focus on what you can control
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
          <div>
            <Label htmlFor="worry" className="text-base font-semibold">
              What are you worried about?
            </Label>
            <Textarea
              id="worry"
              value={worry}
              onChange={(e) => setWorry(e.target.value)}
              placeholder="Describe your worry in detail..."
              className="min-h-32 mt-2"
            />
          </div>

          <div>
            <Label className="text-base font-semibold mb-3 block">
              Can you control this?
            </Label>
            <div className="flex gap-3">
              <Button
                variant={canControl === 'yes' ? 'default' : 'outline'}
                onClick={() => setCanControl('yes')}
                className="flex-1"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Yes, I can control this
              </Button>
              <Button
                variant={canControl === 'no' ? 'default' : 'outline'}
                onClick={() => setCanControl('no')}
                className="flex-1"
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                No, I cannot control this
              </Button>
            </div>
          </div>

          {canControl && (
            <div>
              <Label htmlFor="action-plan" className="text-base font-semibold">
                {canControl === 'yes' 
                  ? 'What action can you take?'
                  : 'How can you accept and let go?'}
              </Label>
              <Textarea
                id="action-plan"
                value={actionPlan}
                onChange={(e) => setActionPlan(e.target.value)}
                placeholder={
                  canControl === 'yes'
                    ? 'What specific steps can you take to address this worry?'
                    : 'How can you practice acceptance and focus on what matters?'
                }
                className="min-h-24 mt-2"
              />
            </div>
          )}

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
              disabled={!worry.trim() || !canControl || saved}
            >
              {saved ? 'Saved!' : 'Save Entry'}
            </Button>
          </div>
        </div>

        <div className="bg-secondary/50 rounded-xl p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Tip:</strong> Worrying about things you can't control wastes energy.
            Focus your efforts on what you can influence, and practice acceptance for the rest.
          </p>
        </div>
      </div>
    </div>
  );
}



