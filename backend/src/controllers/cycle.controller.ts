import { Request, Response } from "express";
import Cycle from "../models/cycle.model";

// GET /api/cycles — lista todos los ciclos con info del usuario
export const getCycles = async (req: Request, res: Response): Promise<void> => {
  try {
    const cycles = await Cycle.find().populate("userId", "name email");
    res.json(cycles);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/cycles/:id — obtiene un ciclo por ID con info del usuario
export const getCycleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const cycle = await Cycle.findById(req.params.id).populate("userId", "name email");
    if (!cycle) { res.status(404).json({ message: "Ciclo no encontrado" }); return; }
    res.json(cycle);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/cycles — crea un nuevo ciclo
export const createCycle = async (req: Request, res: Response): Promise<void> => {
  try {
    const cycle = new Cycle(req.body);
    const savedCycle = await cycle.save();
    res.status(201).json(savedCycle);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/cycles/:id — actualiza un ciclo existente
export const updateCycle = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Cycle.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });
    if (!updated) { res.status(404).json({ message: "Ciclo no encontrado" }); return; }
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/cycles/:id — elimina un ciclo
export const deleteCycle = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Cycle.findByIdAndDelete(req.params.id);
    if (!deleted) { res.status(404).json({ message: "Ciclo no encontrado" }); return; }
    res.json({ message: "Ciclo eliminado correctamente" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
