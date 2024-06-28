import { Router } from "express";
import sessionsController from '../controllers/sessions.controller.js';
import { requestPasswordReset } from "../controllers/sessions.controller.js";


const router = Router();

router.get("/login", (req, res) => {
    res.render('login')
});

router.get("/register", (req, res) => {
    res.render('register')
});

router.post("/register", sessionsController.register, sessionsController.successfulRegister);

router.get("/", (req, res) => {
    res.render('profile', {
        user: req.session.user
    })
});

router.post('/request-password-reset', requestPasswordReset);

router.get("/logout", (req, res) => {
    req.session.destroy(error => {
        if (error){
            res.json({error: "error logout", mensaje: "Error al cerrar la sesion"});
        }
        res.send("Sesion cerrada correctamente.");
    });
});



export default router;
