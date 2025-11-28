import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const MAX_MESSAGES = 12;
const memoryStore = new Map<string, ChatCompletionMessageParam[]>();

export function addMessage(
  userId: string,
  message: ChatCompletionMessageParam
): void {
  const existing = memoryStore.get(userId) ?? [];
  const updated = [...existing, message];

  // Keep only the last MAX_MESSAGES items
  const trimmed =
    updated.length > MAX_MESSAGES
      ? updated.slice(updated.length - MAX_MESSAGES)
      : updated;

  memoryStore.set(userId, trimmed);
}

export function getMemory(
  userId: string
): ChatCompletionMessageParam[] {
  return memoryStore.get(userId)?.slice() ?? [];
}

export function clearMemory(userId: string): void {
  memoryStore.delete(userId);
}

