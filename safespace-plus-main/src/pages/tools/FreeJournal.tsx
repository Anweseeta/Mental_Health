import { useState, useEffect } from 'react';
import { storage, JournalEntry } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { BookOpen, Sparkles, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { detectEmotions, extractThemes, generateCopingSuggestions } from '@/lib/ai-utils';

export default function FreeJournal() {
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const all = await storage.getJournalEntries();
    setEntries(all.filter((e) => e.type === 'free'));
  };

  const handleSave = async () => {
    if (!entry.trim()) return;

    setIsAnalyzing(true);
    
    // Generate AI insights
    const emotions = detectEmotions(entry);
    const themes = extractThemes(entry);
    const copingSuggestions = generateCopingSuggestions(emotions, themes);
    const insights = `Detected emotions: ${emotions.join(', ')}. Key themes: ${themes.join(', ')}.`;

    const newEntry = await storage.addJournalEntry({
      type: 'free',
      content: entry,
      emotions,
      themes,
      aiInsights: insights,
    });

    // Check achievements
    const allEntries = await storage.getJournalEntries();
    await storage.checkAchievements('journal', allEntries.length);

    setEntry('');
    await loadEntries();
    setIsAnalyzing(false);
    toast.success('Journal entry saved with AI insights!');
  };

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2 pt-8">
          <BookOpen className="h-12 w-12 text-purple-500 mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-foreground">Free Journal</h1>
          <p className="text-muted-foreground">Write freely, express yourself</p>
        </div>

        {/* Entry Form */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <Textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="Dear journal, today I..."
            className="min-h-48 text-lg resize-none"
          />
          <Button onClick={handleSave} className="w-full" size="lg" disabled={!entry.trim() || isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <BookOpen className="mr-2 h-5 w-5" />
                Save Entry
              </>
            )}
          </Button>
        </div>

        {/* Past Entries */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Your Entries</h2>
          {entries.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No entries yet. Start writing your thoughts!</p>
            </div>
          ) : (
            entries.map((item) => (
              <div
                key={item.id}
                className="bg-card border border-border rounded-xl p-5 space-y-4 hover:shadow-md transition-shadow"
              >
                <p className="text-foreground whitespace-pre-wrap">{item.content}</p>
                
                {/* AI Insights */}
                {item.emotions && item.emotions.length > 0 && (
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-primary">AI Insights</span>
                    </div>
                    <div className="space-y-1">
                      {item.emotions && item.emotions.length > 0 && (
                        <p className="text-xs text-foreground">
                          <strong>Emotions:</strong> {item.emotions.join(', ')}
                        </p>
                      )}
                      {item.themes && item.themes.length > 0 && (
                        <p className="text-xs text-foreground">
                          <strong>Themes:</strong> {item.themes.join(', ')}
                        </p>
                      )}
                      {item.aiInsights && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {item.aiInsights}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground">
                  {format(item.timestamp, 'MMM d, yyyy • HH:mm')}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
