const http = require('http');

const data = JSON.stringify({
  title: "Test Box",
  bundleSize: "Small",
  design: "Classic",
  style: "Minimalist",
  username: "testuser",
  price: 148.00,
  status: "Pending"
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/mystery-boxes/public',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', body);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(data);
req.end();
