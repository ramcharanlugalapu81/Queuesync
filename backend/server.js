import express from 'express';
import cors from 'cors';
import { env } from './connection/env.js';
import { checkDatabase } from './connection/database.js';
import apiRoutes from './apis/api.js';

const app = express();
app.use(cors({ origin: env.clientOrigin }));
app.use(express.json({ limit: '32kb' }));

// Log state-changing API requests in the server terminal without request bodies,
// which may contain passwords, phone numbers, or ticket management keys.
app.use('/api', (request, response, next) => {
  const safePath = request.originalUrl.split('?')[0];
  const isTicketPoll = /^\/api\/tokens\/\d+\/track$/.test(safePath);
  if (request.method === 'GET' || isTicketPoll) return next();

  const startedAt = performance.now();
  response.once('finish', () => {
    const elapsedMs = Math.round(performance.now() - startedAt);
    const write = response.statusCode >= 400 ? console.warn : console.info;
    write(`[action] ${request.method} ${safePath} -> ${response.statusCode} (${elapsedMs}ms)`);
  });
  next();
});

app.use('/api', apiRoutes);

app.use((error, request, response, next) => {
  console.error(error.message);
  const status = error.status || (error.code === 'ER_DUP_ENTRY' ? 409 : 500);
  const message = error.code === 'ER_DUP_ENTRY' ? 'That account or ticket already exists.' : error.message || 'Something went wrong.';
  response.status(status).json({ error: message });
});

if (!env.demoMode) {
  if (!env.jwtSecret || env.jwtSecret.length < 32 || /replace|change-me|demo-only/i.test(env.jwtSecret)) {
    console.error('Set JWT_SECRET to a random value at least 32 characters long before using MySQL mode.');
    process.exit(1);
  }
  try {
    await checkDatabase();
    console.log(`MySQL connected: ${env.database.name}`);
  } catch (error) {
    console.error(`Unable to connect to MySQL: ${error.message}`);
    process.exit(1);
  }
}

app.listen(env.port, env.host, () => {
  console.log(`QueueFlow API listening at http://${env.host}:${env.port} (${env.demoMode ? 'demo mode' : 'MySQL mode'})`);
});
