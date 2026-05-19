import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";

const router = Router();

router.post("/translate-specs", async (req, res) => {
  const { phone } = req.body as { phone: Record<string, unknown> };

  if (!phone) {
    res.status(400).json({ error: "Missing phone data" });
    return;
  }

  const prompt = `You are a friendly tech expert explaining a smartphone to a regular person who doesn't know tech jargon. Given the following phone specs, write a short, engaging, plain-English explanation (4–6 short paragraphs) covering what the display, camera, performance, and battery mean in real everyday use. Use simple comparisons and avoid all technical terms. Be warm and conversational.

Phone: ${(phone as { brand?: string }).brand} ${(phone as { name?: string }).name}
Price: $${(phone as { price?: number }).price}

Display: ${JSON.stringify((phone as { display?: unknown }).display)}
Camera: ${JSON.stringify((phone as { camera?: unknown }).camera)}
Performance: ${JSON.stringify((phone as { performance?: unknown }).performance)}
Battery: ${JSON.stringify((phone as { battery?: unknown }).battery)}
Storage options: ${JSON.stringify((phone as { storage?: unknown }).storage)}

Write 4–6 short paragraphs. Each paragraph should cover one aspect (display, camera, performance, battery). End with a one-line overall verdict for the average buyer. Keep it friendly, honest, and jargon-free.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5",
      max_completion_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    });

    const text = completion.choices[0]?.message?.content ?? "";
    if (!text) {
      console.error("Empty content from OpenAI. Full completion:", JSON.stringify(completion));
      res.status(500).json({ error: "AI returned empty response" });
      return;
    }
    res.json({ translation: text });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "Failed to translate specs" });
  }
});

export default router;
