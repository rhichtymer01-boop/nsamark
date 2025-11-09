import http from 'node:http';

import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { initSocket } from './sockets/initSocket.js';

const bootstrap = async () => {
  await connectDatabase();

  const app = createApp();
  const server = http.createServer(app);

  initSocket(server);

  server.listen(env.port, () => {
    console.log(`🚀 Nsamark API running on port ${env.port}`);
  });
};

bootstrap().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
