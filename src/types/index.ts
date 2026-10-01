import { Request } from "express";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export interface JwtPayload {
  userId: string;
  role: string;
}
