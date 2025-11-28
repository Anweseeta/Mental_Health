import { LRUCache } from "lru-cache";
import type { PersonalityId } from "./personalities";

const cache = new LRUCache<string, string>({
  max: 200,
  ttl: 1000 * 60 * 5,
});

export function buildCacheKey(
  userId: string,
  personality: PersonalityId,
  message: string
): string {
  return `${userId}::${personality}::${message.trim()}`;
}

export function getCachedResponse(key: string): string | undefined {
  return cache.get(key);
}

export function setCachedResponse(key: string, value: string): void {
  cache.set(key, value);
}

