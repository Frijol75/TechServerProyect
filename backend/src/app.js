require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

// conectar DB
connectDB();

// middlewares
app.use(cors());
app.use(express.json());

// rutas base
app.get("/", (req, res) => {
  res.send("MoonBloom API running");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const userRoutes = require("./routes/user.routes");

app.use("/api/users", userRoutes);