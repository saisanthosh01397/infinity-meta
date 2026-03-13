import { GoogleGenAI, Type } from "@google/genai";
import { QuizConfig, Question } from "../types";

const getAI = () => {
  const userApiKey = localStorage.getItem('quiz_gemini_api_key');
  const apiKey = userApiKey || process.env.GEMINI_API_KEY || "";
  return new GoogleGenAI({ apiKey });
};

export async function generateQuiz(config: QuizConfig): Promise<Question[]> {
  const ai = getAI();
  let prompt = "";
  
  if (config.sourceType === 'upload' && config.documentContent) {
    prompt = `Generate a quiz with ${config.numQuestions} questions based on the following document content:
---
${config.documentContent}
---
Difficulty: ${config.difficulty}
Allowed Formats: ${config.formats.join(", ")}

Requirements:
1. Ensure high factual accuracy based strictly on the provided document.
2. For 'mcq', provide 4 options.
3. For 'multi_mcq', provide 4-5 options where multiple can be correct.
4. For 'fitb', the answer should be a concise keyword or short phrase.
5. Provide a clear explanation for each answer.
6. Return the response as a JSON array of questions.`;
  } else {
    prompt = `Generate a quiz with ${config.numQuestions} questions.
Subject: ${config.subject}
Chapter: ${config.chapter}
Topic: ${config.topic}
Difficulty: ${config.difficulty}
Allowed Formats: ${config.formats.join(", ")}

Requirements:
1. Ensure high factual accuracy.
2. For 'mcq', provide 4 options.
3. For 'multi_mcq', provide 4-5 options where multiple can be correct.
4. For 'fitb', the answer should be a concise keyword or short phrase.
5. Provide a clear explanation for each answer.
6. Return the response as a JSON array of questions.`;
  }

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["mcq", "multi_mcq", "fitb"] },
                text: { type: Type.STRING },
                options: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING } 
                },
                correctAnswer: { 
                  type: Type.ARRAY, // Using array to handle both single and multi
                  items: { type: Type.STRING }
                },
                explanation: { type: Type.STRING },
                difficulty: { type: Type.STRING, enum: ["easy", "medium", "hard"] }
              },
              required: ["id", "type", "text", "correctAnswer", "explanation", "difficulty"]
            }
          }
        },
        required: ["questions"]
      }
    }
  });

  const data = JSON.parse(response.text || '{"questions": []}');
  
  // Normalize correctAnswer to handle string vs array if needed, but schema says array
  return data.questions.map((q: any) => ({
    ...q,
    correctAnswer: q.type === 'mcq' || q.type === 'fitb' ? q.correctAnswer[0] : q.correctAnswer
  }));
}

export async function summarizeDiscussion(messages: { username: string, text: string }[]): Promise<string> {
  const ai = getAI();
  const chatHistory = messages.map(m => `${m.username}: ${m.text}`).join('\n');
  const prompt = `Summarize the following study group discussion into key takeaways and action items:\n\n${chatHistory}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are a helpful study assistant. Provide a concise summary of the discussion.",
    },
  });

  return response.text || "Could not generate summary.";
}

