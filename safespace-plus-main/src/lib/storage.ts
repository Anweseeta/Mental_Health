// Storage utilities for SafeSpace with IndexedDB and encryption support

import { dbGetAll, dbPut, dbDelete, dbClear, dbGet, isIndexedDBAvailable } from './indexeddb';
import { encryptData, decryptData } from './encryption';

export interface JournalEntry {
  id: string;
  type: 'gratitude' | 'free';
  content: string;
  timestamp: number;
  emotions?: string[];
  themes?: string[];
  aiInsights?: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  contactInfo: string;
  phone?: string;
  email?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface MoodEntry {
  id: string;
  mood: 'happy' | 'neutral' | 'sad' | 'worried' | 'stressed';
  timestamp: number;
  note?: string;
}

export interface DailyCheckIn {
  id: string;
  mood: MoodEntry['mood'];
  timestamp: number;
  note?: string;
}

export interface CBTEntry {
  id: string;
  type: 'reframing' | 'worry' | 'teb' | 'coping';
  content: any;
  timestamp: number;
}

export interface Achievement {
  id: string;
  type: string;
  unlockedAt: number;
  title: string;
  description: string;
}

export type AIModel = 'gpt-4o' | 'gpt-4o-mini' | 'claude-haiku' | 'claude-sonnet' | 'llama';
export type AIPersonality = 'calm-listener' | 'motivation-coach' | 'cbt-therapist' | 'journal-helper' | 'crisis-safety';

// Helper to use IndexedDB with fallback to localStorage
async function getFromStore<T>(storeName: string, fallbackKey: string): Promise<T[]> {
  if (isIndexedDBAvailable()) {
    try {
      return await dbGetAll<T>(storeName);
    } catch (error) {
      console.warn('IndexedDB error, falling back to localStorage:', error);
    }
  }
  
  const data = localStorage.getItem(fallbackKey);
  return data ? JSON.parse(data) : [];
}

async function saveToStore<T>(storeName: string, fallbackKey: string, items: T[]): Promise<void> {
  if (isIndexedDBAvailable()) {
    try {
      // Clear and repopulate
      await dbClear(storeName);
      for (const item of items) {
        await dbPut(storeName, item);
      }
      return;
    } catch (error) {
      console.warn('IndexedDB error, falling back to localStorage:', error);
    }
  }
  
  localStorage.setItem(fallbackKey, JSON.stringify(items));
}

async function addToStore<T extends { id: string }>(storeName: string, fallbackKey: string, item: T): Promise<T> {
  if (isIndexedDBAvailable()) {
    try {
      await dbPut(storeName, item);
      return item;
    } catch (error) {
      console.warn('IndexedDB error, falling back to localStorage:', error);
    }
  }
  
  const items = await getFromStore<T>(storeName, fallbackKey);
  items.push(item);
  localStorage.setItem(fallbackKey, JSON.stringify(items));
  return item;
}

export const storage = {
  // Username
  getUsername: (): string | null => {
    return localStorage.getItem('safespace_username');
  },
  setUsername: (username: string) => {
    localStorage.setItem('safespace_username', username);
  },

  // Journal entries
  getJournalEntries: async (): Promise<JournalEntry[]> => {
    return await getFromStore<JournalEntry>('journals', 'safespace_journal');
  },
  addJournalEntry: async (entry: Omit<JournalEntry, 'id' | 'timestamp'>): Promise<JournalEntry> => {
    const newEntry: JournalEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    return await addToStore('journals', 'safespace_journal', newEntry);
  },

  // Trusted contacts
  getTrustedContacts: async (): Promise<TrustedContact[]> => {
    return await getFromStore<TrustedContact>('contacts', 'safespace_contacts');
  },
  addTrustedContact: async (contact: Omit<TrustedContact, 'id'>): Promise<TrustedContact> => {
    const newContact: TrustedContact = {
      ...contact,
      id: Date.now().toString(),
    };
    return await addToStore('contacts', 'safespace_contacts', newContact);
  },
  updateTrustedContact: async (id: string, updates: Partial<TrustedContact>): Promise<void> => {
    const contacts = await storage.getTrustedContacts();
    const index = contacts.findIndex(c => c.id === id);
    if (index !== -1) {
      contacts[index] = { ...contacts[index], ...updates };
      await saveToStore('contacts', 'safespace_contacts', contacts);
    }
  },
  deleteTrustedContact: async (id: string): Promise<void> => {
    if (isIndexedDBAvailable()) {
      try {
        await dbDelete('contacts', id);
        return;
      } catch (error) {
        console.warn('IndexedDB error, falling back to localStorage:', error);
      }
    }
    const contacts = await storage.getTrustedContacts();
    const filtered = contacts.filter(c => c.id !== id);
    localStorage.setItem('safespace_contacts', JSON.stringify(filtered));
  },

  // Chat messages
  getChatMessages: async (): Promise<ChatMessage[]> => {
    return await getFromStore<ChatMessage>('chat', 'safespace_chat');
  },
  addChatMessage: async (message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    return await addToStore('chat', 'safespace_chat', newMessage);
  },
  clearChatMessages: async (): Promise<void> => {
    if (isIndexedDBAvailable()) {
      try {
        await dbClear('chat');
        return;
      } catch (error) {
        console.warn('IndexedDB error, falling back to localStorage:', error);
      }
    }
    localStorage.removeItem('safespace_chat');
  },

  // Mood entries
  getMoodEntries: async (): Promise<MoodEntry[]> => {
    return await getFromStore<MoodEntry>('moods', 'safespace_moods');
  },
  addMoodEntry: async (mood: MoodEntry['mood'], note?: string): Promise<MoodEntry> => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood,
      timestamp: Date.now(),
      note,
    };
    return await addToStore('moods', 'safespace_moods', newEntry);
  },

  // Daily check-ins
  getDailyCheckIns: async (): Promise<DailyCheckIn[]> => {
    return await getFromStore<DailyCheckIn>('checkins', 'safespace_checkins');
  },
  addDailyCheckIn: async (checkIn: Omit<DailyCheckIn, 'id' | 'timestamp'>): Promise<DailyCheckIn> => {
    const newCheckIn: DailyCheckIn = {
      ...checkIn,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    return await addToStore('checkins', 'safespace_checkins', newCheckIn);
  },
  hasCheckedInToday: async (): Promise<boolean> => {
    const checkIns = await storage.getDailyCheckIns();
    const today = new Date().setHours(0, 0, 0, 0);
    return checkIns.some(ci => new Date(ci.timestamp).setHours(0, 0, 0, 0) === today);
  },

  // CBT entries
  getCBTEntries: async (): Promise<CBTEntry[]> => {
    return await getFromStore<CBTEntry>('cbtEntries', 'safespace_cbt');
  },
  addCBTEntry: async (entry: Omit<CBTEntry, 'id' | 'timestamp'>): Promise<CBTEntry> => {
    const newEntry: CBTEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    return await addToStore('cbtEntries', 'safespace_cbt', newEntry);
  },

  // Achievements
  getAchievements: async (): Promise<Achievement[]> => {
    return await getFromStore<Achievement>('achievements', 'safespace_achievements');
  },
  addAchievement: async (achievement: Omit<Achievement, 'id' | 'unlockedAt'>): Promise<Achievement> => {
    const newAchievement: Achievement = {
      ...achievement,
      id: Date.now().toString(),
      unlockedAt: Date.now(),
    };
    return await addToStore('achievements', 'safespace_achievements', newAchievement);
  },
  checkAchievements: async (type: string, count: number): Promise<Achievement[]> => {
    const existing = await storage.getAchievements();
    const newAchievements: Achievement[] = [];
    
    // Define achievement thresholds
    const thresholds: Record<string, { count: number; title: string; description: string }[]> = {
      journal: [
        { count: 1, title: 'First Entry', description: 'Wrote your first journal entry' },
        { count: 7, title: 'Weekly Writer', description: 'Journaled for 7 days' },
        { count: 30, title: 'Monthly Reflection', description: 'Journaled for 30 days' },
      ],
      mood: [
        { count: 1, title: 'Mood Tracker', description: 'Tracked your first mood' },
        { count: 7, title: 'Week of Awareness', description: 'Tracked mood for 7 days' },
        { count: 30, title: 'Emotional Intelligence', description: 'Tracked mood for 30 days' },
      ],
      breathing: [
        { count: 1, title: 'First Breath', description: 'Completed first breathing exercise' },
        { count: 10, title: 'Breathing Master', description: 'Completed 10 breathing sessions' },
        { count: 50, title: 'Zen Master', description: 'Completed 50 breathing sessions' },
      ],
    };

    const typeThresholds = thresholds[type] || [];
    for (const threshold of typeThresholds) {
      if (count >= threshold.count && !existing.find(a => a.type === type && a.title === threshold.title)) {
        const achievement = await storage.addAchievement({
          type,
          title: threshold.title,
          description: threshold.description,
        });
        newAchievements.push(achievement);
      }
    }

    return newAchievements;
  },

  // AI Settings
  getAIModel: (): AIModel => {
    return (localStorage.getItem('safespace_ai_model') as AIModel) || 'gpt-4o-mini';
  },
  setAIModel: (model: AIModel) => {
    localStorage.setItem('safespace_ai_model', model);
  },
  getAIPersonality: (): AIPersonality => {
    return (localStorage.getItem('safespace_ai_personality') as AIPersonality) || 'calm-listener';
  },
  setAIPersonality: (personality: AIPersonality) => {
    localStorage.setItem('safespace_ai_personality', personality);
  },

  // Theme
  getTheme: (): string => {
    return localStorage.getItem('safespace_theme') || 'light';
  },
  setTheme: (theme: string) => {
    localStorage.setItem('safespace_theme', theme);
  },

  // Privacy settings
  getPrivacyMode: (): boolean => {
    return localStorage.getItem('safespace_privacy_mode') === 'true';
  },
  setPrivacyMode: (enabled: boolean) => {
    localStorage.setItem('safespace_privacy_mode', enabled.toString());
  },
};
