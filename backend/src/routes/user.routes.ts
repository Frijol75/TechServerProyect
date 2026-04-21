import express from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/user.controller";

const router = express.Router();

// GET    /api/users       — lista todos los usuarios
// POST   /api/users       — crea un nuevo usuario
router.get("/", getUsers);
router.post("/", createUser);

// GET    /api/users/:id   — obtiene un usuario por ID
// PUT    /api/users/:id   — actualiza un usuario por ID
// DELETE /api/users/:id   — elimina un usuario por ID
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
