import "../types";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

const JWT_SECRET: string = process.env.JWT_SECRET || "moonbloom_secret";

// ── Interfaz para el payload decodificado del JWT ─────────────────────────────
interface JwtPayload {
  id: string;
}

// ── requireAuth ───────────────────────────────────────────────────────────────
// Bloquea rutas privadas. jwt.verify() sin callback = síncrono (lanza si inválido).
// Express 5 maneja el async/await correctamente con este patrón.
export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies.jwt;
  if (!token) { res.redirect("/login"); return; }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload; // síncrono — lanza JsonWebTokenError si inválido
    const user = await User.findById(decoded.id).select("-password").lean();

    if (!user) {
      res.clearCookie("jwt");
      res.redirect("/login");
      return;
    }

    req.user = user as any;
    res.locals.user = user;
    next();
  } catch (err) {
    res.clearCookie("jwt");
    res.redirect("/login");
  }
};

// ── checkUser ─────────────────────────────────────────────────────────────────
// Enriquece res.locals.user para la navbar dinámica. No bloquea.
// jwt.verify() síncrono + async/await = compatible con Express 5.
export const checkUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies.jwt;
  res.locals.user = null;

  if (!token) { next(); return; }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload; // síncrono
    const user = await User.findById(decoded.id).select("-password").lean();
    res.locals.user = user || null;
  } catch {
    res.locals.user = null;
  }

  next();
};
