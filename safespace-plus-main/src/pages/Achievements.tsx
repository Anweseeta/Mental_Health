import { useState, useEffect } from 'react';
import { storage, Achievement } from '@/lib/storage';
import { Trophy, Star, Award } from 'lucide-react';
import { format } from 'date-fns';

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    const all = await storage.getAchievements();
    setAchievements(all.sort((a, b) => b.unlockedAt - a.unlockedAt));
  };

  const achievementIcons: Record<string, typeof Trophy> = {
    journal: Trophy,
    mood: Star,
    breathing: Award,
    cbt: Trophy,
  };

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2 pt-8">
          <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-foreground">Achievements</h1>
          <p className="text-muted-foreground">Your progress and milestones</p>
        </div>

        {achievements.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Trophy className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p>No achievements unlocked yet.</p>
            <p className="text-sm">Keep using SafeSpace to unlock achievements!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {achievements.map((achievement) => {
              const Icon = achievementIcons[achievement.type] || Trophy;
              return (
                <div
                  key={achievement.id}
                  className="bg-card border border-border rounded-xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="bg-yellow-500/10 p-3 rounded-full">
                    <Icon className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Unlocked {format(achievement.unlockedAt, 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}



