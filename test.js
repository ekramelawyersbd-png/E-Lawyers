const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: 'hello',
      config: { tools: [{ googleSearch: {} }] }
    });
    console.log("Success with search:", response.text);
  } catch (e) {
    console.log("Failed with search:", e.message);
  }
  
  try {
    const response2 = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: 'hello'
    });
    console.log("Success without search:", response2.text);
  } catch (e) {
    console.log("Failed without search:", e.message);
  }
}
test();
