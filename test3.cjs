const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  try {
    const response2 = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: 'hello'
    });
    console.log("Success with 1.5-flash:", response2.text);
  } catch (e) {
    console.log("Failed with 1.5-flash:", e.message);
  }
}
test();
