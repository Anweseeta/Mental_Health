const CRISIS_KEYWORDS = [
  "suicide",
  "kill myself",
  "end my life",
  "hurt myself",
  "self harm",
  "self-harm",
  "die",
  "ending it all",
  "cannot go on",
  "want to disappear",
  "take my life"
];

export function detectCrisis(text: string): boolean {
  const normalized = text.toLowerCase();
  return CRISIS_KEYWORDS.some((keyword) => normalized.includes(keyword));
}



