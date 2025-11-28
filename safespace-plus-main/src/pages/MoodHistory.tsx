import { useState, useEffect } from 'react';
import { storage, MoodEntry } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Smile, Meh, Frown, AlertCircle, Zap, TrendingUp } from 'lucide-react';
import { format, startOfWeek, subDays, startOfDay, endOfDay } from 'date-fns';
import { useMoodTheme } from '@/hooks/useMoodTheme';

type Mood = 'happy' | 'neutral' | 'sad' | 'worried' | 'stressed';

const moodConfig = {
  happy: { icon: Smile, label: 'Happy', color: 'text-mood-happy bg-mood-happy/10' },
  neutral: { icon: Meh, label: 'Neutral', color: 'text-mood-neutral bg-mood-neutral/10' },
  sad: { icon: Frown, label: 'Sad', color: 'text-mood-sad bg-mood-sad/10' },
  worried: { icon: AlertCircle, label: 'Worried', color: 'text-mood-worried bg-mood-worried/10' },
  stressed: { icon: Zap, label: 'Stressed', color: 'text-mood-stressed bg-mood-stressed/10' },
};

export default function MoodHistory() {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  useMoodTheme(selectedMood);

  useEffect(() => {
    loadMoods();
  }, []);

  const loadMoods = async () => {
    const allMoods = await storage.getMoodEntries();
    setMoods(allMoods);
  };

  const handleMoodSelect = async (mood: Mood) => {
    setSelectedMood(mood);
    await storage.addMoodEntry(mood);
    await loadMoods();
    
    // Check achievements
    await storage.checkAchievements('mood', moods.length + 1);
    
    setTimeout(() => setSelectedMood(null), 3000);
  };

  // Calculate insights
  const weekStart = startOfWeek(new Date());
  const weekMoods = moods.filter((m) => m.timestamp >= weekStart.getTime());
  
  const moodCounts = weekMoods.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominantMood = Object.entries(moodCounts).sort(([, a], [, b]) => b - a)[0];
  const streakCount = calculateStreak(moods);

  // Weekly summary
  const lastWeekStart = startOfWeek(subDays(new Date(), 7));
  const lastWeekEnd = endOfDay(subDays(new Date(), 1));
  const lastWeekMoods = moods.filter((m) => 
    m.timestamp >= lastWeekStart.getTime() && m.timestamp <= lastWeekEnd.getTime()
  );

  const weeklyMoodTrend = lastWeekMoods.length > 0 
    ? lastWeekMoods.reduce((sum, m) => {
        const moodValues: Record<Mood, number> = {
          happy: 5,
          neutral: 3,
          sad: 1,
          worried: 2,
          stressed: 1,
        };
        return sum + moodValues[m.mood];
      }, 0) / lastWeekMoods.length
    : 0;

  function calculateStreak(entries: MoodEntry[]): number {
    if (entries.length === 0) return 0;
    
    let streak = 1;
    const today = new Date().setHours(0, 0, 0, 0);
    const dates = entries
      .map((e) => new Date(e.timestamp).setHours(0, 0, 0, 0))
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => b - a);

    if (dates[0] !== today && dates[0] !== today - 86400000) return 0;

    for (let i = 0; i < dates.length - 1; i++) {
      if (dates[i] - dates[i + 1] === 86400000) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2 pt-8">
          <h1 className="text-3xl font-bold text-foreground">Mood Tracker</h1>
          <p className="text-muted-foreground">How are you feeling today?</p>
        </div>

        {/* Mood Selection */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Log Your Mood</h2>
          <div className="grid grid-cols-5 gap-3">
            {(Object.entries(moodConfig) as [Mood, typeof moodConfig[Mood]][]).map(([mood, config]) => (
              <button
                key={mood}
                onClick={() => handleMoodSelect(mood)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                  selectedMood === mood
                    ? `${config.color} border-current`
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <config.icon className="h-8 w-8" />
                <span className="text-xs font-medium">{config.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Weekly Summary */}
        {lastWeekMoods.length > 0 && (
          <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl p-6 border border-accent/20 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              <h2 className="text-xl font-semibold text-foreground">Weekly Summary</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-card/50 rounded-xl">
                <div className="text-3xl">📈</div>
                <div>
                  <p className="font-medium text-foreground">Average Mood</p>
                  <p className="text-sm text-muted-foreground">
                    {weeklyMoodTrend >= 4 ? 'Positive' : weeklyMoodTrend >= 3 ? 'Neutral' : 'Challenging'} week
                    ({lastWeekMoods.length} check-ins)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Insights */}
        {weekMoods.length > 0 && (
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">This Week's Insights</h2>
            <div className="space-y-3">
              {dominantMood && (
                <div className="flex items-center gap-3 p-4 bg-card/50 rounded-xl">
                  <div className="text-3xl">📊</div>
                  <div>
                    <p className="font-medium text-foreground">Most Common Mood</p>
                    <p className="text-sm text-muted-foreground">
                      You felt <span className="font-semibold capitalize">{dominantMood[0]}</span> most this week
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-4 bg-card/50 rounded-xl">
                <div className="text-3xl">🔥</div>
                <div>
                  <p className="font-medium text-foreground">Tracking Streak</p>
                  <p className="text-sm text-muted-foreground">
                    {streakCount} {streakCount === 1 ? 'day' : 'days'} in a row!
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-card/50 rounded-xl">
                <div className="text-3xl">💪</div>
                <div>
                  <p className="font-medium text-foreground">Keep Going!</p>
                  <p className="text-sm text-muted-foreground">
                    You've logged {weekMoods.length} mood{weekMoods.length !== 1 ? 's' : ''} this week
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Entries */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Recent Moods</h2>
          {moods.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No moods tracked yet. Select a mood above to start!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {moods.slice(0, 10).map((entry) => {
                const config = moodConfig[entry.mood];
                return (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-4 p-4 rounded-xl ${config.color}`}
                  >
                    <config.icon className="h-6 w-6 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground capitalize">{entry.mood}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(entry.timestamp, 'MMM d, yyyy • HH:mm')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
