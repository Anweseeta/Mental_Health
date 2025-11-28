import { Router } from "express";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { SAFE_SPACE_PROMPT, CRISIS_ADDITIONAL_PROMPT } from "../utils/prompt";
import { detectCrisis } from "../utils/safety";
import { addMessage, getMemory } from "../utils/memory";

const router = Router();

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key not configured");
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

router.post("/chat", async (req, res) => {
  const { userId, message } = req.body as {
    userId?: string;
    message?: string;
  };

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "Missing userId" });
  }

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Missing message" });
  }

  try {
    const client = getOpenAIClient();
    const crisisDetected = detectCrisis(message);
    const memory = getMemory(userId);

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: SAFE_SPACE_PROMPT },
    ];

    if (crisisDetected) {
      messages.push({ role: "system", content: CRISIS_ADDITIONAL_PROMPT });
    }

    memory.forEach((msg) =>
      messages.push({ role: msg.role, content: msg.content })
    );
    messages.push({ role: "user", content: message });

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: crisisDetected ? 0.7 : 0.9,
    });

    const reply =
      completion.choices[0]?.message?.content?.trim() ??
      "I'm here with you. Can you share a bit more about how you're feeling?";

    addMessage(userId, { role: "user", content: message });
    addMessage(userId, { role: "assistant", content: reply });

    return res.json({ reply, crisis: crisisDetected });
  } catch (error) {
    console.error("SafeSpace chat error:", error);
    return res.status(500).json({ error: "Unable to generate response" });
  }
});

export default router;

