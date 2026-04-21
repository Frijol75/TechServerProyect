// este archivo define como se ve un ciclo menstrual en la base de datos
// cada ciclo pertenece a un usuario

import mongoose, { Document, Model, Types } from "mongoose";

// ── Interfaz del documento Cycle ──────────────────────────────────────────────
export interface ICycle extends Document {
  // id del usuario al que pertenece este ciclo — obligatorio
  userId: Types.ObjectId;
  // fecha en que empezo el ciclo
  startDate?: Date;
  // fecha en que termino el ciclo
  endDate?: Date;
  // cuantos dias duro el ciclo
  durationDays?: number;
  // notas generales del ciclo, texto libre
  notes?: string;
}

const cycleSchema = new mongoose.Schema<ICycle>({
  // id del usuario al que pertenece este ciclo — obligatorio
  // ref: "User" significa que esta conectado con el modelo User
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // fecha en que empezo el ciclo
  startDate: Date,

  // fecha en que termino el ciclo
  endDate: Date,

  // cuantos dias duro el ciclo
  durationDays: Number,

  // notas generales del ciclo, texto libre
  notes: String
});

// exportamos el modelo con el nombre "Cycle"
// MongoDB va a crear una coleccion llamada "cycles" automaticamente
const Cycle: Model<ICycle> = mongoose.model<ICycle>("Cycle", cycleSchema);
export default Cycle;
