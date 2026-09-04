const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({});
async function test() {
  try {
    const response2 = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: 'hello'
    });
    console.log("Success with ADC:", response2.text);
  } catch (e) {
    console.log("Failed with ADC:", e.message);
  }
}
test();
