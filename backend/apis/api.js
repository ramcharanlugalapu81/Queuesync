import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as authController from '../controllers/authController.js';
import * as queueController from '../controllers/queueController.js';
import { requireProvider, requireUser } from '../middleware/auth.js';
import { validateJoin, validateLogin, validateRegistration } from '../middleware/validate.js';

const router = Router();

router.get('/health', (request, response) => response.json({ status: 'ok', time: new Date().toISOString() }));
router.get('/services', asyncHandler(queueController.getServices));
router.post('/tokens/join', validateJoin, asyncHandler(queueController.createToken));
router.get('/tokens', requireProvider, asyncHandler(queueController.getActiveTokens));
router.post('/tokens/:id/track', asyncHandler(queueController.getToken));
router.post('/tokens/:id/cancel', asyncHandler(queueController.cancelToken));

router.get('/provider/overview', requireProvider, asyncHandler(queueController.getProviderOverview));
router.post('/provider/next', requireProvider, asyncHandler(queueController.nextToken));
router.post('/provider/:id/complete', requireProvider, asyncHandler(queueController.completeToken));

router.post('/auth/register', validateRegistration, asyncHandler(authController.registerUser));
router.post('/auth/login', validateLogin, asyncHandler(authController.loginUser));
router.get('/auth/me', requireUser, asyncHandler(authController.currentUser));

export default router;
