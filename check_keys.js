require('dotenv').config();
console.log('OPENAI loaded:', !!process.env.OPENAI_API_KEY);
console.log('GOOGLE loaded:', !!process.env.GOOGLE_API_KEY);
const { OpenAI } = require('openai');
(async () => {
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const r = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Xin chào' }],
      max_tokens: 5
    });
    console.log('OPENAI OK:', r.choices[0].message.content);
  } catch (err) {
    console.error('OPENAI ERR:', err.message || err);
  }

  try {
    const payload = {
      contents: [
        { parts: [{ text: 'Xin chào AI' }] }
      ]
    };
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GOOGLE_API_KEY}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    console.log('GOOGLE STATUS:', res.status);
    console.log('GOOGLE BODY:', await res.text());
  } catch (err) {
    console.error('GOOGLE ERR:', err.message || err);
  }
})();