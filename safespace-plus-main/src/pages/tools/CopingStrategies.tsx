import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { generateCopingSuggestions, detectEmotions, extractThemes } from '@/lib/ai-utils';

export default function CopingStrategies() {
  const [situation, setSituation] = useState('');
  const [strategies, setStrategies] = useState<string[]>([]);
  const [customStrategy, setCustomStrategy] = useState('');
  const [savedStrategies, setSavedStrategies] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (situation.trim()) {
      const emotions = detectEmotions(situation);
      const themes = extractThemes(situation);
      const suggestions = generateCopingSuggestions(emotions, themes);
      setStrategies(suggestions);
    } else {
      setStrategies([]);
    }
  }, [situation]);

  const handleAddCustom = () => {
    if (!customStrategy.trim()) return;
    setStrategies([...strategies, customStrategy]);
    setCustomStrategy('');
  };

  const handleToggleStrategy = (strategy: string) => {
    if (savedStrategies.includes(strategy)) {
      setSavedStrategies(savedStrategies.filter(s => s !== strategy));
    } else {
      setSavedStrategies([...savedStrategies, strategy]);
    }
  };

  const handleSave = async () => {
    if (savedStrategies.length === 0) {
      toast.error('Please select at least one strategy');
      return;
    }

    await storage.addCBTEntry({
      type: 'coping',
      content: {
        situation,
        strategies: savedStrategies,
      },
    });

    toast.success('Coping strategies saved!');
    setSaved(true);
    
    // Check achievements
    const entries = await storage.getCBTEntries();
    await storage.checkAchievements('cbt', entries.length);
  };

  const handleReset = () => {
    setSituation('');
    setStrategies([]);
    setCustomStrategy('');
    setSavedStrategies([]);
    setSaved(false);
  };

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2 pt-8">
          <Sparkles className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-foreground">Coping Strategies</h1>
          <p className="text-muted-foreground">
            Generate personalized coping strategies for difficult situations
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
          <div>
            <Label htmlFor="situation" className="text-base font-semibold">
              Describe the situation or challenge
            </Label>
            <Textarea
              id="situation"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="What situation are you facing? How does it make you feel?"
              className="min-h-32 mt-2"
            />
          </div>

          {strategies.length > 0 && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Suggested Coping Strategies
              </Label>
              <div className="space-y-2">
                {strategies.map((strategy, index) => (
                  <button
                    key={index}
                    onClick={() => handleToggleStrategy(strategy)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      savedStrategies.includes(strategy)
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Heart className={`h-5 w-5 mt-0.5 ${
                        savedStrategies.includes(strategy) ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                      <p className="text-sm text-foreground">{strategy}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="custom-strategy" className="text-base font-semibold">
              Add Your Own Strategy
            </Label>
            <div className="flex gap-2 mt-2">
              <Textarea
                id="custom-strategy"
                value={customStrategy}
                onChange={(e) => setCustomStrategy(e.target.value)}
                placeholder="Enter your own coping strategy..."
                className="min-h-20"
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAddCustom()}
              />
              <Button onClick={handleAddCustom} disabled={!customStrategy.trim()}>
                Add
              </Button>
            </div>
          </div>

          {savedStrategies.length > 0 && (
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
                {saved ? 'Saved!' : `Save ${savedStrategies.length} Strategy${savedStrategies.length > 1 ? 'ies' : ''}`}
              </Button>
            </div>
          )}
        </div>

        <div className="bg-secondary/50 rounded-xl p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Tip:</strong> Different strategies work for different situations.
            Try multiple approaches and see what helps you most.
          </p>
        </div>
      </div>
    </div>
  );
}



