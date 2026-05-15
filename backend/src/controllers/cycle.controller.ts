import { Request, Response } from "express";
import Cycle from "../models/cycle.model";

export const getCycles = async (req: Request, res: Response): Promise<void> => {
  const cycles = await Cycle.find().populate("userId", "name email");
  res.json(cycles);
};

export const getCycleById = async (req: Request, res: Response): Promise<void> => {
  const cycle = await Cycle.findById(req.params.id).populate("userId", "name email");
  if (!cycle) { res.status(404); throw new Error("Ciclo no encontrado"); }
  res.json(cycle);
};

export const createCycle = async (req: Request, res: Response): Promise<void> => {
  const cycle = new Cycle(req.body);
  const savedCycle = await cycle.save();
  res.status(201).json(savedCycle);
};

export const updateCycle = async (req: Request, res: Response): Promise<void> => {
  const updated = await Cycle.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after", runValidators: true });
  if (!updated) { res.status(404); throw new Error("Ciclo no encontrado"); }
  res.json(updated);
};

export const deleteCycle = async (req: Request, res: Response): Promise<void> => {
  const deleted = await Cycle.findByIdAndDelete(req.params.id);
  if (!deleted) { res.status(404); throw new Error("Ciclo no encontrado"); }
  res.json({ message: "Ciclo eliminado correctamente" });
};
