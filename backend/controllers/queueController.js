import * as repository from '../repositories/queueRepository.js';
import { callNext, cancelTrackedToken, getTrackedToken, joinQueue } from '../services/tokenService.js';
import { env } from '../connection/env.js';

function providerOwnsService(request, serviceId) {
  if (env.demoMode) return true;
  const assignedServiceId = request.user?.serviceId ?? request.user?.service_id;
  return Number.isInteger(Number(assignedServiceId)) && Number(assignedServiceId) === Number(serviceId);
}

function publicToken(token) {
  if (!token) return token;
  const { phone, accessKeyHash, ...safeToken } = token;
  return safeToken;
}

export async function getServices(request, response) {
  response.json({ services: await repository.listServices() });
}

export async function getActiveTokens(request, response) {
  response.json({ tokens: (await repository.listActiveTokens()).map(publicToken) });
}

export async function getToken(request, response) {
  const token = await getTrackedToken(request.params.id, request.body.managementKey);
  if (!token) return response.status(404).json({ error: 'Ticket not found or access key is incorrect.' });
  const { studentName, campusId, ...trackingDetails } = token;
  response.json({ ticket: publicToken(trackingDetails) });
}

export async function createToken(request, response) {
  response.status(201).json({ ticket: publicToken(await joinQueue(request.body)) });
}

export async function cancelToken(request, response) {
  const ticket = await cancelTrackedToken(request.params.id, request.body.managementKey);
  if (!ticket) return response.status(409).json({ error: 'Ticket could not be cancelled. It may be complete, or the access key is incorrect.' });
  const { studentName, campusId, ...trackingDetails } = ticket;
  response.json({ ticket: publicToken(trackingDetails) });
}

export async function getProviderOverview(request, response) {
  let services = await repository.listProviderServices();
  if (!env.demoMode) {
    const assignedServiceId = request.user?.serviceId ?? request.user?.service_id;
    services = services.filter((service) => service.id === Number(assignedServiceId));
  }
  const ticketsProcessed = await repository.countCompletedToday();
  response.json({
    services: services.map((service) => ({ ...service, current: publicToken(service.current), waiting: service.waiting.map(publicToken) })),
    summary: {
      waiting: services.reduce((total, service) => total + service.waiting.length, 0),
      serving: services.filter((service) => service.current).length,
      openDesks: services.filter((service) => service.isOpen).length,
      completedToday: ticketsProcessed,
    },
  });
}

export async function nextToken(request, response) {
  const serviceId = Number(request.body.serviceId);
  if (!Number.isInteger(serviceId)) return response.status(400).json({ error: 'Choose a service desk.' });
  if (!providerOwnsService(request, serviceId)) return response.status(403).json({ error: 'You can only manage your assigned service desk.' });
  const ticket = await callNext(serviceId);
  response.json({ ticket: publicToken(ticket) });
}

export async function completeToken(request, response) {
  const currentTicket = await repository.findToken(request.params.id);
  if (!currentTicket || !providerOwnsService(request, currentTicket.serviceId)) {
    return response.status(404).json({ error: 'Ticket not found for your service desk.' });
  }
  const ticket = await repository.completeToken(request.params.id);
  if (!ticket) return response.status(409).json({ error: 'This ticket is not currently being served.' });
  response.json({ ticket: publicToken(ticket) });
}
