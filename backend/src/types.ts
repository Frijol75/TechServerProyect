/* eslint-disable @typescript-eslint/no-unused-vars */
import { IUser } from "./models/user.model";

// Extiende el objeto Request de Express para incluir la propiedad `user`
declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
  }
}

// Este archivo necesita ser un módulo para que la declaración funcione
export {};
