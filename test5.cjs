const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  try {
    const response2 = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: 'hello'
    });
    console.log("Success with 3.1-pro-preview:", response2.text);
  } catch (e) {
    console.log("Failed with 3.1-pro-preview:", e.message);
  }
}
test();
