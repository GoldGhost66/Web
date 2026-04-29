const { OpenAI } = require('openai');
require('dotenv').config();

const openaiClient = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

async function testOpenAI() {
  if (!openaiClient) {
    console.log('No OpenAI client');
    return;
  }

  try {
    const response = await openaiClient.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Bạn là một trợ lý AI bằng tiếng Việt. Trả lời ngắn gọn, lịch sự và dễ hiểu." },
        { role: "user", content: "Xin chào" }
      ],
      max_tokens: 50
    });

    console.log('OpenAI response:', response.choices[0].message?.content);
  } catch (error) {
    console.error('OpenAI error:', error.message);
  }
}

testOpenAI();