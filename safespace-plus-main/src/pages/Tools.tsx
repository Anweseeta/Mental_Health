import { useNavigate } from 'react-router-dom';
import { Wind, Anchor, Sparkles, BookOpen, Mic, Brain, AlertCircle, ArrowRight, Heart } from 'lucide-react';

export default function Tools() {
  const navigate = useNavigate();

  const tools = [
    {
      icon: Wind,
      title: 'Breathing Exercise',
      description: 'Calm your mind with guided breathing',
      path: '/tools/breathing',
      color: 'bg-blue-500',
      category: 'mindfulness',
    },
    {
      icon: Anchor,
      title: 'Grounding Exercise',
      description: 'Connect with the present moment',
      path: '/tools/grounding',
      color: 'bg-teal-500',
      category: 'mindfulness',
    },
    {
      icon: Sparkles,
      title: 'Gratitude Journal',
      description: 'Write what you are thankful for',
      path: '/tools/gratitude',
      color: 'bg-yellow-500',
      category: 'journaling',
    },
    {
      icon: BookOpen,
      title: 'Free Journal',
      description: 'Express your thoughts freely',
      path: '/tools/journal',
      color: 'bg-purple-500',
      category: 'journaling',
    },
    {
      icon: Mic,
      title: 'Voice Vent Mode',
      description: 'Speak your feelings out loud',
      path: '/tools/voice-vent',
      color: 'bg-pink-500',
      category: 'journaling',
    },
  ];

  const cbtTools = [
    {
      icon: Brain,
      title: 'Thought Reframing',
      description: 'Challenge negative thoughts and find balanced perspectives',
      path: '/tools/thought-reframing',
      color: 'bg-indigo-500',
    },
    {
      icon: AlertCircle,
      title: 'Worry Journal',
      description: 'Process worries and focus on what you can control',
      path: '/tools/worry-journal',
      color: 'bg-orange-500',
    },
    {
      icon: ArrowRight,
      title: 'TEB Analyzer',
      description: 'Understand Thoughts → Emotions → Behaviors connections',
      path: '/tools/teb-analyzer',
      color: 'bg-purple-500',
    },
    {
      icon: Heart,
      title: 'Coping Strategies',
      description: 'Generate personalized coping strategies',
      path: '/tools/coping-strategies',
      color: 'bg-rose-500',
    },
  ];

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2 pt-8">
          <h1 className="text-3xl font-bold text-foreground">Mental Health Tools</h1>
          <p className="text-muted-foreground">Choose a tool to help you feel better</p>
        </div>

        {/* CBT Tools Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">CBT Tools</h2>
          </div>
          <div className="grid gap-4">
            {cbtTools.map((tool) => (
              <button
                key={tool.path}
                onClick={() => navigate(tool.path)}
                className="flex items-start gap-4 p-5 bg-card rounded-2xl border border-border hover:shadow-lg transition-all text-left group"
              >
                <div className={`p-3 rounded-xl ${tool.color}`}>
                  <tool.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Other Tools Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Mindfulness & Journaling</h2>
          <div className="grid gap-4">
            {tools.map((tool) => (
              <button
                key={tool.path}
                onClick={() => navigate(tool.path)}
                className="flex items-start gap-4 p-5 bg-card rounded-2xl border border-border hover:shadow-lg transition-all text-left group"
              >
                <div className={`p-3 rounded-xl ${tool.color}`}>
                  <tool.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
