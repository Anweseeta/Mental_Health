import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { generateUsername } from '@/lib/username';
import { Button } from '@/components/ui/button';
import { MessageCircle, Heart, History, Shield } from 'lucide-react';
import { DailyCheckIn } from '@/components/DailyCheckIn';

export default function Home() {
  const [username, setUsername] = useState<string>('');
  const [showCheckIn, setShowCheckIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let user = storage.getUsername();
    if (!user) {
      user = generateUsername();
      storage.setUsername(user);
    }
    setUsername(user);

    // Check if user has checked in today
    const checkDailyCheckIn = async () => {
      const hasCheckedIn = await storage.hasCheckedInToday();
      if (!hasCheckedIn) {
        // Show check-in after a short delay
        setTimeout(() => setShowCheckIn(true), 1000);
      }
    };
    checkDailyCheckIn();
  }, []);

  const quickActions = [
    {
      icon: MessageCircle,
      label: 'Start Chatting',
      description: 'Talk to your AI companion',
      path: '/chat',
      color: 'bg-primary',
    },
    {
      icon: Heart,
      label: 'Mental Health Tools',
      description: 'Breathing, grounding & more',
      path: '/tools',
      color: 'bg-accent',
    },
    {
      icon: History,
      label: 'Track Your Mood',
      description: 'See your emotional journey',
      path: '/mood-history',
      color: 'bg-mood-happy',
    },
  ];

  return (
    <>
      <DailyCheckIn open={showCheckIn} onClose={() => setShowCheckIn(false)} />

      <div className="min-h-screen p-6 pb-24">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2 pt-8">
            <h1 className="text-4xl font-bold text-foreground">SafeSpace</h1>
            <p className="text-muted-foreground">Your personal mental health companion</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Logged in as</span>
              <span className="font-medium text-foreground">{username}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
            <div className="grid gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.path}
                  onClick={() => navigate(action.path)}
                  className="flex items-start gap-4 p-5 bg-card rounded-2xl border border-border hover:shadow-lg transition-all text-left group"
                >
                  <div className={cn('p-3 rounded-xl', action.color)}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {action.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Daily Tip */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
            <h3 className="font-semibold text-foreground mb-2">💡 Daily Reminder</h3>
            <p className="text-muted-foreground">
              It's okay to not be okay. Taking time for yourself is not selfish—it's necessary. 
              Your mental health matters.
            </p>
          </div>

          {/* Privacy Note */}
          <div className="text-center text-sm text-muted-foreground">
            <Shield className="h-4 w-4 inline mr-1" />
            All your data stays on your device
          </div>
        </div>
      </div>
    </>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
