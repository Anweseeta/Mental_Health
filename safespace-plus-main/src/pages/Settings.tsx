import { useState, useEffect } from 'react';
import { storage, AIModel, AIPersonality } from '@/lib/storage';
import { generateUsername } from '@/lib/username';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Trash2, Users, RefreshCw, Bot, Palette, Trophy } from 'lucide-react';
import { toast } from 'sonner';

const themes = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'sunset', label: 'Sunset' },
  { value: 'lavender', label: 'Lavender' },
  { value: 'ocean', label: 'Ocean' },
  { value: 'minimal-black', label: 'Minimal Black' },
];

const aiModels: { value: AIModel; label: string }[] = [
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
  { value: 'claude-haiku', label: 'Claude Haiku' },
  { value: 'claude-sonnet', label: 'Claude Sonnet' },
  { value: 'llama', label: 'Llama' },
];

const personalities: { value: AIPersonality; label: string; description: string }[] = [
  { value: 'calm-listener', label: 'Calm Listener', description: 'Gentle, empathetic support' },
  { value: 'motivation-coach', label: 'Motivation Coach', description: 'Encouraging and goal-oriented' },
  { value: 'cbt-therapist', label: 'CBT Therapist Style', description: 'Evidence-based therapeutic approach' },
  { value: 'journal-helper', label: 'Journal Helper', description: 'Guides reflection and self-discovery' },
  { value: 'crisis-safety', label: 'Crisis Safety Mode', description: 'Prioritizes safety and stabilization' },
];

export default function Settings() {
  const [username, setUsername] = useState('');
  const [privacyMode, setPrivacyMode] = useState(false);
  const [aiModel, setAiModel] = useState<AIModel>('gpt-4o-mini');
  const [aiPersonality, setAiPersonality] = useState<AIPersonality>('calm-listener');
  const [theme, setTheme] = useState('light');
  const navigate = useNavigate();

  useEffect(() => {
    setUsername(storage.getUsername() || '');
    setPrivacyMode(storage.getPrivacyMode());
    setAiModel(storage.getAIModel());
    setAiPersonality(storage.getAIPersonality());
    setTheme(storage.getTheme());
    applyTheme(storage.getTheme());
  }, []);

  const applyTheme = (themeName: string) => {
    document.documentElement.className = '';
    if (themeName !== 'light') {
      document.documentElement.classList.add(`theme-${themeName}`);
    }
  };

  const handleRegenerateUsername = () => {
    const newUsername = generateUsername();
    storage.setUsername(newUsername);
    setUsername(newUsername);
    toast.success('Username regenerated!');
  };

  const handlePrivacyToggle = (enabled: boolean) => {
    setPrivacyMode(enabled);
    storage.setPrivacyMode(enabled);
    if (enabled) {
      toast.success('Privacy mode enabled - Chat will auto-delete on close');
    } else {
      toast.success('Privacy mode disabled');
    }
  };

  const handleClearChat = async () => {
    if (confirm('Are you sure you want to clear all chat messages?')) {
      await storage.clearChatMessages();
      toast.success('Chat history cleared');
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    storage.setTheme(newTheme);
    applyTheme(newTheme);
    toast.success('Theme updated');
  };

  const handleAIModelChange = (model: AIModel) => {
    setAiModel(model);
    storage.setAIModel(model);
    toast.success('AI model updated');
  };

  const handlePersonalityChange = (personality: AIPersonality) => {
    setAiPersonality(personality);
    storage.setAIPersonality(personality);
    toast.success('AI personality updated');
  };

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2 pt-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your SafeSpace preferences</p>
        </div>

        {/* Account */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Account</h2>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Your Username</label>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 p-3 bg-secondary rounded-lg">
                  <p className="font-medium text-foreground">{username}</p>
                </div>
                <Button variant="outline" size="icon" onClick={handleRegenerateUsername}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Anonymous username - no email or password needed
              </p>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Privacy</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
              <div className="flex-1">
                <p className="font-medium text-foreground">Privacy Mode</p>
                <p className="text-sm text-muted-foreground">
                  Auto-delete chat history when you close the app
                </p>
              </div>
              <Switch checked={privacyMode} onCheckedChange={handlePrivacyToggle} />
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
              <div className="flex-1">
                <p className="font-medium text-foreground">End-to-End Encryption</p>
                <p className="text-sm text-muted-foreground">
                  All data stored locally with encryption (UI only)
                </p>
              </div>
              <Switch checked={true} disabled />
            </div>

            <Button
              variant="destructive"
              className="w-full"
              onClick={handleClearChat}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Chat History
            </Button>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
            <p className="text-sm text-foreground">
              <Shield className="h-4 w-4 inline mr-1" />
              All your data stays on your device. We never collect, store, or share your personal information.
            </p>
          </div>
        </div>

        {/* AI Settings */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">AI Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                AI Model
              </label>
              <Select value={aiModel} onValueChange={handleAIModelChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {aiModels.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                AI Personality
              </label>
              <Select value={aiPersonality} onValueChange={handlePersonalityChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {personalities.map((personality) => (
                    <SelectItem key={personality.value} value={personality.value}>
                      <div>
                        <div className="font-medium">{personality.label}</div>
                        <div className="text-xs text-muted-foreground">{personality.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Appearance</h2>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Theme
            </label>
            <Select value={theme} onValueChange={handleThemeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Achievements</h2>
          </div>
          
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => navigate('/achievements')}
          >
            <Trophy className="mr-2 h-4 w-4" />
            View Achievements
          </Button>
          <p className="text-sm text-muted-foreground">
            See your progress and unlocked milestones
          </p>
        </div>

        {/* Trusted Contacts */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Support Network</h2>
          </div>
          
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => navigate('/trusted-contacts')}
          >
            <Users className="mr-2 h-4 w-4" />
            Manage Trusted Contacts
          </Button>
          <p className="text-sm text-muted-foreground">
            Add people you trust to reach out to when you need support
          </p>
        </div>
      </div>
    </div>
  );
}
