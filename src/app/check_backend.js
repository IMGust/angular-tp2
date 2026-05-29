const http = require('http');

http.get('http://localhost:8080/pistao?page=0&pageSize=10', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Headers:', JSON.stringify(res.headers, null, 2));
    console.log('Body:', data);
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
