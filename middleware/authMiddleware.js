import jwt from "jsonwebtoken";
import Doctor from "../models/Doctor.js";
const  checkAuth = async (req, res, next) => {
    let token;
    console.log(req.headers.authorization);
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //Creamos sesion 
            req.doctor = await Doctor.findById(decoded.id).select("-password -token -confirmado");
            return next();
        } catch (error) {
            const e = new Error('Token no Valido');
            return res.status(403).json({ msg: error.message });
        }
    }

    if (!token) {
        const error = new Error('Token no valido o inexistente');
        res.status(403).json({ msg: error.message });
    }

    next();
};

export default checkAuth;