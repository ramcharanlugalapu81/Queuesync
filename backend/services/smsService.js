import twilio from 'twilio';
import { env } from '../connection/env.js';

let client;

export async function sendQueueSms(phone, message) {
  if (!phone) return { sent: false, reason: 'No phone number was provided.' };
  if (!env.twilio.sid || !env.twilio.token || !env.twilio.from) {
    return { sent: false, reason: 'SMS is not configured. Queue updates are available in the app.' };
  }

  try {
    client ||= twilio(env.twilio.sid, env.twilio.token);
    await client.messages.create({ body: message, from: env.twilio.from, to: phone });
    return { sent: true };
  } catch (error) {
    console.error('SMS delivery failed:', error.message);
    return { sent: false, reason: 'SMS could not be delivered. Check the number and SMS setup.' };
  }
}
