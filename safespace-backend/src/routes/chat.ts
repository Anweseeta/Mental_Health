import type { Request, Response } from "express";
import { Router } from "express";
import fetch from "node-fetch";
import { SAFE_SPACE_BASE_PROMPT } from "../utils/promptBase";
import {
  PERSONALITIES,
  PersonalityId,
  resolvePersonality,
} from "../utils/personalities";
import { isCrisisMessage } from "../utils/safety";
import { addMessage, getMemory } from "../utils/memory";
import {
  buildCacheKey,
  getCachedResponse,
  setCachedResponse,
} from "../utils/cache";

const router = Router();

type OpenAIMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

function writeSSE(
  res: Response,
  event: "chunk" | "done" | "error",
  data: unknown
): void {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

router.get("/chat/stream", async (req: Request, res: Response) => {
  const userId =
    typeof req.query.userId === "string" ? req.query.userId.trim() : "";
  const message =
    typeof req.query.message === "string" ? req.query.message.trim() : "";
  const requestedPersonality =
    typeof req.query.personality === "string" ? req.query.personality : "";

  if (!userId || !message) {
    return res.status(400).json({ error: "Missing userId or message" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENAI_API_KEY not configured" });
  }

  const apiBase =
    process.env.OPENAI_API_BASE?.trim() || "https://api.openai.com/v1";

  let personality: PersonalityId = resolvePersonality(requestedPersonality);
  const crisisDetected = isCrisisMessage(message);
  if (crisisDetected) {
    personality = "crisis_mode";
  }

  const cacheKey = buildCacheKey(userId, personality, message);

  const initSSE = () => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();
  };

  const cached = getCachedResponse(cacheKey);
  if (cached) {
    initSSE();
    writeSSE(res, "chunk", cached);
    writeSSE(res, "done", { cached: true, crisis: crisisDetected });
    return res.end();
  }

  initSSE();

  const controller = new AbortController();
  req.on("close", () => {
    controller.abort();
    if (!res.writableEnded) {
      res.end();
    }
  });

  const memory = getMemory(userId);
  const messages: OpenAIMessage[] = [
    { role: "system", content: SAFE_SPACE_BASE_PROMPT },
    { role: "system", content: PERSONALITIES[personality] },
    ...memory,
    { role: "user", content: message },
  ];

  try {
    const response = await fetch(`${apiBase}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        stream: true,
        temperature: crisisDetected ? 0.7 : 0.9,
        messages,
      }),
      signal: controller.signal,
    });

    if (!response.ok || !response.body) {
      const errText = await response.text().catch(() => "Unknown error");
      throw new Error(`OpenAI request failed: ${errText}`);
    }

    const stream = response.body as unknown as ReadableStream<Uint8Array>;
    const reader = stream.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let fullReply = "";
    let finished = false;

    while (!finished) {
      const { value, done } = await reader.read();
      if (done) {
        finished = true;
        break;
      }
      buffer += decoder.decode(value, { stream: true });

      let boundary = buffer.indexOf("\n\n");
      while (boundary !== -1) {
        const segment = buffer.slice(0, boundary).trim();
        buffer = buffer.slice(boundary + 2);

        if (segment.startsWith("data:")) {
          const data = segment.replace(/^data:\s*/, "");
          if (data === "[DONE]") {
            finished = true;
            break;
          }

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            let textChunk = "";
            if (typeof delta === "string") {
              textChunk = delta;
            } else if (Array.isArray(delta)) {
              textChunk = delta.join("");
            }

            if (textChunk) {
              fullReply += textChunk;
              writeSSE(res, "chunk", textChunk);
            }
          } catch {
            // ignore malformed chunks
          }
        }

        boundary = buffer.indexOf("\n\n");
      }
    }

    if (!fullReply.trim()) {
      fullReply = "I'm here with you. Would you like to share a bit more?";
      writeSSE(res, "chunk", fullReply);
    }

    addMessage(userId, { role: "user", content: message });
    addMessage(userId, { role: "assistant", content: fullReply });
    setCachedResponse(cacheKey, fullReply);

    writeSSE(res, "done", { crisis: crisisDetected, personality });
    res.end();
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Unexpected streaming error";
    if (!res.writableEnded) {
      writeSSE(res, "error", msg);
      res.end();
    }
  }
});

export default router;

