// este archivo define como se ve un ciclo menstrual en la base de datos
// cada ciclo pertenece a un usuario

const mongoose = require("mongoose");

const cycleSchema = new mongoose.Schema({
  // id del usuario al que pertenece este ciclo
  // ref: "User" significa que esta conectado con el modelo User
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  // fecha en que empezo el ciclo
  startDate: Date,

  // fecha en que termino el ciclo
  endDate: Date,

  // cuantos dias duro el ciclo
  // este numero lo podemos calcular con startDate y endDate
  durationDays: Number,

  // notas generales del ciclo, texto libre
  notes: String
});

// exportamos el modelo con el nombre "Cycle"
// MongoDB va a crear una coleccion llamada "cycles" automaticamente
module.exports = mongoose.model("Cycle", cycleSchema);