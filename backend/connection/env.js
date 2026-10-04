import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 3002),
  host: process.env.API_HOST || '127.0.0.1',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5175',
  demoMode: process.env.DEMO_MODE !== 'false',
  jwtSecret: process.env.JWT_SECRET || (process.env.DEMO_MODE === 'false' ? null : 'queueflow-demo-only-secret-change-me'),
  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME || 'campus_queue_manager',
  },
  twilio: {
    sid: process.env.TWILIO_ACCOUNT_SID,
    token: process.env.TWILIO_AUTH_TOKEN,
    from: process.env.TWILIO_FROM_NUMBER,
  },
};
