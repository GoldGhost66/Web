const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=AIzaSyCpmPi0nrvCe8XholxANu6DNvk7TcLk9Cs';
const payload = {
  contents: [
    {
      parts: [
        { text: 'Xin chào AI, hãy trả lời ngắn gọn.' }
      ]
    }
  ]
};

(async () => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    console.log('status', res.status);
    const text = await res.text();
    console.log('body', text);
  } catch (e) {
    console.error('ERR', e);
  }
})();
