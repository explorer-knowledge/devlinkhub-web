import { Router } from "express";
import passport from "passport";
import { googleLoginController } from "../controllers/googleAuthController.js";

const router = Router();

// Redirect to Google consent screen
router.get("/", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth callback
router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:3000"}/login`,
  }),
  googleLoginController
);

export default router;
