import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "")

/**
 * Analyze sentiment and emotion for a given post text using Gemini.
 * Returns { sentiment: "positive"|"negative"|"neutral", emotion: "joy"|"anger"|... , confidence }
 */
export async function analyzePostContent(content: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    const prompt = `
      Analyze the following social media post and respond strictly as a JSON object:
      Text: """${content}"""
      Respond with this structure:
      {
        "sentiment": "positive"|"neutral"|"negative",
        "emotion": "joy"|"anger"|"sadness"|"fear"|"surprise"|"disgust"|"neutral",
        "confidence": 0-1
      }
    `
    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Parse Gemini’s JSON output safely
    try {
      const jsonStart = text.indexOf("{")
      const jsonEnd = text.lastIndexOf("}") + 1
      const parsed = JSON.parse(text.slice(jsonStart, jsonEnd))
      return parsed
    } catch (err) {
      console.error("Parsing error:", text)
      return { sentiment: "neutral", emotion: "neutral", confidence: 0.5 }
    }
  } catch (err) {
    console.error("Gemini error:", err)
    return { sentiment: "neutral", emotion: "neutral", confidence: 0.5 }
  }
}
