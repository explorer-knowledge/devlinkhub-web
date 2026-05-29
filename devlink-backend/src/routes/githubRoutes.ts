import { Router } from "express";
import passport from "passport";
import { githubLoginController } from "../controllers/githubAuthController.js";

const router = Router();

// Redirect to GitHub consent screen
router.get("/", passport.authenticate("github", { scope: ["user:email"] }));

// GitHub OAuth callback
router.get(
  "/callback",
  passport.authenticate("github", {
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:3000"}/login`,
  }),
  githubLoginController
);

export default router;
