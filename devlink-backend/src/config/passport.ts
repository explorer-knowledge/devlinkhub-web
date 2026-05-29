import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GithubStrategy } from "passport-github2";
import prisma from "../db/prismaInstance.js";

export function configurePassport(): void {
  // ─── Google Strategy ─────────────────────────────────────────────────────────
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "/api/auth/google/callback",
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            let user = await prisma.user.findFirst({
              where: {
                OR: [
                  { email: profile.emails?.[0]?.value || "" },
                  { providerId: profile.id, provider: "google" },
                ],
              },
            });

            if (user) {
              if (!user.providerId) {
                user = await prisma.user.update({
                  where: { id: user.id },
                  data: {
                    providerId: profile.id,
                    provider: "google",
                    avatar: profile.photos?.[0]?.value,
                  },
                });
              }
              return done(null, user);
            }

            const emailBase = profile.emails?.[0]?.value?.split("@")[0] || profile.id;
            user = await prisma.user.create({
              data: {
                email: profile.emails?.[0]?.value || `${profile.id}@google.local`,
                firstName: profile.name?.givenName,
                lastName: profile.name?.familyName,
                name: profile.displayName,
                username: `${emailBase}_${profile.id.slice(-4)}`,
                providerId: profile.id,
                provider: "google",
                avatar: profile.photos?.[0]?.value,
                role: "Fullstack Developer",
                skills: "[]",
              },
            });
            return done(null, user);
          } catch (error) {
            return done(error as Error);
          }
        }
      )
    );
  } else {
    console.warn("⚠️  Google OAuth is disabled — GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set.");
  }

  // ─── GitHub Strategy ─────────────────────────────────────────────────────────
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(
      new GithubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: "/api/auth/github/callback",
        },
        async (_accessToken: string, _refreshToken: string, profile: any, done: any) => {
          try {
            let user = await prisma.user.findFirst({
              where: {
                OR: [
                  profile.emails?.[0]?.value
                    ? { email: profile.emails[0].value }
                    : undefined,
                  { providerId: profile.id, provider: "github" },
                ].filter(Boolean) as any,
              },
            });

            if (user) {
              if (!user.providerId) {
                user = await prisma.user.update({
                  where: { id: user.id },
                  data: {
                    providerId: profile.id,
                    provider: "github",
                    avatar: profile.photos?.[0]?.value,
                  },
                });
              }
              return done(null, user);
            }

            const nameParts = (profile.displayName || profile.username || "").split(" ");
            user = await prisma.user.create({
              data: {
                email: profile.emails?.[0]?.value || `${profile.username}@github.local`,
                firstName: nameParts[0] || profile.username,
                lastName: nameParts.slice(1).join(" ") || "",
                name: profile.displayName || profile.username,
                username: profile.username,
                providerId: profile.id,
                provider: "github",
                avatar: profile.photos?.[0]?.value,
                githubUrl: profile.profileUrl || "",
                role: "Fullstack Developer",
                skills: "[]",
              },
            });
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  } else {
    console.warn("⚠️  GitHub OAuth is disabled — GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET not set.");
  }

  // ─── Serialization ───────────────────────────────────────────────────────────
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}
