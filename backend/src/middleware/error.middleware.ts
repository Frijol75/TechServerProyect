import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

// Middleware global de manejo de errores
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Error interno del servidor";
  let errors = null;

  // Manejo de errores de validación de Mongoose
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Error de validación de datos";
    errors = Object.values(err.errors).map(val => val.message);
  }

  // Manejo de IDs inválidos (CastError)
  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Formato de ID inválido: ${err.value}`;
  }

  // Manejo de duplicados de MongoDB (ej. email en User)
  if (err.code === 11000) {
    statusCode = 400;
    message = "El registro ya existe (campo duplicado)";
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    // Solo enviamos el stack en desarrollo
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
