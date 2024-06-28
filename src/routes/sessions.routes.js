import { Router } from 'express';
import sessionsController from '../controllers/sessions.controller.js';
import { toggleUserRole } from "../controllers/user.rol.controller.js"
import upload from '../config/multer.config.js';


import { isAdmin, isUser } from '../services/middlewares/auth.middleware.js';

const router = Router();

router.get('/github', sessionsController.githubLogin);
router.get('/githubcallback', sessionsController.githubCallback);
router.post("/register", sessionsController.register, sessionsController.successfulRegister);
router.post("/login", sessionsController.login, sessionsController.successfulLogin);
router.get("/fail-register", sessionsController.failRegister);
router.get("/fail-login", sessionsController.failLogin);

router.post('/users/:uid/documents', upload.array('documents'), sessionsController.uploadDocuments);
router.get("/current", isUser, sessionsController.currentUser);

router.post('/users/premium/:uid', toggleUserRole);

export default router;
