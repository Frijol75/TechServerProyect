// dotenv debe ser la PRIMERA linea
import "dotenv/config";

import express from "express";
import cors from "cors";
import path from "path";
import { engine } from "express-handlebars";

import connectDB from "./config/db";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

// ── Motor de plantillas ──────────────────────────────────────────────────────
app.engine(
  "handlebars",
  engine({
    layoutsDir: path.join(__dirname, "views", "layouts"),
    defaultLayout: "main",
    extname: ".handlebars",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
    helpers: {
      eq: (a: any, b: any) => a === b,
      formatDate: (date: Date | string | null) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("es-MX", {
          year: "numeric", month: "long", day: "numeric"
        });
      }
    }
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// ── Archivos estáticos ───────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "views", "..", "src", "public")));
app.use(express.static(path.join(__dirname, "public")));

// ── Middleware Global ────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Rutas REST (API) ─────────────────────────────────────────────────────────
import userRoutes from "./routes/user.routes";
import cycleRoutes from "./routes/cycle.routes";
import dailyLogRoutes from "./routes/dailyLog.routes";

app.use("/api/users",     userRoutes);
app.use("/api/cycles",    cycleRoutes);
app.use("/api/dailylogs", dailyLogRoutes);

// ── Rutas UI (Handlebars) ────────────────────────────────────────────────────
import uiRoutes from "./routes/ui.routes";
app.use("/", uiRoutes);

// ── Manejo Global de Errores ─────────────────────────────────────────────────
app.use(errorHandler);

// ── Arrancar servidor ────────────────────────────────────────────────────────
const PORT: number = Number(process.env.PORT) || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
