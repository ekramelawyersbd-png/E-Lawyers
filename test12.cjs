const { GoogleGenerativeAI } = require("@google/generative-ai");
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
async function test() {
  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent("hello");
    console.log("Success:", response.response.text());
  } catch (e) {
    console.log("Failed:", e.message);
  }
}
test();
