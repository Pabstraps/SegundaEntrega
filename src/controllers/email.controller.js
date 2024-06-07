import nodemailer from 'nodemailer';
import config from '../config/config.js'
import __dirname from '../services/utils.js'


const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: '587',
    auth: {
        user: config.gmailAccount,
        pass: config.gmailAppPassword
    }
})


transporter.verify(function(error, success) {
    if(error){
        console.log(error);
    }else{
        console.log('server is ready to take our meessages')
    }
})

const mailOptions = {
    from: "Coder Test - " + config.gmailAccount,
    to: config.gmailAccount,
    subject: "Correo de prueba, backend",
    html: "<div> <h3> asdasdasdasdasdsd </h3> </div>",
    attachments: []
}

export const sendEmail = (req,res) => {
    try {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error){
                console.log(error);
                res.status(400).send({ message: "error", payload: error});
            }
            
            console.log("Message send: %s", info.messageId);
            res.send({ message: "succes", payload: info});

        })
        
    } catch (error) {
        console.error (error);
        res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAppPassword})
    }
}

export const sendPasswordResetEmail = (user, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.gmailAccount,
            pass: config.gmailAppPassword,
        },
    });

    const resetUrl = `http://localhost:8080/api/email/reset-password?token=${token}`;

    const mailOptions = {
        from: config.gmailAccount,
        to: user.email,
        subject: 'Password Reset',
        html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
    };

    return transporter.sendMail(mailOptions);
};


