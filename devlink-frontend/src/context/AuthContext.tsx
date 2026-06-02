"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "@/utils/firebase";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  /** Raw Firebase user object — null if not signed in */
  firebaseUser: User | null;
  /** Local Prisma user data returned by /api/auth/sync */
  localUser: LocalUser | null;
  /** True while the initial auth state is being determined */
  loading: boolean;
  /** Call after any Firebase sign-in to sync with the backend */
  syncWithBackend: (extraData?: Record<string, string>) => Promise<void>;
  /** Signs out of Firebase and clears local state */
  logout: () => Promise<void>;
  /** Get the current Firebase ID token (auto-refreshed) */
  getToken: () => Promise<string | null>;
}

interface LocalUser {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar: string | null;
  role: string;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [localUser, setLocalUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);

  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:10000";

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const getToken = async (): Promise<string | null> => {
    try {
      return (await auth.currentUser?.getIdToken()) ?? null;
    } catch {
      return null;
    }
  };

  const syncWithBackend = async (extraData?: Record<string, string>) => {
    const token = await getToken();
    if (!token) return;

    try {
      const res = await fetch(`${BACKEND}/api/auth/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(extraData || {}),
      });
      if (res.ok) {
        const data = await res.json();
        setLocalUser(data.user);
      }
    } catch (err) {
      console.error("Backend sync failed:", err);
    }
  };

  const logout = async () => {
    const token = await getToken();
    if (token) {
      // Tell backend to revoke Firebase refresh tokens
      await fetch(`${BACKEND}/api/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    await signOut(auth);
    setLocalUser(null);
  };

  // ── Subscribe to Firebase auth state ─────────────────────────────────────────

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (user) {
        // Sync with backend on page load / token refresh
        await syncWithBackend();
      } else {
        setLocalUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{ firebaseUser, localUser, loading, syncWithBackend, logout, getToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
