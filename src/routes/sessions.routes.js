import { Router } from 'express';
import sessionsController from '../controllers/sessions.controller.js';

import { isAdmin, isUser } from '../services/middlewares/auth.middleware.js';

const router = Router();

router.get('/github', sessionsController.githubLogin);
router.get('/githubcallback', sessionsController.githubCallback);
router.post("/register", sessionsController.register, sessionsController.successfulRegister);
router.post("/login", sessionsController.login, sessionsController.successfulLogin);
router.get("/fail-register", sessionsController.failRegister);
router.get("/fail-login", sessionsController.failLogin);

router.get("/current", isUser, sessionsController.currentUser);

export default router;
