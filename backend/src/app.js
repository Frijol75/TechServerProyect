// dotenv debe ser la PRIMERA linea, lee el archivo .env y carga las variables
require("dotenv").config();

const express = require("express");

// importamos la funcion de conexion que creamos en config/db.js
const connectDB = require("./config/db");

const app = express();

// llamamos la funcion para conectar con MongoDB
// esto se ejecuta apenas arranca el servidor
connectDB();

// esto le dice a express que entienda JSON
// sin esto no puede leer datos que llegan desde el frontend
app.use(express.json());

// leemos el puerto del .env, si no existe usamos 3000 por defecto
const PORT = process.env.PORT || 3000;

// arrancamos el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
const userRoutes = require("./routes/user.routes");

app.use("/api/users", userRoutes);