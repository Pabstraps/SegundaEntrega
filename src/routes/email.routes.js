import { Router } from "express";
import {sendEmail} from '../controllers/email.controller.js'
import {requestPasswordReset} from '../controllers/sessions.controller.js'
import {resetPassword} from '../controllers/sessions.controller.js'
import {requestNewResetLink} from '../controllers/sessions.controller.js'

const router = Router();

router.get("/", sendEmail);
// router.get("/attachments", sendEmailWithAttachments);

router.post('/request-password-reset',requestPasswordReset)

router.get('/reset-password', (req, res) => {
    const token = req.query.token;
    res.render('reset-password', { token });
});

router.post('/reset-password', resetPassword);

router.post('/request-new-reset-link', requestNewResetLink);

export default router;