import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import multer from "multer";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Set up multer for file uploads
  const upload = multer({ storage: multer.memoryStorage() });

  app.post("/api/scan-document", upload.single("document"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No document provided" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key not configured" });
      }

      const ai = new GoogleGenAI({ 
  apiKey,
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
});
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: "Extract all the text from this tax-related document. If there is structured data like amounts, dates, or company names, try to present it clearly.",
              },
              {
                inlineData: {
                  data: req.file.buffer.toString('base64'),
                  mimeType: req.file.mimetype,
                }
              }
            ]
          }
        ]
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error("Error scanning document:", error);
      res.status(500).json({ error: "Failed to scan document" });
    }
  });

  app.post("/api/tax-policy-analysis", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key not configured" });
      }

      const { topic } = req.body;
      const query = topic || "Bangladesh Finance Act latest updates and historical tax trends";

      const ai = new GoogleGenAI({ 
  apiKey,
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
});
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: [
          {
            role: 'user',
            parts: [{ text: `Provide an expert analysis and summary on the following tax policy topic: ${query}. Focus on historical tax trends and expert commentary on the latest Bangladesh Finance Act updates.` }],
          }
        ],
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const text = response.text;
      
      res.json({ text });
    } catch (error) {
      console.error("Error analyzing tax policy:", error);
      let errorMessage = error.message || "Failed to analyze tax policy";
      if (errorMessage.includes("ACCESS_TOKEN_TYPE_UNSUPPORTED") || errorMessage.includes("Expected OAuth 2 access token")) {
        errorMessage = "Invalid Gemini API Key provided. It appears an OAuth token or invalid key was provided instead of a valid Gemini API Key. Please update your API Key in the AI Studio Settings > Secrets panel.";
      }
      res.status(500).json({ error: errorMessage });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
