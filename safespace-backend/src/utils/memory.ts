export type ChatRole = "user" | "assistant";

export interface MemoryMessage {
  role: ChatRole;
  content: string;
}

const MAX_MEMORY = 12;
const memoryStore = new Map<string, MemoryMessage[]>();

export function addMessage(userId: string, message: MemoryMessage): void {
  const existing = memoryStore.get(userId) ?? [];
  const updated = [...existing, message];
  memoryStore.set(userId, updated.slice(-MAX_MEMORY));
}

export function getMemory(userId: string): MemoryMessage[] {
  return memoryStore.get(userId) ?? [];
}

export function clearMemory(userId: string): void {
  memoryStore.delete(userId);
}



