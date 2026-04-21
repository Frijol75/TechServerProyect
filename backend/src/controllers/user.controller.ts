import { Request, Response } from "express";
import User from "../models/user.model";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const users = await User.find();
  res.json(users);
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error("Usuario no encontrado"); }
  res.json(user);
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const user = new User(req.body);
  const savedUser = await user.save();
  res.status(201).json(savedUser);
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after", runValidators: true });
  if (!updated) { res.status(404); throw new Error("Usuario no encontrado"); }
  res.json(updated);
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const deleted = await User.findByIdAndDelete(req.params.id);
  if (!deleted) { res.status(404); throw new Error("Usuario no encontrado"); }
  res.json({ message: "Usuario eliminado correctamente" });
};
