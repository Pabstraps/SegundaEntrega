import passport from 'passport';

const sessionsController = {};

sessionsController.githubLogin = passport.authenticate('github', { scope: ['user:email'] });

sessionsController.githubCallback = passport.authenticate('github', { 
    failureRedirect: '/github/error'
});

sessionsController.register = passport.authenticate('register', { 
    failureRedirect: '/api/sessions/fail-register' 
});

sessionsController.login = passport.authenticate('login', { 
    failureRedirect: '/api/sessions/fail-login' 
});

sessionsController.successfulRegister = (req, res) => {
    console.log("Registrando nuevo usuario.");
    res.status(201).send({ stauts: 'success', message: "User creado de forma exitosa!!" })
};

sessionsController.successfulLogin = (req, res) => {
    console.log("User found to login:");
    const user = req.user;
    console.log(user);
    if (!user) return res.status(401).send({ status: "error", error: "El usuario y la contraseña no coinciden!" });
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    }
    res.send({ status: "success", payload: req.session.user, message: "¡Primer logueo realizado! :)" });
};

sessionsController.failRegister = (req, res) => {
    res.status(401).send({ error: "Failed to process register!" });
};

sessionsController.failLogin = (req, res) => {
    res.status(401).send({ error: "Failed to process login!" });
};

export default sessionsController;
