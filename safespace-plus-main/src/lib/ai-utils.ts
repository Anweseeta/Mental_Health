// AI utilities for SafeSpace - personality modes and insights

import { AIPersonality, AIModel } from './storage';

// Personality mode prompts based on SafeSpace AI guidelines
export const personalityPrompts: Record<AIPersonality, string> = {
  'calm-listener': `You are SafeSpace AI, a gentle, supportive mental health companion. Your goals: Listen without judgment. Validate feelings. Respond with warmth, empathy, and simplicity. Use short sentences, simple language. Ask gentle follow-up questions. Use validating statements like "It makes sense you feel this way." Reflect their emotion: "It sounds like you're overwhelmed." Offer options: grounding, breathing, journaling, talking more. Never diagnose, never judge, never dismiss. Your role is emotional support, not therapy.`,
  
  'motivation-coach': `You are SafeSpace AI in Motivation Coach mode. You encourage positive action, help set goals, and provide gentle motivation. Be uplifting but realistic, focusing on progress and self-compassion. Validate feelings first: "It makes sense you feel this way." Then offer gentle encouragement. Use warm, human-like language. Short sentences. Never force or pressure. Encourage healthy coping skills.`,
  
  'cbt-therapist': `You are SafeSpace AI in CBT Therapist Style mode. Help identify thought patterns and guide users through evidence-based techniques. Use validating statements: "It makes sense you feel this way." Reflect emotions: "It sounds like you're feeling [emotion]." Ask gentle questions to explore thoughts. Never diagnose mental health disorders. Never tell users what decisions to make. Your role is emotional support, not therapy. Keep it warm, simple, and non-judgmental.`,
  
  'journal-helper': `You are SafeSpace AI in Journal Helper mode. Help users reflect on their experiences through writing. Ask thoughtful, gentle questions. Be curious and supportive. Validate their feelings: "It makes sense you feel this way." Reflect what you hear: "It sounds like..." Encourage but don't force. Use warm, simple language. Short sentences. Never judge or dismiss their experiences.`,
  
  'crisis-safety': `You are SafeSpace AI in Crisis Safety Mode. CRITICAL RULES: Stay calm and supportive. NEVER say "I understand exactly what you feel." NEVER give instructions on suicide or self-harm. Encourage reaching out to a trusted person. Suggest contacting a hotline (988). Validate: "It makes sense you're feeling this way." De-escalate emotional distress. Offer immediate support: grounding, breathing. Keep responses warm, short, simple. Prioritize safety. Guide toward professional help gently.`,
};

// Get system prompt for personality
export function getSystemPrompt(personality: AIPersonality): string {
  return personalityPrompts[personality];
}

// Detect self-harm keywords
export const crisisKeywords = [
  'suicide', 'kill myself', 'end it all', 'want to die', 'not worth living',
  'self harm', 'cutting', 'hurt myself', 'give up', 'no point',
  'better off without me', 'burden', 'hopeless', 'nothing matters',
];

export function detectCrisisKeywords(text: string): boolean {
  const lowerText = text.toLowerCase();
  return crisisKeywords.some(keyword => lowerText.includes(keyword));
}

// Emotion detection from journal text (simplified)
export function detectEmotions(text: string): string[] {
  const emotions: string[] = [];
  const lowerText = text.toLowerCase();

  const emotionPatterns: Record<string, string[]> = {
    'sad': ['sad', 'depressed', 'down', 'melancholy', 'unhappy', 'blue', 'gloomy'],
    'anxious': ['anxious', 'worried', 'nervous', 'stressed', 'panic', 'fear', 'afraid'],
    'angry': ['angry', 'mad', 'furious', 'irritated', 'frustrated', 'annoyed'],
    'happy': ['happy', 'joy', 'excited', 'elated', 'grateful', 'content', 'peaceful'],
    'lonely': ['lonely', 'isolated', 'alone', 'empty', 'disconnected'],
    'overwhelmed': ['overwhelmed', 'too much', 'can\'t handle', 'drowning', 'exhausted'],
  };

  for (const [emotion, patterns] of Object.entries(emotionPatterns)) {
    if (patterns.some(pattern => lowerText.includes(pattern))) {
      emotions.push(emotion);
    }
  }

  return emotions.length > 0 ? emotions : ['neutral'];
}

// Extract key themes from journal text
export function extractThemes(text: string): string[] {
  const themes: string[] = [];
  const lowerText = text.toLowerCase();

  const themePatterns: Record<string, string[]> = {
    'work': ['work', 'job', 'career', 'boss', 'colleague', 'office', 'meeting'],
    'relationships': ['friend', 'family', 'partner', 'relationship', 'love', 'breakup', 'conflict'],
    'health': ['health', 'sick', 'pain', 'doctor', 'medical', 'illness', 'symptoms'],
    'finances': ['money', 'financial', 'bills', 'debt', 'expenses', 'income'],
    'self-care': ['exercise', 'sleep', 'rest', 'self-care', 'wellness', 'meditation'],
    'future': ['future', 'goals', 'plans', 'dreams', 'aspirations', 'hope'],
  };

  for (const [theme, patterns] of Object.entries(themePatterns)) {
    if (patterns.some(pattern => lowerText.includes(pattern))) {
      themes.push(theme);
    }
  }

  return themes;
}

// Generate coping suggestions based on emotions and themes
export function generateCopingSuggestions(emotions: string[], themes: string[]): string[] {
  const suggestions: string[] = [];

  if (emotions.includes('anxious') || emotions.includes('overwhelmed')) {
    suggestions.push('Try a breathing exercise to calm your nervous system');
    suggestions.push('Practice the 5-4-3-2-1 grounding technique');
  }

  if (emotions.includes('sad') || emotions.includes('lonely')) {
    suggestions.push('Reach out to a trusted friend or family member');
    suggestions.push('Write about what you\'re grateful for today');
  }

  if (emotions.includes('angry')) {
    suggestions.push('Take a walk or engage in physical activity');
    suggestions.push('Try journaling to process your feelings');
  }

  if (themes.includes('work')) {
    suggestions.push('Set boundaries between work and personal time');
    suggestions.push('Break tasks into smaller, manageable steps');
  }

  if (themes.includes('relationships')) {
    suggestions.push('Consider having an open conversation with the person involved');
    suggestions.push('Practice self-compassion - relationships can be complex');
  }

  if (suggestions.length === 0) {
    suggestions.push('Take a moment to breathe deeply');
    suggestions.push('Consider what self-care activity would help right now');
  }

  return suggestions.slice(0, 3); // Return top 3 suggestions
}

// Generate AI response based on personality and context
export async function generateAIResponse(
  userMessage: string,
  personality: AIPersonality,
  model: AIModel,
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  // Check for crisis keywords first - switch to crisis safety mode
  if (detectCrisisKeywords(userMessage)) {
    return `I'm concerned about what you've shared. Your safety matters. It makes sense you're feeling this way right now. Would you like to reach out to a trusted person, or contact the 988 crisis hotline? I'm here with you. What would help you feel safer right now?`;
  }

  // Simulate AI response based on personality
  // In a real implementation, this would call an actual AI API
  const systemPrompt = getSystemPrompt(personality);
  
  // Simulated responses based on personality (following SafeSpace AI guidelines)
  const responses: Record<AIPersonality, string[]> = {
    'calm-listener': [
      "It makes sense you feel this way. I'm here to listen. What's on your mind?",
      "It sounds like you're going through something difficult. Your feelings are valid. Would you like to talk more about it?",
      "Thank you for sharing that with me. I hear you. How can I support you right now?",
      "It sounds like you're feeling overwhelmed. That's understandable. What would help you feel a little better?",
    ],
    'motivation-coach': [
      "It makes sense you're feeling this way. You're showing up for yourself, and that matters. What's one small thing that might help?",
      "I hear you. Progress isn't always easy. What's one step you could take today, even if it's small?",
      "It sounds like you're facing a challenge. That's hard. What would make today feel a little better?",
      "Your feelings are valid. What's something you can do right now to take care of yourself?",
    ],
    'cbt-therapist': [
      "It makes sense you feel this way. Can you tell me more about the thought that's bothering you?",
      "It sounds like you're experiencing some difficult thoughts. What comes up when you think about this?",
      "I hear you. Sometimes looking at our thoughts from a different angle helps. What would a friend say about this?",
      "It makes sense this is hard. What evidence supports this thought? What might contradict it?",
    ],
    'journal-helper': [
      "That's an important reflection. What emotions come up when you think about this?",
      "I'm curious - what does this experience mean to you?",
      "Thank you for sharing. What would you like to explore more?",
      "It sounds like this matters to you. What do you notice when you reflect on it?",
    ],
    'crisis-safety': [
      "I'm concerned about you. Your safety matters. Would you like to reach out to someone you trust, or call 988?",
      "It makes sense you're feeling this way. You're not alone. Can you reach out to someone safe right now?",
      "I'm here with you. Your safety is important. Would it help to try some breathing, or connect with a crisis hotline?",
      "I hear you. This is really hard. What would help you feel safer right now?",
    ],
  };

  const personalityResponses = responses[personality];
  return personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
}

