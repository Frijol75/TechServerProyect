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
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: [true, "El ID del usuario es obligatorio para este ciclo"] 
  },
  startDate: { 
    type: Date,
    required: [true, "La fecha de inicio es obligatoria"]
  },
  endDate: {
    type: Date,
    validate: {
      validator: function(this: ICycle, value: Date) {
        if (!this.startDate || !value) return true;
        return value >= this.startDate;
      },
      message: "La fecha de fin no puede ser anterior a la fecha de inicio"
    }
  },
  durationDays: {
    type: Number,
    min: [1, "La duración debe ser de al menos 1 día"]
  },
  notes: {
    type: String,
    maxlength: [500, "Las notas no pueden exceder los 500 caracteres"]
  }
});

// exportamos el modelo con el nombre "Cycle"
// MongoDB va a crear una coleccion llamada "cycles" automaticamente
const Cycle: Model<ICycle> = mongoose.model<ICycle>("Cycle", cycleSchema);
export default Cycle;
