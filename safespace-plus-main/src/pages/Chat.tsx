import { useState, useEffect, useRef } from 'react';
import { storage, ChatMessage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, Mic, Settings } from 'lucide-react';
import { format, isToday, isYesterday, differenceInDays } from 'date-fns';
import { generateAIResponse, detectCrisisKeywords } from '@/lib/ai-utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMessages = async () => {
      const msgs = await storage.getChatMessages();
      setMessages(msgs);
    };
    loadMessages();
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast.error('Speech recognition error');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickReplies = [
    "Tell me more",
    "I need help",
    "Try breathing",
    "I'm overwhelmed"
  ];

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    // Check for crisis keywords
    if (detectCrisisKeywords(messageText)) {
      toast.warning('Crisis detected - redirecting to crisis support');
      setTimeout(() => navigate('/crisis'), 1000);
    }

    const userMessage = await storage.addChatMessage({
      role: 'user',
      content: messageText,
    });

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Generate AI response
    try {
      const personality = storage.getAIPersonality();
      const model = storage.getAIModel();
      const chatHistory = messages.slice(-5).map(m => ({ role: m.role, content: m.content }));
      
      const aiResponse = await generateAIResponse(messageText, personality, model, chatHistory);
      
      const aiMessage = await storage.addChatMessage({
        role: 'assistant',
        content: aiResponse,
      });

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI response error:', error);
      const fallbackMessage = await storage.addChatMessage({
        role: 'assistant',
        content: "I'm here to listen. How can I support you today?",
      });
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition not available');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const formatMessageDate = (timestamp: number) => {
    const date = new Date(timestamp);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    if (differenceInDays(new Date(), date) < 7) {
      return format(date, 'EEEE');
    }
    return format(date, 'MMM d, yyyy');
  };

  const groupedMessages = messages.reduce((groups: { [key: string]: ChatMessage[] }, message) => {
    const date = formatMessageDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">AI Companion</h1>
              <p className="text-xs text-muted-foreground">
                {storage.getAIPersonality().replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Mode
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/settings')}
            title="AI Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="space-y-4">
              {/* Date divider */}
              <div className="flex items-center justify-center">
                <span className="bg-secondary text-secondary-foreground text-xs px-3 py-1 rounded-full">
                  {date}
                </span>
              </div>

              {/* Messages for this date */}
              {dateMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 animate-fade-in ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="bg-primary/10 p-2 rounded-full h-10 w-10 flex-shrink-0">
                      <Bot className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs opacity-60 mt-1 block">
                      {format(message.timestamp, 'HH:mm')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3 animate-fade-in">
              <div className="bg-primary/10 p-2 rounded-full h-10 w-10 flex-shrink-0">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div className="bg-card border border-border rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-typing" style={{ animationDelay: '0s' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-typing" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-typing" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Replies */}
      <div className="border-t border-border bg-card p-2">
        <div className="max-w-2xl mx-auto flex gap-2 overflow-x-auto pb-2">
          {quickReplies.map((reply) => (
            <Button
              key={reply}
              variant="secondary"
              size="sm"
              onClick={() => handleSend(reply)}
              className="whitespace-nowrap"
            >
              {reply}
            </Button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card p-4">
        <div className="max-w-2xl mx-auto flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleVoiceInput}
            className={isListening ? 'bg-primary text-primary-foreground' : ''}
            title="Voice input"
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Share what's on your mind..."
            className="flex-1"
          />
          <Button onClick={() => handleSend()} size="icon" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
