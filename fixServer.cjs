const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(/const ai = new GoogleGenAI\(\{ apiKey \}\);/g, 
`const ai = new GoogleGenAI({ 
  apiKey,
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
});`);

content = content.replace(/'gemini-3\.5-flash'/g, "'gemini-3.7-flash'");
content = content.replace(/'gemini-2\.5-pro'/g, "'gemini-3.1-pro-preview'");

content = content.replace(/res\.status\(500\)\.json\(\{ error: "Failed to analyze tax policy" \}\);/g, 
`let errorMessage = error.message || "Failed to analyze tax policy";
      if (errorMessage.includes("ACCESS_TOKEN_TYPE_UNSUPPORTED") || errorMessage.includes("Expected OAuth 2 access token")) {
        errorMessage = "Invalid Gemini API Key provided. It appears an OAuth token or invalid key was provided instead of a valid Gemini API Key. Please update your API Key in the AI Studio Settings > Secrets panel.";
      }
      res.status(500).json({ error: errorMessage });`);

fs.writeFileSync('server.ts', content);
