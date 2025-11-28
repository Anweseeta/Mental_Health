const CRISIS_KEYWORDS = [
  "kill myself",
  "hurt myself",
  "suicide",
  "self harm",
  "end it all",
  "i want to die",
  "can't go on",
  "ending my life",
  "take my life",
  "die by suicide",
  "no reason to live",
];

export function isCrisisMessage(message: string): boolean {
  const normalized = message.toLowerCase();
  return CRISIS_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

