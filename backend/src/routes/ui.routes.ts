import express, { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import Cycle from "../models/cycle.model";
import DailyLog from "../models/dailyLog.model";

const router = express.Router();

// Middleware Mock de Usuario: Toma el primer usuario de la DB o crea uno para poder probar.
const mockAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let user = await User.findOne();
    if (!user) {
      user = new User({ name: "Usuario Prueba", email: "prueba@moonbloom.tech" });
      await user.save();
    }
    // Asignamos res.locals para Handlebars
    res.locals.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

router.use(mockAuth);

// GET / — Landing page
router.get("/", (req: Request, res: Response): void => {
  res.redirect("/dashboard");
});

// GET /dashboard
router.get("/dashboard", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.user._id;

    const lastCycle = await Cycle.findOne({ userId }).sort({ startDate: -1 }).lean();
    const totalCycles = await Cycle.countDocuments({ userId });
    const totalLogs   = await DailyLog.countDocuments({ userId });
    const lastLog = await DailyLog.findOne({ userId }).sort({ date: -1 }).lean();

    res.render("dashboard", { user: res.locals.user, lastCycle, totalCycles, totalLogs, lastLog });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

// GET /ciclos/nuevo
router.get("/ciclos/nuevo", (req: Request, res: Response): void => {
  res.render("cycles/create", { user: res.locals.user });
});

// POST /ciclos/nuevo
router.post("/ciclos/nuevo", async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, durationDays, notes } = req.body;
    const cycle = new Cycle({
      userId: res.locals.user._id,
      startDate,
      endDate: endDate || undefined,
      durationDays: durationDays ? Number(durationDays) : undefined,
      notes
    });
    await cycle.save();
    res.redirect("/calendario");
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      res.render("cycles/create", { error: messages.join(", "), user: res.locals.user });
    } else {
      res.render("cycles/create", { error: error.message, user: res.locals.user });
    }
  }
});

function toISODate(d: Date | string | null | undefined): string {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

// GET /ciclos/:id/editar
router.get("/ciclos/:id/editar", async (req: Request, res: Response): Promise<void> => {
  try {
    const cycle: any = await Cycle.findOne({ _id: req.params.id, userId: res.locals.user._id }).lean();
    if (!cycle) { res.redirect("/calendario"); return; }
    cycle.startDateISO = toISODate(cycle.startDate);
    cycle.endDateISO   = toISODate(cycle.endDate);
    res.render("cycles/edit", { cycle, user: res.locals.user });
  } catch (error) {
    res.redirect("/calendario");
  }
});

// POST /ciclos/:id/editar
router.post("/ciclos/:id/editar", async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, durationDays, notes } = req.body;
    const update = { startDate, endDate: endDate || null, durationDays: durationDays ? Number(durationDays) : null, notes };
    await Cycle.findOneAndUpdate({ _id: req.params.id, userId: res.locals.user._id }, update, { runValidators: true });
    res.redirect("/calendario");
  } catch (error: any) {
    const cycle: any = await Cycle.findOne({ _id: req.params.id, userId: res.locals.user._id }).lean();
    if (cycle) { cycle.startDateISO = toISODate(cycle.startDate); cycle.endDateISO = toISODate(cycle.endDate); }
    res.render("cycles/edit", { error: error.message, cycle, user: res.locals.user });
  }
});

// GET /calendario
router.get("/calendario", async (req: Request, res: Response): Promise<void> => {
  try {
    const cycles = await Cycle.find({ userId: res.locals.user._id }).sort({ startDate: -1 }).lean();
    res.render("calendar", { cycles, user: res.locals.user });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

// GET /registros/nuevo
router.get("/registros/nuevo", async (req: Request, res: Response): Promise<void> => {
  try {
    const cycles = await Cycle.find({ userId: res.locals.user._id }).sort({ startDate: -1 }).lean();
    res.render("logs/create", { cycles, user: res.locals.user });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

// POST /registros/nuevo
router.post("/registros/nuevo", async (req: Request, res: Response): Promise<void> => {
  try {
    const { cycleId, date, mood, symptoms, flow, notes } = req.body;
    const log = new DailyLog({
      userId: res.locals.user._id,
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
    const cycles = await Cycle.find({ userId: res.locals.user._id }).lean();
    if (error.name === "ValidationError") {
      const msgs = Object.values(error.errors).map((err: any) => err.message);
      res.render("logs/create", { error: msgs.join(", "), cycles, user: res.locals.user });
    } else {
      res.render("logs/create", { error: error.message, cycles, user: res.locals.user });
    }
  }
});

export default router;
