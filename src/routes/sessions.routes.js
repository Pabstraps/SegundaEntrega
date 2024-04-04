import { Router } from 'express';
import passport from 'passport'



const router = Router();

router.post("/register", passport.authenticate('register', { failureRedirect: '/api/sessions/fail-register' }), async (req, res) => {
    console.log("Registrando nuevo usuario.");
    res.status(201).send({ stauts: 'success', message: "User creado de forma exitosa!!" })
}

);

router.post("/login", passport.authenticate('login', { failureRedirect: '/api/sessions/fail-login' }), async (req, res) => {
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
});

router.get("/fail-register", (req, res) => {
    res.status(401).send({ error: "Failed to process register!" });
});

router.get("/fail-login", (req, res) => {
    res.status(401).send({ error: "Failed to process login!" });
});

// router.post("/register", async (req, res) => {
//     const { first_name, last_name, email, age, password } = req.body
//     console.log("Registrando Usuario");
//     console.log(req.body);

//     const exists = await userModel.findOne({ email })
//     if (exists) {
//         return res.status(402).send({ status: "error", message: "Usuario ya existe" })
//     }
//     const user = {
//         first_name,
//         last_name,
//         email,
//         age,
//         password: createHash(password)
//     };
//     const result = await userModel.create(user);
//     res.status(201).send({ status: "success", message: "Usuario creado con extito con ID: " + result.id });
// });

// router.post("/login", async (req, res) => {
//     const { email, password } = req.body
//     const user = await userModel.findOne({ email });
//     if (!user) return res.status(401).send({ status: "error", error: "Credenciales incorrectas"});
//     if (!isValidPassword(user,password)) {
//         return res.status(401).send ({ status: "error", error: "Incorrect credential"})
//     }

//     req.session.user = {
//         name: `${user.first_name} ${user.last_name}`,
//         email: user.email,
//         age: user.age
//     }

//     // req.session.user = username;
//     // req.session.admin = true;

//     res.send({ status: "success", payload: req.session.user, message: "Bienvenido!" });
// });

 

export default router;