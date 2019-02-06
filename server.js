const http = require('http');
const PORT = process.env.PORT || 8008;

const app = require('./src/app.js');

const server = http.createServer(app);
server.listen(PORT, () => console.log(`server is listening on ${PORT}`));
