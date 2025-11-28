import { Router } from "express";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { SYSTEM_PROMPT } from "../utils/prompt.js";
import { addMessage, getMemory } from "../utils/memory.js";
import { isCrisisMessage } from "../utils/safety.js";

const router = Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CRISIS_INSTRUCTION =
  "The user may be in crisis. Respond in calm crisis mode. Encourage reaching out to a trusted person or hotline (988 in the US). Never provide instructions or steps for self-harm.";

router.post("/chat", async (req, res) => {
  try {
    const { userId, message } = req.body as {
      userId?: string;
      message?: string;
    };

    if (!userId || !message) {
      return res
        .status(400)
        .json({ error: "userId and message are required" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OpenAI API key not configured" });
    }

    const crisis = isCrisisMessage(message);
    const memory = getMemory(userId);

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(crisis ? [{ role: "system", content: CRISIS_INSTRUCTION }] : []),
      ...memory,
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.7,
      messages,
    });

    const reply =
      completion.choices[0]?.message?.content?.trim() ??
      "I'm here with you. Would you like to keep talking?";

    addMessage(userId, { role: "user", content: message });
    addMessage(userId, { role: "assistant", content: reply });

    return res.json({ reply, crisis });
  } catch (error) {
    console.error("Chat error:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again later." });
  }
});

export default router;

