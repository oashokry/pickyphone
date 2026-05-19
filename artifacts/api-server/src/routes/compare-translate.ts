import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";

const router = Router();

interface PhoneSpec {
  brand?: string;
  name?: string;
  price?: number;
  display?: unknown;
  camera?: unknown;
  performance?: unknown;
  battery?: unknown;
  storage?: unknown;
  camera_score?: number;
  performance_score?: number;
  battery_score?: number;
  displayScore?: number;
}

router.post("/compare-translate", async (req, res) => {
  const { phones } = req.body as { phones: PhoneSpec[] };

  if (!phones || !Array.isArray(phones) || phones.length < 2) {
    res.status(400).json({ error: "Need at least 2 phones to compare" });
    return;
  }

  const phoneDescriptions = phones
    .map(
      (p, i) => `
Phone ${i + 1}: ${p.brand} ${p.name} — $${p.price}
  Display: ${JSON.stringify(p.display)}
  Camera: ${JSON.stringify(p.camera)}
  Performance: ${JSON.stringify(p.performance)}
  Battery: ${JSON.stringify(p.battery)}
  Storage: ${JSON.stringify(p.storage)}
`.trim()
    )
    .join("\n\n");

  const prompt = `You are a friendly tech expert helping a regular person decide between smartphones. Below are ${phones.length} phones. Write a plain-English comparison that a non-tech person can understand. Structure your response exactly like this:

## The Quick Take
One or two sentences summarizing how these phones differ in everyday terms.

## Display — What You'll Actually See
A short paragraph comparing screens in plain language (e.g., "Phone A has a noticeably sharper screen good for watching videos, while Phone B is brighter outdoors").

## Camera — Real-World Shots
A short paragraph comparing cameras for everyday photography (selfies, pets, travel).

## Speed & Performance — Day-to-Day Feel
A short paragraph comparing how fast each phone will feel for normal tasks (apps, gaming, multitasking).

## Battery — Getting Through Your Day
A short paragraph comparing how long each phone lasts and how quickly it charges.

## Price — Is the Difference Worth It?
A short paragraph on whether the price gap between them is justified for the average buyer.

## Who Should Pick Which?
End with a clear recommendation: "If you [do X], go with [Phone A]. If you [do Y], go with [Phone B]." One sentence per phone.

Use zero technical jargon. Be honest and direct.

Phones to compare:
${phoneDescriptions}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      max_completion_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const text = completion.choices[0]?.message?.content ?? "";
    res.json({ comparison: text });
  } catch (err) {
    console.error("OpenAI compare error:", err);
    res.status(500).json({ error: "Failed to generate comparison" });
  }
});

export default router;
