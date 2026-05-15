// este archivo define como se ve un registro diario en la base de datos
// aqui se guardan los sintomas, estado de animo y notas del dia

import mongoose, { Document, Model, Types } from "mongoose";

// ── Interfaz del documento DailyLog ───────────────────────────────────────────
export interface IDailyLog extends Document {
  // id del usuario al que pertenece este registro — obligatorio
  userId: Types.ObjectId;
  // id del ciclo al que pertenece este registro — obligatorio
  cycleId: Types.ObjectId;
  // fecha del registro
  date?: Date;
  // como se sentia ese dia
  mood?: string;
  // lista de sintomas del dia
  symptoms?: string[];
  // intensidad del flujo del 1 al 5
  flow?: number;
  // notas personales del dia, texto libre
  notes?: string;
}

const dailyLogSchema = new mongoose.Schema<IDailyLog>({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: [true, "El ID del usuario es obligatorio"] 
  },
  cycleId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Cycle", 
    required: [true, "El ID del ciclo es obligatorio para asociar el registro"] 
  },
  date: {
    type: Date,
    required: [true, "La fecha del registro es obligatoria"],
    default: Date.now
  },
  mood: {
    type: String,
    enum: {
      values: ["feliz", "triste", "ansiosa", "tranquila", "enojada", "cansada", "sensible", "normal"],
      message: "{VALUE} no es un estado de ánimo válido"
    }
  },
  symptoms: {
    type: [String],
    validate: {
      validator: function(v: string[]) {
        return v.every(sym => typeof sym === "string" && sym.trim().length > 0);
      },
      message: "Los síntomas no pueden contener valores vacíos"
    }
  },
  flow: { 
    type: Number, 
    min: [1, "El flujo mínimo es 1"], 
    max: [5, "El flujo máximo es 5"], 
    validate: { validator: Number.isInteger, message: "El valor del flujo debe ser un número entero" } 
  },
  notes: {
    type: String,
    maxlength: [1000, "Las notas no pueden exceder los 1000 caracteres"]
  }
});

// exportamos el modelo con el nombre "DailyLog"
// MongoDB va a crear una coleccion llamada "dailylogs" automaticamente
const DailyLog: Model<IDailyLog> = mongoose.model<IDailyLog>("DailyLog", dailyLogSchema);
export default DailyLog;
