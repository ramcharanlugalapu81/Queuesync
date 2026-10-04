import jwt from 'jsonwebtoken';
import { env } from '../connection/env.js';
import * as repository from '../repositories/queueRepository.js';

export async function requireUser(request, response, next) {
  const bearer = request.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!bearer) return response.status(401).json({ error: 'Sign in to continue.' });
  try {
    const decoded = jwt.verify(bearer, env.jwtSecret);
    const user = await repository.findUserById(decoded.sub);
    if (!user) return response.status(401).json({ error: 'Your session has expired. Please sign in again.' });
    request.user = user;
    next();
  } catch {
    return response.status(401).json({ error: 'Your session has expired. Please sign in again.' });
  }
}

export async function requireProvider(request, response, next) {
  const bearer = request.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!bearer && env.demoMode) {
    request.user = { id: 'demo-provider', name: 'Demo Dispatcher', role: 'provider', serviceId: null };
    return next();
  }
  return requireUser(request, response, () => {
    if (request.user.role !== 'provider') {
      if (env.demoMode) {
        request.user = { id: 'demo-provider', name: 'Demo Dispatcher', role: 'provider', serviceId: null };
        return next();
      }
      return response.status(403).json({ error: 'A provider account is required for this action.' });
    }
    if (!env.demoMode && !Number(request.user.service_id ?? request.user.serviceId)) {
      return response.status(403).json({ error: 'A provider account with an assigned service desk is required.' });
    }
    next();
  });
}
