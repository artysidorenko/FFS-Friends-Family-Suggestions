const http = require('http');
const router = require('./router');

const server = http.createServer(router);
const port = process.env.PORT || 3000;

const startServer = () => {
  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log('Server successfully started, listening on port 3000');
  });
};

startServer();
