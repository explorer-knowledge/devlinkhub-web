"use client";

import React, { Suspense } from "react";
import { useSearchParams, redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

// This page previously held a mock auth flow.
// Auth is now handled by Firebase at /signin and /join.
// This route only remains to catch deep-links with ?type=event|pitch|profile
// and redirect them appropriately.

function CommunitySigninContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { firebaseUser, loading } = useAuth();

  const type = searchParams.get("type") || "signin";

  useEffect(() => {
    if (loading) return;

    // Auth types → redirect to real auth pages
    if (type === "signin" || type === "signup" || type === "join") {
      router.replace("/signin");
      return;
    }

    // Profile type → redirect to onboarding
    if (type === "profile") {
      router.replace("/onboarding");
      return;
    }

    // Gated action types — require login
    if (!firebaseUser) {
      const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
      router.replace(`/signin?redirect=${returnTo}`);
      return;
    }

    // If authenticated with event/pitch type → redirect to community with params preserved
    router.replace(`/community?${searchParams.toString()}`);
  }, [loading, firebaseUser, type, router, searchParams]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs">
      Redirecting...
    </div>
  );
}

export default function CommunitySigninPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs">
        Loading...
      </div>
    }>
      <CommunitySigninContent />
    </Suspense>
  );
}
