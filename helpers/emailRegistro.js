import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
    var transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, token } = datos;
    const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Comprueba tu cuenta en APM',
        text: 'Comprueba tu cuenta en APM',
        html: `<p>Hola: ${nombre}, comprueba tu cuenta en APV. </p>
        <p>Tu cuenta ya esta lista, solo debes comprobarla en el sigueinte enlace:</p>
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a>
        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje.</p>
        `
    });
    console.log("Mensaje enviado: %s", info.messageId);
}

export default emailRegistro;