import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "devlink_secret_signature_key_2026";

export interface AuthRequest extends Request {
  user?: { userId: string };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Token required" });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: "Invalid token" });
      return;
    }
    req.user = decoded as { userId: string };
    next();
  });
};
