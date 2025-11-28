// Anonymous username generator

const adjectives = [
  'Calm', 'Peaceful', 'Gentle', 'Brave', 'Kind',
  'Bright', 'Quiet', 'Strong', 'Wise', 'Safe',
  'Serene', 'Hopeful', 'Patient', 'Mindful', 'Clear',
];

const nouns = [
  'Spirit', 'Soul', 'Heart', 'Mind', 'Light',
  'Voice', 'Path', 'Journey', 'Friend', 'Guide',
  'Breeze', 'Star', 'River', 'Mountain', 'Sky',
];

export function generateUsername(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 9999);
  return `${adjective}${noun}${number}`;
}
