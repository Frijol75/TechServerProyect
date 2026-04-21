import express from "express";
import { getDailyLogs, getDailyLogById, createDailyLog, updateDailyLog, deleteDailyLog } from "../controllers/dailyLog.controller";

const router = express.Router();

// GET    /api/dailylogs       — lista todos los registros diarios
// POST   /api/dailylogs       — crea un nuevo registro diario
router.get("/", getDailyLogs);
router.post("/", createDailyLog);

// GET    /api/dailylogs/:id   — obtiene un registro por ID
// PUT    /api/dailylogs/:id   — actualiza un registro por ID
// DELETE /api/dailylogs/:id   — elimina un registro por ID
router.get("/:id", getDailyLogById);
router.put("/:id", updateDailyLog);
router.delete("/:id", deleteDailyLog);

export default router;
