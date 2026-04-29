const fetch = global.fetch || require('node-fetch');
(async () => {
  try {
    const login = await fetch('http://127.0.0.1:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testuser' })
    });
    console.log('login status', login.status);
    const cookies = login.headers.get('set-cookie');
    console.log('cookies', cookies);
    const data = await login.json();
    console.log('login body', data);

    const res = await fetch('http://127.0.0.1:3000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookies },
      body: JSON.stringify({ message: 'Vậy cho mình biết nước Việt Nam ra đời vào năm bao nhiêu' })
    });
    console.log('chat status', res.status);
    const body = await res.text();
    console.log('chat body', body);
  } catch (err) {
    console.error(err);
  }
})();