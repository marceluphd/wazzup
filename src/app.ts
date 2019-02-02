import http from 'http';

import app from './server';
import chatServer from './chatServer';

const PORT = process.env.PORT || 3000;

// Start express server
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log('Express server listening on port ' + PORT);
});

// Start chat server
chatServer(server);
