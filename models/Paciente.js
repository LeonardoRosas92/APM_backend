import mongoose from "mongoose";
const pacienteSchema = mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true
        },
        email: {
            type: String,
            require: true
        },
        fecha: {
            type: Date,
            required: true,
            default: Date.now()
        },
        sintomas: {
            type: String,
            require: true
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor'
        }
    },
    {
        timestamps: true
    }
);

const Paciente = mongoose.model('Paciente', pacienteSchema);

export default Paciente;