// este archivo define como se ve un registro diario en la base de datos
// aqui se guardan los sintomas, estado de animo y notas del dia

const mongoose = require("mongoose");

const dailyLogSchema = new mongoose.Schema({
  // id del usuario al que pertenece este registro
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  // id del ciclo al que pertenece este registro
  // esto nos permite saber en que dia del ciclo estaba cuando registro esto
  cycleId: { type: mongoose.Schema.Types.ObjectId, ref: "Cycle" },

  // fecha del registro
  date: Date,

  // como se sentia ese dia
  // ejemplos: "feliz", "triste", "ansiosa", "tranquila"
  mood: String,

  // lista de sintomas del dia
  // los corchetes [] significan que puede guardar varios al mismo tiempo
  // ejemplo: ["colicos", "dolor de cabeza", "fatiga"]
  symptoms: [String],

  // intensidad del flujo del 1 al 5
  // 1 = muy leve, 5 = muy intenso
  flow: { type: Number, min: 1, max: 5 },

  // notas personales del dia, texto libre
  notes: String
});

// exportamos el modelo con el nombre "DailyLog"
// MongoDB va a crear una coleccion llamada "dailylogs" automaticamente
module.exports = mongoose.model("DailyLog", dailyLogSchema);