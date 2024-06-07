// import passport from 'passport';
// import User from '../models/user.model.js';
// import Role from '../models/role.model.js';

// const sessionsController = {};

// sessionsController.githubLogin = passport.authenticate('github', { scope: ['user:email'] });

// sessionsController.githubCallback = passport.authenticate('github', { 
//     failureRedirect: '/github/error'
// });

// sessionsController.register = async (req, res, next) => {
//     try {
//         const { first_name, last_name, email, age, password } = req.body;

//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).send({ error: "El correo electrónico ya está en uso" });
//         }

//         const newUser = new User({
//             first_name,
//             last_name,
//             email,
//             age,
//             password,
//             roles: [] 
//         });
//         const user = await newUser.save();
//         const role = await Role.findOne({ name: "user" });
//         user.roles.push(role._id);
//         await user.save();
//         next();
//     } catch (error) {
//         console.error("Error al registrar el usuario:", error);
//         res.status(500).send({ error: "Error al registrar el usuario", message: error });
//     }
// };

// sessionsController.login = passport.authenticate('login', { 
//     failureRedirect: '/api/sessions/fail-login' 
// });

// // sessionsController.successfulRegister = (req, res) => {
// //     console.log("Registrando nuevo usuario.");
// //     res.status(201).send({ stauts: 'success', message: "User creado de forma exitosa!!" })
// // };



// // sessionsController.successfulLogin = (req, res) => {
// //     console.log("User found to login:");
// //     const user = req.user;
// //     console.log(user);
// //     if (!user) return res.status(401).send({ status: "error", error: "El usuario y la contraseña no coinciden!" });
// //     req.session.user = {
// //         name: `${user.first_name} ${user.last_name}`,
// //         email: user.email,
// //         age: user.age
// //     }
// //     res.send({ status: "success", payload: req.session.user, message: "¡Primer logueo realizado! :)" });
// // };

// sessionsController.successfulRegister = (req, res) => {
//     console.log("Registrando nuevo usuario.");
//     res.status(201).send({ stauts: 'success', message: "Usuario creado de forma exitosa!!" })
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

// sessionsController.failRegister = (req, res) => {
//     res.status(401).send({ error: "Failed to process register!" });
// };

// sessionsController.failLogin = (req, res) => {
//     res.status(401).send({ error: "Failed to process login!" });
// };

// sessionsController.currentUser = (req, res) => {
//     res.send(req.session.user);
// };

// export default sessionsController;
import passport from 'passport';
import User from '../models/user.model.js';
import { userDTO } from '../dtos/user.dto.js';
import {sendPasswordResetEmail} from '../controllers/email.controller.js'
import jwt from 'jsonwebtoken'


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
        next();
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        res.status(500).send({ error: "Error al registrar el usuario", message: error });
    }
};

sessionsController.login = passport.authenticate('login', { 
    failureRedirect: '/api/sessions/fail-login' 
});

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
        age: user.age,
        role: user.role
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
    const user = req.session.user;
    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }
    const userToSend = userDTO(user);
    res.status(200).json({ user: userToSend });
  };



  //Token
  
  export const generateResetToken = (user) => {
      const payload = { id: user._id, email: user.email };
      const secret = process.env.JWT_SECRET;
      const options = { expiresIn: '1h' };
      return jwt.sign(payload, secret, options);
  };

  export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const token = generateResetToken(user);
        await sendPasswordResetEmail(user, token);

        res.json({ message: 'Password reset link has been sent to your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};




  export const resetPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        if (user.password === password) {
            return res.status(400).json({ message: 'New password cannot be the same as the old password' });
        }

        user.password = password;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'Token expired. Please request a new password reset.' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};




export const requestNewResetLink = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const token = generateResetToken(user);
        await sendPasswordResetEmail(user, token);

        res.json({ message: 'Password reset link has been resent. Check your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};




export default sessionsController;
