export function validateJoin(request, response, next) {
  const { name, phone, serviceId, campusId } = request.body;
  if (!Number.isInteger(Number(serviceId)) || !name?.trim() || name.trim().length > 120) {
    return response.status(400).json({ error: 'Enter your name and choose a service.' });
  }
  if (!phone?.trim() || !/^\+?[0-9\s().-]{7,20}$/.test(phone.trim())) {
    return response.status(400).json({ error: 'Enter a phone number with 7 to 20 digits so the desk can send a text update.' });
  }
  if (campusId && campusId.trim().length > 60) return response.status(400).json({ error: 'Campus ID must be 60 characters or fewer.' });
  next();
}

export function validateRegistration(request, response, next) {
  const { name, email, password, role, serviceId, serviceName } = request.body;
  if (!name?.trim() || name.trim().length > 120) return response.status(400).json({ error: 'Enter your name.' });
  if (!/^\S+@\S+\.\S+$/.test(email || '')) return response.status(400).json({ error: 'Enter a valid email address.' });
  if (!password || password.length < 8) return response.status(400).json({ error: 'Choose a password with at least 8 characters.' });
  if (role && !['student', 'provider'].includes(role)) return response.status(400).json({ error: 'Choose student or service provider registration.' });
  if (role === 'provider' && !Number.isInteger(Number(serviceId)) && !serviceName?.trim()) return response.status(400).json({ error: 'Choose or enter the service desk you manage.' });
  next();
}

export function validateLogin(request, response, next) {
  if (!request.body.email || !request.body.password) return response.status(400).json({ error: 'Enter your email and password.' });
  next();
}
