import passport from 'passport';
import local from 'passport-local';
import userModel from '../../models/user.model.js'
import gitHubStrategy from 'passport-github2';
import { createHash, isValidPassword } from '../utils.js';

const localStrategy = local.Strategy
const initializePassport = () =>{

                    //Github//
    passport.use('github', new gitHubStrategy(
        {
            clientID: 'Iv1.719185e5f04f99f4',
            clientSecret: 'b68d0be0d7a6a6ade9d5292f4305d73a5384eb32',
            callbackUrl: 'http://localhost:8080/api/sessions/githubcallback'

        }, async (accessToken, refreshToken, profile, done) =>{
            console.log("Se obtuvo el perfil de usuario:");
            console.log(profile);
            try {
                const user = await userModel.findOne({ email: profile._json.email });
                console.log("Usuario encontrado para login:");
                console.log(user);

                if (!user) {
                    console.warn("User doesn't exists with username: " + profile._json.email);

                    let newUser = {
                        first_name: profile._json.name,
                        last_name: '',
                        age: 18,
                        email: profile._json.email,
                        password: '',
                        loggedBy: 'GitHub'
                    }
                    const result = await userModel.create(newUser)
                    return done(null, result)
                } else {
                    //Si entramos por acá significa que el usuario ya existía.
                    return done(null, user)
                }
            } catch (error) {
                return done (error)
            }
        }
    ))



                     //Local//

    passport.use("register", new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },

        async (req, username,password,done) => {
            const {first_name, last_name, email, age} = req.body
            try {  
                const exists = await userModel.findOne({ email })
                if (exists) {
                    console.log('El usuario ya existe');
                    return done (null,false)
                }

                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }

                const result = await userModel.create(user);
                return done (null,result)
                
            } catch (error) {
                return done ('Error registrando al usuario: ', + error )
            }
        }
    ))

    passport.use('login', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, email, password, done) => {
            try {
                const user = await userModel.findOne({ email });
                console.log("Usuario encontrado para login:", user);
    
                if (!user) {
                    console.warn("Credenciales inválidas para el usuario:", email);
                    return done(null, false);
                }
    
                if (!isValidPassword(user.password, password)) {
                    console.warn("Credenciales inválidas del usuario:", email);
                    return done(null, false);
                }
    
                console.log("Credenciales válidas del usuario:", email);
                return done(null, user);
            } catch (error) {
                console.error("Error durante el inicio de sesión:", error);
                return done(error);
            }
        }
    ));
    
    


    passport.serializeUser((user,done) => {
        done(null,user._id)
    })

    passport.deserializeUser(async(id,done) => {
        try {
            let user = await userModel.findById(id);
            done (null,user)
            
        } catch (error) {
            console.error ("Error  deserializando el usuario " + error);
        }
    })
};





export default initializePassport