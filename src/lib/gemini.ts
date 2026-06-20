import { GoogleGenerativeAI } from "@google/generative-ai";
import { LESSON_NOTE_SYSTEM_PROMPT } from "./ai-prompt";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateLessonNote(topic: string, subject: string) {
  // Use the full versioned model name if 'flash' alone fails
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

  const prompt = `${LESSON_NOTE_SYSTEM_PROMPT}
  
  Generate a lesson note for the subject: ${subject}
  Topic: ${topic}
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error("Detailed Gemini API Error:", error.message);
    // If 404 persists, try 'gemini-1.5-pro' as a test to see if the project has access
    throw new Error("Gemini model not found. Check your API project model permissions.");
  }
}