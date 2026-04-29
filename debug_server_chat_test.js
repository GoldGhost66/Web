const fetch = global.fetch || require('node-fetch');
(async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Tìm 1 trang youtube giải trí' })
    });
    console.log('status', res.status);
    const json = await res.json();
    console.log('body', json);
  } catch (e) {
    console.error('ERR', e);
  }
})();