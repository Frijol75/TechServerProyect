import { Request, Response } from "express";
import User from "../models/user.model";

// GET /api/users — lista todos los usuarios
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/users/:id — obtiene un usuario por ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) { res.status(404).json({ message: "Usuario no encontrado" }); return; }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/users — crea un nuevo usuario
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/users/:id — actualiza un usuario existente
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });
    if (!updated) { res.status(404).json({ message: "Usuario no encontrado" }); return; }
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/users/:id — elimina un usuario
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) { res.status(404).json({ message: "Usuario no encontrado" }); return; }
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
