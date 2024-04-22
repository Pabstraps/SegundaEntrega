import { Router } from 'express';
import sessionsController from '../controllers/sessions.controller.js';

const router = Router();

router.get('/github', sessionsController.githubLogin);
router.get('/githubcallback', sessionsController.githubCallback);
router.post("/register", sessionsController.register, sessionsController.successfulRegister);
router.post("/login", sessionsController.login, sessionsController.successfulLogin);
router.get("/fail-register", sessionsController.failRegister);
router.get("/fail-login", sessionsController.failLogin);

export default router;
