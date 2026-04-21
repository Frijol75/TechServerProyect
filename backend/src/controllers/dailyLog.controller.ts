import { Request, Response } from "express";
import DailyLog from "../models/dailyLog.model";

export const getDailyLogs = async (req: Request, res: Response): Promise<void> => {
  const logs = await DailyLog.find()
    .populate("userId", "name email")
    .populate("cycleId", "startDate endDate durationDays");
  res.json(logs);
};

export const getDailyLogById = async (req: Request, res: Response): Promise<void> => {
  const log = await DailyLog.findById(req.params.id)
    .populate("userId", "name email")
    .populate("cycleId", "startDate endDate durationDays");
  if (!log) { res.status(404); throw new Error("Registro diario no encontrado"); }
  res.json(log);
};

export const createDailyLog = async (req: Request, res: Response): Promise<void> => {
  const log = new DailyLog(req.body);
  const savedLog = await log.save();
  res.status(201).json(savedLog);
};

export const updateDailyLog = async (req: Request, res: Response): Promise<void> => {
  const updated = await DailyLog.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after", runValidators: true });
  if (!updated) { res.status(404); throw new Error("Registro diario no encontrado"); }
  res.json(updated);
};

export const deleteDailyLog = async (req: Request, res: Response): Promise<void> => {
  const deleted = await DailyLog.findByIdAndDelete(req.params.id);
  if (!deleted) { res.status(404); throw new Error("Registro diario no encontrado"); }
  res.json({ message: "Registro diario eliminado correctamente" });
};
