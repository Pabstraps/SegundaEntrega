import passport from 'passport';
import User from '../models/user.model.js';
import Role from '../models/role.model.js';

const sessionsController = {};

sessionsController.githubLogin = passport.authenticate('github', { scope: ['user:email'] });

sessionsController.githubCallback = passport.authenticate('github', { 
    failureRedirect: '/github/error'
});

sessionsController.register = async (req, res, next) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const newUser = new User({
            first_name,
            last_name,
            email,
            age,
            password
        });
        const user = await newUser.save();
        const role = await Role.findOne({ name: "user" });
        user.roles.push(role._id);
        await user.save();
        next();
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        res.status(500).send({ error: "Error al registrar el usuario", message: error });
    }
};

sessionsController.login = passport.authenticate('login', { 
    failureRedirect: '/api/sessions/fail-login' 
});

// sessionsController.successfulRegister = (req, res) => {
//     console.log("Registrando nuevo usuario.");
//     res.status(201).send({ stauts: 'success', message: "User creado de forma exitosa!!" })
// };



// sessionsController.successfulLogin = (req, res) => {
//     console.log("User found to login:");
//     const user = req.user;
//     console.log(user);
//     if (!user) return res.status(401).send({ status: "error", error: "El usuario y la contraseña no coinciden!" });
//     req.session.user = {
//         name: `${user.first_name} ${user.last_name}`,
//         email: user.email,
//         age: user.age
//     }
//     res.send({ status: "success", payload: req.session.user, message: "¡Primer logueo realizado! :)" });
// };

sessionsController.successfulRegister = (req, res) => {
    console.log("Registrando nuevo usuario.");
    res.status(201).send({ stauts: 'success', message: "Usuario creado de forma exitosa!!" })
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

sessionsController.currentUser = (req, res) => {
    res.send(req.session.user);
};

export default sessionsController;