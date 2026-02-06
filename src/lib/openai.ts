import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeImage(imageUrl: string, customPrompt?: string) {
    const defaultPrompt = "Analyze this image for Pinterest. Provide a JSON response with the following keys: niche (a broad category like Home Decor, Fashion, tech), keywords (a list of 10-15 relevant keywords), description (a 2-sentence visual description), and suggested_boards (3-5 board names this pin would fit into).";

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: customPrompt || defaultPrompt,
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: imageUrl,
                        },
                    },
                ],
            },
        ],
        response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Failed to analyze image");

    return JSON.parse(content);
}
