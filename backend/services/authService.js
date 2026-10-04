import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../connection/env.js';
import * as repository from '../repositories/queueRepository.js';

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    campusId: user.campus_id || user.campusId || null,
    phone: user.phone || null,
    role: user.role,
    serviceId: user.service_id || user.serviceId || null,
  };
}

function createSession(user) {
  const token = jwt.sign({ sub: String(user.id), role: user.role }, env.jwtSecret, { expiresIn: '14d' });
  return { token, user: publicUser(user) };
}

export async function register({ name, email, password, campusId, phone, role, serviceId, serviceName }) {
  const existing = await repository.findUserByEmail(email);
  if (existing) throw Object.assign(new Error('An account with this email already exists.'), { status: 409 });
  const passwordHash = await bcrypt.hash(password, 12);
  let finalServiceId = serviceId;
  if (role === 'provider' && serviceName && !serviceId) {
    const service = await repository.createService(serviceName);
    finalServiceId = service.id;
  }
  const user = await repository.createUser({ name: name.trim(), email: email.trim().toLowerCase(), passwordHash, campusId, phone, role: role === 'provider' ? 'provider' : 'student', serviceId: role === 'provider' ? finalServiceId : null });
  return createSession(user);
}

export async function login({ email, password }) {
  const user = await repository.findUserByEmail(email.trim().toLowerCase());
  if (!user || !(await bcrypt.compare(password, user.password_hash || user.passwordHash))) {
    throw Object.assign(new Error('Email or password is incorrect.'), { status: 401 });
  }
  return createSession(user);
}

export { publicUser };
