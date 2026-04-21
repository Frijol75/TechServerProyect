import { Request, Response } from "express";
import DailyLog from "../models/dailyLog.model";

// GET /api/dailylogs — lista todos los registros con info del usuario y ciclo
export const getDailyLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const logs = await DailyLog.find()
      .populate("userId", "name email")
      .populate("cycleId", "startDate endDate durationDays");
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/dailylogs/:id — obtiene un registro por ID con populate
export const getDailyLogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const log = await DailyLog.findById(req.params.id)
      .populate("userId", "name email")
      .populate("cycleId", "startDate endDate durationDays");
    if (!log) { res.status(404).json({ message: "Registro diario no encontrado" }); return; }
    res.json(log);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/dailylogs — crea un nuevo registro diario
export const createDailyLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const log = new DailyLog(req.body);
    const savedLog = await log.save();
    res.status(201).json(savedLog);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/dailylogs/:id — actualiza un registro existente
export const updateDailyLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await DailyLog.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });
    if (!updated) { res.status(404).json({ message: "Registro diario no encontrado" }); return; }
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/dailylogs/:id — elimina un registro diario
export const deleteDailyLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await DailyLog.findByIdAndDelete(req.params.id);
    if (!deleted) { res.status(404).json({ message: "Registro diario no encontrado" }); return; }
    res.json({ message: "Registro diario eliminado correctamente" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
