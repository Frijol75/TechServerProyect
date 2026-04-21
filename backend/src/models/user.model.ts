// este archivo define como se ve un usuario en la base de datos
// incluye encriptación de contraseña y método de comparación

import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcrypt";

// ── Interfaz del documento User ───────────────────────────────────────────────
export interface IUser extends Document {
  // nombre del usuario — obligatorio
  name: string;
  // correo electronico — obligatorio y unico
  email: string;
  // contrasena del usuario — obligatoria (se guarda encriptada)
  password: string;
  // id que da Google cuando el usuario inicia sesion con Google
  googleId?: string;
  // fecha en que se creo la cuenta
  createdAt: Date;
  // Método de instancia: compara contraseña en texto plano con el hash
  comparePassword(plainPassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  // nombre del usuario — obligatorio
  name: { type: String, required: true },

  // correo electronico — obligatorio y unico
  email: { type: String, required: true, unique: true },

  // contrasena del usuario — obligatoria (se guarda encriptada)
  password: { type: String, required: true },

  // id que da Google cuando el usuario inicia sesion con Google
  googleId: String,

  // fecha en que se creo la cuenta
  createdAt: { type: Date, default: Date.now }
});

// ── Pre-save hook: encripta la contraseña antes de guardar ────────────────────
// Solo la encripta si fue modificada (evita doble encriptado en updates)
// Nota: con async, Mongoose usa la Promise — no se necesita next().
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ── Método de instancia: compara contraseña en texto plano con el hash ────────
userSchema.methods.comparePassword = function (plainPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, this.password);
};

// exportamos el modelo con el nombre "User"
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
