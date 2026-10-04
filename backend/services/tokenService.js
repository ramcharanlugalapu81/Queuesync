import { createHash, randomBytes } from 'node:crypto';
import { env } from '../connection/env.js';
import { demoServices, demoTokens, newDemoTokenId } from '../data/demoStore.js';
import * as repository from '../repositories/queueRepository.js';
import { sendQueueSms } from './smsService.js';

export async function joinQueue(details) {
  const service = await repository.findService(details.serviceId);
  if (!service) throw Object.assign(new Error('Choose an available service.'), { status: 404 });
  if (!service.isOpen) throw Object.assign(new Error('This service is currently closed.'), { status: 409 });

  const managementKey = randomBytes(32).toString('base64url');
  const accessKeyHash = createHash('sha256').update(managementKey).digest('hex');
  const ticket = await repository.createToken(details, accessKeyHash);
  const sms = await sendQueueSms(ticket.phone, `QueueFlow: your ticket ${ticket.ticketCode} is confirmed for ${service.name}. Track your place in the QueueFlow app.`);
  return { ...ticket, serviceName: service.name, managementKey, sms };
}

export function hashManagementKey(managementKey) {
  if (typeof managementKey !== 'string' || managementKey.length < 20 || managementKey.length > 100) return null;
  return createHash('sha256').update(managementKey).digest('hex');
}

export async function getTrackedToken(tokenId, managementKey) {
  const keyHash = hashManagementKey(managementKey);
  if (!keyHash) return null;
  return repository.findTokenWithKey(tokenId, keyHash);
}

export async function cancelTrackedToken(tokenId, managementKey) {
  const keyHash = hashManagementKey(managementKey);
  if (!keyHash) return null;
  return repository.cancelToken(tokenId, keyHash);
}

export async function callNext(serviceId) {
  const ticket = await repository.callNextToken(serviceId);
  if (!ticket) throw Object.assign(new Error('There are no students waiting at this desk.'), { status: 404 });
  const service = await repository.findService(serviceId);
  const sms = await sendQueueSms(ticket.phone, `QueueFlow: ${ticket.ticketCode} is being called at ${service.name}. Please go to ${service.location}.`);
  return { ...ticket, serviceName: service.name, sms };
}

export { env, demoServices, demoTokens };
