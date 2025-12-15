const express = require('express');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.all('*', (req, res) => handle(req, res));

  const listener = server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Next.js server listening on http://localhost:${port}`);
  });

  process.on('SIGTERM', () => listener.close());
  process.on('SIGINT', () => listener.close());
});
