import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarId from "../helpers/generarId.js"
const doctorSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono:{
        type: String,
        defaul: null,
        trim: true
    },
    web:{
        type: String,
        default: null
    },
    token:{
        type: String,
        default: generarId()
    },
    confirmado:{
        type: Boolean,
        default: false
    }
});

doctorSchema.pre('save', async function(next){
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

doctorSchema.methods.comprobarPassword = async function(passwordFormulario){
    console.log('bcrypt');
    return await bcrypt.compare(passwordFormulario,this.password);
}

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;