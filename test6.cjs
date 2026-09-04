const fetch = require('node-fetch');
async function test() {
  const token = process.env.GEMINI_API_KEY;
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ contents: [{ parts: [{ text: 'hello' }] }] })
  });
  console.log(await res.text());
}
test();
