import { env } from '../connection/env.js';
import { getPool } from '../connection/database.js';
import { demoServices, demoTokens, newDemoTokenId } from '../data/demoStore.js';

const byJoinTime = (a, b) => new Date(a.joinedAt) - new Date(b.joinedAt);
const active = (token) => token.status === 'waiting' || token.status === 'called';

function demoServiceView(service) {
  const serviceTokens = demoTokens.filter((token) => token.serviceId === service.id);
  const waiting = serviceTokens.filter((token) => token.status === 'waiting').sort(byJoinTime);
  const called = serviceTokens.find((token) => token.status === 'called');
  return {
    ...service,
    waitingCount: waiting.length,
    currentTicket: called?.ticketCode || null,
    estimatedWaitMinutes: waiting.length * service.averageServiceMinutes,
  };
}

function mapService(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    location: row.location,
    prefix: row.prefix,
    icon: row.icon,
    averageServiceMinutes: row.average_service_minutes,
    isOpen: Boolean(row.is_open),
    waitingCount: Number(row.waiting_count || 0),
    currentTicket: row.current_ticket || null,
    estimatedWaitMinutes: Number(row.waiting_count || 0) * row.average_service_minutes,
  };
}

function mapToken(row) {
  return {
    id: row.id,
    serviceId: row.service_id,
    ticketCode: row.ticket_code,
    studentName: row.student_name,
    campusId: row.campus_id,
    phone: row.phone,
    status: row.status,
    joinedAt: row.joined_at,
    calledAt: row.called_at,
    completedAt: row.completed_at,
    serviceName: row.service_name,
    location: row.location,
    position: Number(row.position || 0),
    estimatedWaitMinutes: Math.max(0, Number(row.position || 0) - 1) * Number(row.average_service_minutes || 0),
  };
}

export async function listServices() {
  if (env.demoMode) return demoServices.slice().sort((a, b) => a.sortOrder - b.sortOrder).map(demoServiceView);
  const [rows] = await getPool().query(`
    SELECT s.*, COUNT(CASE WHEN t.status = 'waiting' THEN 1 END) AS waiting_count,
      MAX(CASE WHEN t.status = 'called' THEN t.ticket_code END) AS current_ticket
    FROM services s LEFT JOIN queue_tokens t ON t.service_id = s.id AND t.status IN ('waiting', 'called')
    GROUP BY s.id ORDER BY s.sort_order, s.name`);
  return rows.map(mapService);
}

export async function findService(serviceId) {
  const id = Number(serviceId);
  if (env.demoMode) return demoServices.find((service) => service.id === id) || null;
  const [rows] = await getPool().query('SELECT * FROM services WHERE id = ?', [id]);
  return rows[0] ? { ...rows[0], isOpen: Boolean(rows[0].is_open), averageServiceMinutes: rows[0].average_service_minutes } : null;
}

export async function createToken(details, accessKeyHash) {
  if (env.demoMode) {
    const service = demoServices.find((item) => item.id === Number(details.serviceId));
    const serviceTokens = demoTokens.filter((token) => token.serviceId === service.id);
    const serial = serviceTokens.reduce((highest, item) => Math.max(highest, Number(item.ticketCode.split('-')[1]) || 0), 0) + 1;
    const token = {
      id: newDemoTokenId(),
      serviceId: service.id,
      ticketCode: `${service.prefix}-${String(serial).padStart(3, '0')}`,
      studentName: details.name.trim(),
      campusId: details.campusId?.trim() || null,
      phone: details.phone.trim(),
      accessKeyHash,
      status: 'waiting',
      joinedAt: new Date(),
      calledAt: null,
      completedAt: null,
    };
    demoTokens.push(token);
    const waitingAhead = serviceTokens.filter((item) => item.status === 'waiting').length;
    return { ...token, serviceName: service.name, location: service.location, position: waitingAhead + 1, estimatedWaitMinutes: waitingAhead * service.averageServiceMinutes };
  }

  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    const [services] = await connection.query('SELECT * FROM services WHERE id = ? AND is_open = TRUE FOR UPDATE', [details.serviceId]);
    if (!services[0]) throw Object.assign(new Error('This service is unavailable.'), { status: 404 });
    const service = services[0];
    const [counts] = await connection.query("SELECT COUNT(*) AS total, SUM(status = 'waiting') AS waiting FROM queue_tokens WHERE service_id = ?", [service.id]);
    const ticketCode = `${service.prefix}-${String(Number(counts[0].total) + 1).padStart(3, '0')}`;
    const [result] = await connection.query(
      'INSERT INTO queue_tokens (service_id, ticket_code, student_name, campus_id, phone, access_key_hash) VALUES (?, ?, ?, ?, ?, ?)',
      [service.id, ticketCode, details.name.trim(), details.campusId?.trim() || null, details.phone.trim(), accessKeyHash]);
    await connection.commit();
    return {
      id: result.insertId, serviceId: service.id, ticketCode, studentName: details.name.trim(),
      campusId: details.campusId?.trim() || null, phone: details.phone.trim(), status: 'waiting',
      joinedAt: new Date(), location: service.location, serviceName: service.name,
      position: Number(counts[0].waiting || 0) + 1,
      estimatedWaitMinutes: Number(counts[0].waiting || 0) * service.average_service_minutes,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function findToken(tokenId) {
  const id = Number(tokenId);
  if (env.demoMode) {
    const token = demoTokens.find((item) => item.id === id);
    if (!token) return null;
    const service = demoServices.find((item) => item.id === token.serviceId);
    const earlier = demoTokens.filter((item) => item.serviceId === token.serviceId && item.status === 'waiting' && item.status === token.status && byJoinTime(item, token) < 0);
    return { ...token, serviceName: service.name, location: service.location, position: token.status === 'waiting' ? earlier.length + 1 : 0, estimatedWaitMinutes: earlier.length * service.averageServiceMinutes };
  }
  const [rows] = await getPool().query(`
    SELECT t.*, s.name AS service_name, s.location, s.average_service_minutes,
      CASE WHEN t.status = 'waiting' THEN 1 + (
        SELECT COUNT(*) FROM queue_tokens ahead
        WHERE ahead.service_id = t.service_id AND ahead.status = 'waiting'
          AND (ahead.joined_at < t.joined_at OR (ahead.joined_at = t.joined_at AND ahead.id < t.id))
      ) ELSE 0 END AS position
    FROM queue_tokens t JOIN services s ON s.id = t.service_id WHERE t.id = ?`, [id]);
  return rows[0] ? mapToken(rows[0]) : null;
}

export async function listActiveTokens() {
  if (env.demoMode) {
    return Promise.all(demoTokens.filter(active).map((token) => findToken(token.id)));
  }
  const [rows] = await getPool().query(`
    SELECT t.*, s.name AS service_name, s.location, s.average_service_minutes,
      CASE WHEN t.status = 'waiting' THEN 1 + (
        SELECT COUNT(*) FROM queue_tokens ahead
        WHERE ahead.service_id = t.service_id AND ahead.status = 'waiting'
          AND (ahead.joined_at < t.joined_at OR (ahead.joined_at = t.joined_at AND ahead.id < t.id))
      ) ELSE 0 END AS position
    FROM queue_tokens t JOIN services s ON s.id = t.service_id
    WHERE t.status IN ('waiting', 'called') ORDER BY t.service_id, t.joined_at`);
  return rows.map(mapToken);
}

export async function findTokenWithKey(tokenId, accessKeyHash) {
  if (env.demoMode) {
    const token = demoTokens.find((item) => item.id === Number(tokenId) && item.accessKeyHash === accessKeyHash);
    return token ? findToken(token.id) : null;
  }
  const [rows] = await getPool().query('SELECT id FROM queue_tokens WHERE id = ? AND access_key_hash = ?', [Number(tokenId), accessKeyHash]);
  return rows[0] ? findToken(rows[0].id) : null;
}

export async function cancelToken(tokenId, accessKeyHash) {
  if (env.demoMode) {
    const token = demoTokens.find((item) => item.id === Number(tokenId) && item.accessKeyHash === accessKeyHash);
    if (!token || token.status !== 'waiting') return null;
    token.status = 'cancelled';
    return findToken(token.id);
  }
  const [result] = await getPool().query("UPDATE queue_tokens SET status = 'cancelled' WHERE id = ? AND status = 'waiting' AND access_key_hash = ?", [Number(tokenId), accessKeyHash]);
  return result.affectedRows ? findToken(tokenId) : null;
}

export async function callNextToken(serviceId) {
  const id = Number(serviceId);
  if (env.demoMode) {
    const current = demoTokens.find((token) => token.serviceId === id && token.status === 'called');
    if (current) throw Object.assign(new Error('Complete the current ticket before calling the next student.'), { status: 409 });
    const token = demoTokens.filter((item) => item.serviceId === id && item.status === 'waiting').sort(byJoinTime)[0];
    if (!token) return null;
    token.status = 'called';
    token.calledAt = new Date();
    return findToken(token.id);
  }
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    await connection.query('SELECT id FROM services WHERE id = ? FOR UPDATE', [id]);
    const [current] = await connection.query("SELECT id FROM queue_tokens WHERE service_id = ? AND status = 'called' FOR UPDATE", [id]);
    if (current.length) throw Object.assign(new Error('Complete the current ticket before calling the next student.'), { status: 409 });
    const [waiting] = await connection.query("SELECT id FROM queue_tokens WHERE service_id = ? AND status = 'waiting' ORDER BY joined_at, id LIMIT 1 FOR UPDATE", [id]);
    if (!waiting.length) { await connection.commit(); return null; }
    await connection.query("UPDATE queue_tokens SET status = 'called', called_at = CURRENT_TIMESTAMP WHERE id = ?", [waiting[0].id]);
    await connection.commit();
    return findToken(waiting[0].id);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function completeToken(tokenId) {
  if (env.demoMode) {
    const token = demoTokens.find((item) => item.id === Number(tokenId));
    if (!token || token.status !== 'called') return null;
    token.status = 'completed';
    token.completedAt = new Date();
    return findToken(token.id);
  }
  const [result] = await getPool().query("UPDATE queue_tokens SET status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'called'", [Number(tokenId)]);
  return result.affectedRows ? findToken(tokenId) : null;
}

export async function listProviderServices() {
  const services = await listServices();
  const tokens = await listActiveTokens();
  return services.map((service) => ({
    ...service,
    current: tokens.find((token) => token.serviceId === service.id && token.status === 'called') || null,
    waiting: tokens.filter((token) => token.serviceId === service.id && token.status === 'waiting'),
  }));
}

export async function countCompletedToday() {
  if (env.demoMode) return demoTokens.filter((token) => token.status === 'completed' && new Date(token.completedAt).toDateString() === new Date().toDateString()).length;
  const [rows] = await getPool().query("SELECT COUNT(*) AS total FROM queue_tokens WHERE status = 'completed' AND DATE(completed_at) = CURRENT_DATE");
  return Number(rows[0].total || 0);
}

export async function findUserByEmail(email) {
  if (env.demoMode) {
    const { demoUsers } = await import('../data/demoStore.js');
    return demoUsers.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
  }
  const [rows] = await getPool().query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

export async function findUserById(userId) {
  if (env.demoMode) {
    const { demoUsers } = await import('../data/demoStore.js');
    return demoUsers.find((user) => user.id === Number(userId)) || null;
  }
  const [rows] = await getPool().query('SELECT id, name, email, campus_id, phone, role, service_id as serviceId, created_at FROM users WHERE id = ?', [Number(userId)]);
  return rows[0] || null;
}

export async function createService(name) {
  const prefix = name.substring(0, 1).toUpperCase() + Math.floor(Math.random() * 1000);
  if (env.demoMode) {
    const service = { id: demoServices.length + 1, name: name.trim(), category: 'Custom Service', description: 'Created by provider', location: 'TBD', prefix, icon: 'storefront', averageServiceMinutes: 5, isOpen: true, sortOrder: demoServices.length + 1 };
    demoServices.push(service);
    return service;
  }
  const [result] = await getPool().query(
    'INSERT INTO services (name, category, description, location, prefix, icon, average_service_minutes) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name.trim(), 'Custom Service', 'Created by provider', 'TBD', prefix, 'storefront', 5]
  );
  return { id: result.insertId, name: name.trim() };
}

export async function createUser(user) {
  const role = user.role === 'provider' ? 'provider' : 'student';
  const serviceId = user.serviceId || null;
  if (env.demoMode) {
    const { demoUsers, newDemoUserId } = await import('../data/demoStore.js');
    const newUser = { id: newDemoUserId(), ...user, role, serviceId };
    demoUsers.push(newUser);
    return newUser;
  }
  const [result] = await getPool().query(
    'INSERT INTO users (name, email, campus_id, phone, password_hash, role, service_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [user.name, user.email, user.campusId || null, user.phone || null, user.passwordHash, role, serviceId]);
  return { id: result.insertId, name: user.name, email: user.email, campus_id: user.campusId || null, phone: user.phone || null, role, serviceId };
}
