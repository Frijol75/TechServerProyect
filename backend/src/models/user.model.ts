import mongoose, { Document, Model } from "mongoose";

// ── Interfaz del documento User ───────────────────────────────────────────────
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Mantenido opcional por compatibilidad con UI temporal
  googleId?: string;
  createdAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  name: { 
    type: String, 
    required: [true, "El nombre es obligatorio"], 
    trim: true,
    minlength: [3, "El nombre debe tener al menos 3 caracteres"]
  },
  email: { 
    type: String, 
    required: [true, "El correo electrónico es obligatorio"], 
    unique: true, 
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Ingresa un correo electrónico válido"]
  },
  password: { 
    type: String,
    // Removido 'required: true' ya que en Sprint 2 de APIs no es vital
  },
  googleId: String,
  createdAt: { type: Date, default: Date.now }
});

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
