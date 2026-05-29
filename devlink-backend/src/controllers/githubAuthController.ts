import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "devlink_secret_signature_key_2026";

export const githubLoginController = (req: Request, res: Response): void => {
  const user = req.user as any;
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "24h" });

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  res.redirect(
    `${frontendUrl}/dashboard?token=${token}&user=${encodeURIComponent(
      JSON.stringify({
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        avatar: user.avatar,
      })
    )}`
  );
};
