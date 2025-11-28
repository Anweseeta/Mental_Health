const CRISIS_PHRASES = [
  "i want to die",
  "kill myself",
  "suicide",
  "hurt myself",
  "end my life",
  "cant go on",
  "can't go on",
  "ending it all",
  "better off dead",
  "take my life",
  "self harm",
  "self-harm",
  "die tonight",
];

export function isCrisisMessage(text: string): boolean {
  const normalized = text.toLowerCase();
  return CRISIS_PHRASES.some((phrase) => normalized.includes(phrase));
}



