type ChatRole = "user" | "assistant";

export interface MemoryMessage {
  role: ChatRole;
  content: string;
}

const MEMORY_LIMIT = 12;
const memoryStore = new Map<string, MemoryMessage[]>();

export function addMessage(userId: string, message: MemoryMessage): void {
  const existing = memoryStore.get(userId) ?? [];
  const updated = [...existing, message];
  const trimmed = updated.slice(-MEMORY_LIMIT);
  memoryStore.set(userId, trimmed);
}

export function getMemory(userId: string): MemoryMessage[] {
  return memoryStore.get(userId) ?? [];
}



