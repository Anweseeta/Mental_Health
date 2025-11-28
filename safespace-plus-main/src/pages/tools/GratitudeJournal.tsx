import { useState, useEffect } from 'react';
import { storage, JournalEntry } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Sparkles, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function GratitudeJournal() {
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const all = await storage.getJournalEntries();
    setEntries(all.filter((e) => e.type === 'gratitude'));
  };

  const handleSave = async () => {
    if (!entry.trim()) return;

    await storage.addJournalEntry({
      type: 'gratitude',
      content: entry,
    });

    // Check achievements
    const allEntries = await storage.getJournalEntries();
    await storage.checkAchievements('journal', allEntries.length);

    setEntry('');
    await loadEntries();
    toast.success('Gratitude entry saved!');
  };

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2 pt-8">
          <Sparkles className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-foreground">Gratitude Journal</h1>
          <p className="text-muted-foreground">What are you grateful for today?</p>
        </div>

        {/* Entry Form */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <Textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="I'm grateful for..."
            className="min-h-32 text-lg resize-none"
          />
          <Button onClick={handleSave} className="w-full" size="lg" disabled={!entry.trim()}>
            <Sparkles className="mr-2 h-5 w-5" />
            Save Gratitude
          </Button>
        </div>

        {/* Past Entries */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Your Gratitudes</h2>
          {entries.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No entries yet. Start by writing what you're grateful for!</p>
            </div>
          ) : (
            entries.map((item) => (
              <div
                key={item.id}
                className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-5 space-y-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-foreground flex-1">{item.content}</p>
                </div>
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
