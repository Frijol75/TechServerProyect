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
  // id del usuario al que pertenece este registro — obligatorio
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // id del ciclo al que pertenece este registro — obligatorio
  // esto nos permite saber en que dia del ciclo estaba cuando registro esto
  cycleId: { type: mongoose.Schema.Types.ObjectId, ref: "Cycle", required: true },

  // fecha del registro
  date: Date,

  // como se sentia ese dia
  // ejemplos: "feliz", "triste", "ansiosa", "tranquila"
  mood: String,

  // lista de sintomas del dia
  // los corchetes [] significan que puede guardar varios al mismo tiempo
  symptoms: [String],

  // intensidad del flujo del 1 al 5 — entero, minimo 1, maximo 5
  flow: { type: Number, min: 1, max: 5, validate: { validator: Number.isInteger, message: "flow debe ser un numero entero" } },

  // notas personales del dia, texto libre
  notes: String
});

// exportamos el modelo con el nombre "DailyLog"
// MongoDB va a crear una coleccion llamada "dailylogs" automaticamente
const DailyLog: Model<IDailyLog> = mongoose.model<IDailyLog>("DailyLog", dailyLogSchema);
export default DailyLog;
