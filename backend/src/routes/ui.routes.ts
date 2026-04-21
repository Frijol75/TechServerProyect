import "../types";
import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import Cycle from "../models/cycle.model";
import DailyLog from "../models/dailyLog.model";
import { requireAuth, checkUser } from "../middleware/auth.middleware";

const router = express.Router();

const JWT_SECRET: string = process.env.JWT_SECRET || "moonbloom_secret";

// Inyecta res.locals.user en cada petición (para navbar dinámica)
router.use(checkUser);

// ════════════════════════════════════════════════════════════════
//  RUTAS PÚBLICAS
// ════════════════════════════════════════════════════════════════

// GET / — Landing page
router.get("/", async (req: Request, res: Response): Promise<void> => {
  // Si ya está logueada, va directo al dashboard
  if (res.locals.user) { res.redirect("/dashboard"); return; }
  res.render("home");
});

// GET /login
router.get("/login", (req: Request, res: Response): void => {
  if (res.locals.user) { res.redirect("/dashboard"); return; }
  res.render("auth/login");
});

// POST /login — Verifica credenciales y emite JWT en cookie
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.render("auth/login", { error: "Correo o contraseña incorrectos" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.render("auth/login", { error: "Correo o contraseña incorrectos" });
      return;
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.cookie("jwt", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.redirect("/dashboard");
  } catch (error: any) {
    res.render("auth/login", { error: error.message });
  }
});

// GET /registro
router.get("/registro", (req: Request, res: Response): void => {
  if (res.locals.user) { res.redirect("/dashboard"); return; }
  res.render("auth/register");
});

// POST /registro — Crea usuaria (bcrypt via pre-save hook) y hace login automático
router.post("/registro", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.cookie("jwt", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.redirect("/dashboard");
  } catch (error: any) {
    const msg = error.code === 11000
      ? "Ese correo ya está registrado"
      : error.message;
    res.render("auth/register", { error: msg });
  }
});

// GET /logout — Limpia cookie y redirige
router.get("/logout", (req: Request, res: Response): void => {
  res.clearCookie("jwt");
  res.redirect("/login");
});

// ════════════════════════════════════════════════════════════════
//  RUTAS PRIVADAS (requieren requireAuth)
// ════════════════════════════════════════════════════════════════

// GET /dashboard
router.get("/dashboard", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;

    // Ciclo más reciente de la usuaria
    const lastCycle = await Cycle.findOne({ userId })
      .sort({ startDate: -1 })
      .lean();

    // Contadores propios
    const totalCycles = await Cycle.countDocuments({ userId });
    const totalLogs   = await DailyLog.countDocuments({ userId });

    // Último registro diario
    const lastLog = await DailyLog.findOne({ userId })
      .sort({ date: -1 })
      .lean();

    res.render("dashboard", {
      user: req.user,
      lastCycle,
      totalCycles,
      totalLogs,
      lastLog
    });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

// GET /ciclos/nuevo — Formulario para crear ciclo
router.get("/ciclos/nuevo", requireAuth, (req: Request, res: Response): void => {
  res.render("cycles/create", { user: req.user });
});

// POST /ciclos/nuevo — Guarda el nuevo ciclo
router.post("/ciclos/nuevo", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, durationDays, notes } = req.body;
    const cycle = new Cycle({
      userId: req.user!._id,
      startDate,
      endDate: endDate || undefined,
      durationDays: durationDays ? Number(durationDays) : undefined,
      notes
    });
    await cycle.save();
    res.redirect("/calendario");
  } catch (error: any) {
    res.render("cycles/create", { error: error.message, user: req.user });
  }
});

// Helper: convierte Date a "YYYY-MM-DD" para el input type="date"
function toISODate(d: Date | string | null | undefined): string {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

// GET /ciclos/:id/editar — Formulario de edición de ciclo
router.get("/ciclos/:id/editar", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const cycle: any = await Cycle.findOne({ _id: req.params.id, userId: req.user!._id }).lean();
    if (!cycle) { res.redirect("/calendario"); return; }

    // Agregar fechas en formato ISO para los inputs type="date"
    cycle.startDateISO = toISODate(cycle.startDate);
    cycle.endDateISO   = toISODate(cycle.endDate);

    res.render("cycles/edit", { cycle, user: req.user });
  } catch (error) {
    res.redirect("/calendario");
  }
});

// POST /ciclos/:id/editar — Actualiza el ciclo
router.post("/ciclos/:id/editar", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, durationDays, notes } = req.body;
    const update = {
      startDate,
      endDate: endDate || null,
      durationDays: durationDays ? Number(durationDays) : null,
      notes
    };

    const cycle = await Cycle.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },  // solo puede editar sus propios ciclos
      update,
      { returnDocument: "after" as const }
    );

    if (!cycle) { res.redirect("/calendario"); return; }
    res.redirect("/calendario");
  } catch (error: any) {
    const cycle: any = await Cycle.findOne({ _id: req.params.id, userId: req.user!._id }).lean();
    if (cycle) {
      cycle.startDateISO = toISODate(cycle.startDate);
      cycle.endDateISO   = toISODate(cycle.endDate);
    }
    res.render("cycles/edit", { error: error.message, cycle, user: req.user });
  }
});

// GET /calendario — Ciclos de la usuaria activa
router.get("/calendario", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const cycles = await Cycle.find({ userId: req.user!._id })
      .sort({ startDate: -1 })
      .lean();
    res.render("calendar", { cycles, user: req.user });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

// GET /registros/nuevo — Formulario de síntomas
router.get("/registros/nuevo", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    // Popular el select de ciclos (solo los suyos)
    const cycles = await Cycle.find({ userId: req.user!._id })
      .sort({ startDate: -1 })
      .lean();
    res.render("logs/create", { cycles, user: req.user });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

// POST /registros/nuevo — Guarda registro diario
router.post("/registros/nuevo", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { cycleId, date, mood, symptoms, flow, notes } = req.body;
    const log = new DailyLog({
      userId: req.user!._id,   // ← siempre el usuario logueado, no editable por el cliente
      cycleId,
      date,
      mood,
      symptoms: symptoms ? (symptoms as string).split(",").map((s: string) => s.trim()) : [],
      flow: flow ? Number(flow) : undefined,
      notes
    });
    await log.save();
    res.redirect("/calendario");
  } catch (error: any) {
    const cycles = await Cycle.find({ userId: req.user!._id }).lean();
    res.render("logs/create", { error: error.message, cycles, user: req.user });
  }
});

export default router;
