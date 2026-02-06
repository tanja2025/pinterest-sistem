import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generatePinVariants(analysis: any) {
    const prompt = `
    Based on this image analysis, generate 3 Pinterest pin variations:
    1. SEO: Keyword-rich title and description, focus on searchability.
    2. Buyer Intent: Focus on value, benefits, and a clear call-to-action (CTA).
    3. Curiosity: Hook-driven, slightly mysterious, designed for high click-through rate.

    Analysis:
    Niche: ${analysis.niche}
    Keywords: ${analysis.keywords.join(", ")}
    Visual Description: ${analysis.description}

    Return a JSON object with a 'pins' array containing 3 objects, each with 'type', 'title', and 'description'.
  `;

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Failed to generate pins");

    return JSON.parse(content).pins;
}
