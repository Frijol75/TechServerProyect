import express from "express";
import { getCycles, getCycleById, createCycle, updateCycle, deleteCycle } from "../controllers/cycle.controller";

const router = express.Router();

// GET    /api/cycles       — lista todos los ciclos
// POST   /api/cycles       — crea un nuevo ciclo
router.get("/", getCycles);
router.post("/", createCycle);

// GET    /api/cycles/:id   — obtiene un ciclo por ID
// PUT    /api/cycles/:id   — actualiza un ciclo por ID
// DELETE /api/cycles/:id   — elimina un ciclo por ID
router.get("/:id", getCycleById);
router.put("/:id", updateCycle);
router.delete("/:id", deleteCycle);

export default router;
