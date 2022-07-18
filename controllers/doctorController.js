import Doctor from "../models/Doctor.js"
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";
const registrar = async (req, res) => {
    try {
        console.log('Iniciamos registro');
        const { email, nombre } = req.body;
        //Prevenir usuarios duplicados
        const existeUsuario = await Doctor.findOne({ email: email });
        if (existeUsuario) {
            const error = new Error('Usuario ya registrado');
            return res.status(400).json({ msg: error.message });
        }

        console.log(req.body);
        const doctor = new Doctor(req.body);
        const doctorGuardado = await doctor.save();

        //Enviar email
        emailRegistro({ email, nombre, token: doctorGuardado.token });
        res.json(doctorGuardado);
    } catch (error) {
        console.log(error);
    }

};


const perfil = (req, res) => {
    const { doctor } = req;
    console.log(doctor);
    res.json(doctor);
};

const confirmar = async (req, res) => {
    console.log('Confirmacion en proceso...');
    try {
        const { token } = req.params;
        console.log(token);
        const usuarioConfirmar = await Doctor.findOne({ token: token });
        if (!usuarioConfirmar) {
            const error = new Error('Token no valido');
            return res.status(404).json({ msg: error.message });
        }
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();
        res.json({ msg: 'Correo confirmado correctamente' });
    } catch (error) {
        console.log(error);
    }
};

const autenticar = async (req, res) => {
    console.log('Login');
    const { email, password } = req.body;
    const usuario = await Doctor.findOne({ email: email });
    if (!usuario) {
        const error = new Error('El usuario no existe');
        return res.status(404).json({ msg: error.message });
    }

    //Comprobar que el usuario es confirmado
    if (!usuario.confirmado) {
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({ msg: error.message });
    }

    //Revisar el password
    if (await usuario.comprobarPassword(password)) {
        res.json({
            _id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        });
    } else {
        const error = new Error('Password incorrecto');
        return res.status(403).json({ msg: error.message });
    }
};

const olvidePassword = async (req, res) => {
    const { email } = req.body;
    const existeDoctor = await Doctor.findOne({ email });
    if (!existeDoctor) {
        const error = new Error('El usuario no existe');
        return res.status(400).json({ msg: error.message });
    }
    try {
        existeDoctor.token = generarId();
        await existeDoctor.save();
        emailOlvidePassword({
            email: email,
            nombre: existeDoctor.nombre,
            token: existeDoctor.token
        });
        res.json({ msg: 'Hemos enviado un email con las instrucciones' });
    } catch (error) {
        console.log(error.message);
    }
}

const comprobarToken = async (req, res) => {
    const { token } = req.params;
    const tokenValido = await Doctor.findOne({ token });
    if (tokenValido) {
        res.json({ msg: "Token valido y el usuario existe" });
    } else {
        const error = new Error('Token no valido');
        return res.status(400).json({ msg: error.message });
    }
}

const nuevoPasswod = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const doctor = await Doctor.findOne({ token });
    if (!doctor) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    try {
        doctor.token = null;
        doctor.password = password;
        await doctor.save();
        res.json({ msg: "Password modificado correctamente" });
    } catch (error) {
        console.log(error);
    }
}

const actualizarPerfil = async (req, res) => {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
        return res.status(400).json({ msg: error.message });
    }
    const { email } = req.body;
    if (doctor.email !== email) {
        const existeEmail = await Doctor.findOne({ email });
        if (existeEmail) {
            const error = new Error('El Email ya esta en uso');
            return res.status(400).json({ msg: error.message });
        }
    }
    try {
        doctor.nombre = req.body.nombre;
        doctor.email = req.body.email;

        const doctorActualizado = await doctor.save();
        res.json(doctorActualizado);
    } catch (error) {
        console.log(error);
    }
}

const actualizarPassword = async (req, res) => {
    const { id } = req.doctor;
    const { pwd_actual, pwd_nuevo } = req.body;
    const doctor = await Doctor.findById(id);
    try {
        if (!doctor) {
            const error = new Error('Hubo un error');
            return res.status(400).json({ msg: error.message });
        }
        if (await doctor.comprobarPassword(pwd_actual)) {
            doctor.password = pwd_nuevo;
            await doctor.save();
            res.json({ msg: 'Passwors Almacenado Correctamente' });
        } else {
            const error = new Error('El password actual es incorrecto');
            return res.status(400).json({ msg: error.message });
        }
    } catch (error) {
        console.log(error);
    }

}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPasswod,
    actualizarPerfil,
    actualizarPassword
}