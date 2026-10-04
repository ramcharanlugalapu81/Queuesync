import { login, publicUser, register } from '../services/authService.js';

export async function registerUser(request, response) {
  response.status(201).json(await register(request.body));
}

export async function loginUser(request, response) {
  response.json(await login(request.body));
}

export async function currentUser(request, response) {
  response.json({ user: publicUser(request.user) });
}
