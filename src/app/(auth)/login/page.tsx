"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, User, Shield, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { getSiteUrl } from "@/lib/supabase/url";
import { GeometricDecoration } from "@/components/dojo/geometric-decoration";
import { DojoLogo } from "@/components/dojo/logo";

export type PortalType = "user" | "admin";

function LoginForm() {
  const [selectedPortal, setSelectedPortal] = useState<PortalType>("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      if (errorParam === "auth-callback-failed") {
        setErrorMsg("Authentication exchange timed out or was cancelled. Please try again.");
      } else {
        setErrorMsg(decodeURIComponent(errorParam));
      }
    }

    const portalParam = searchParams.get("portal");
    if (portalParam === "admin") {
      setSelectedPortal("admin");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data?.user) {
        if (selectedPortal === "admin") {
          // Verify admin authorization server-side through router navigation to /admin (middleware guards)
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      if (err?.message?.includes("Missing Supabase environment variables")) {
        setErrorMsg("Production Setup Required: Supabase credentials (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY) must be added in your Vercel Project Settings.");
      } else {
        router.push(selectedPortal === "admin" ? "/admin" : "/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setErrorMsg(null);
    try {
      const supabase = createClient();
      // Pass the selected portal safely into the OAuth callback query param
      const baseSite = getSiteUrl().replace(/\/+$/, "");
      const redirectTo = `${baseSite}/auth/callback?portal=${selectedPortal}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setIsGoogleLoading(false);
      }
    } catch (err: any) {
      if (err?.message?.includes("Missing Supabase environment variables")) {
        setErrorMsg("Production Setup Required: Supabase credentials (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY) must be added in your Vercel Project Settings.");
      } else {
        setErrorMsg(err?.message || "Failed to launch Google authentication.");
      }
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 relative">
      {/* Playful Floating Geometric Accents */}
      <div className="absolute -top-6 -right-6 hidden sm:block">
        <GeometricDecoration variant="star" color="yellow" size="lg" rotation={20} />
      </div>
      <div className="absolute -bottom-6 -left-6 hidden sm:block">
        <GeometricDecoration variant="blob" color="pink" size="md" />
      </div>

      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-block group">
          <DojoLogo size="xl" showText={false} priority />
        </Link>
        <h1 className="font-heading text-3xl font-black tracking-tight text-[#1E293B]">
          Enter the DOJO
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] font-medium">
          Sign in to resume your adaptive programming workouts
        </p>
      </div>

      <Card shadowVariant="hard" className="p-6 sm:p-8 bg-white">
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl border-2 border-[#EF4444] bg-[#FFFDF5] text-xs font-bold text-[#EF4444] shadow-[2px_2px_0_#EF4444]">
            {errorMsg}
          </div>
        )}

        {/* 1. CHOOSE YOUR PORTAL SELECTOR */}
        <div className="space-y-2 mb-6">
          <span className="text-[10px] font-heading font-black uppercase tracking-wider text-[#64748B] block text-center">
            Choose Your Portal
          </span>

          <div className="grid grid-cols-2 gap-3">
            {/* User Portal Option */}
            <button
              type="button"
              onClick={() => setSelectedPortal("user")}
              className={`p-3.5 rounded-2xl border-2 transition-all text-left flex flex-col justify-between cursor-pointer select-none ${
                selectedPortal === "user"
                  ? "bg-[#8B5CF6] text-white border-[#1E293B] shadow-[4px_4px_0_#1E293B] -translate-y-0.5 ring-2 ring-[#8B5CF6]/30"
                  : "bg-[#FFFDF5] text-[#1E293B] border-[#1E293B] shadow-[2px_2px_0_#1E293B] hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 border-[#1E293B] ${
                  selectedPortal === "user" ? "bg-white text-[#8B5CF6]" : "bg-[#FBBF24] text-[#1E293B]"
                }`}>
                  <User className="h-3.5 w-3.5 stroke-[2.5]" />
                </div>
                {selectedPortal === "user" && <CheckCircle2 className="h-4 w-4 text-white stroke-[3]" />}
              </div>
              <span className="font-heading font-black text-xs block leading-tight">
                User Portal
              </span>
              <span className={`text-[10px] block leading-tight mt-0.5 ${
                selectedPortal === "user" ? "text-white/80 font-normal" : "text-[#64748B] font-medium"
              }`}>
                Student training
              </span>
            </button>

            {/* Admin Portal Option */}
            <button
              type="button"
              onClick={() => setSelectedPortal("admin")}
              className={`p-3.5 rounded-2xl border-2 transition-all text-left flex flex-col justify-between cursor-pointer select-none ${
                selectedPortal === "admin"
                  ? "bg-[#8B5CF6] text-white border-[#1E293B] shadow-[4px_4px_0_#1E293B] -translate-y-0.5 ring-2 ring-[#8B5CF6]/30"
                  : "bg-[#FFFDF5] text-[#1E293B] border-[#1E293B] shadow-[2px_2px_0_#1E293B] hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 border-[#1E293B] ${
                  selectedPortal === "admin" ? "bg-white text-[#8B5CF6]" : "bg-[#FBBF24] text-[#1E293B]"
                }`}>
                  <Shield className="h-3.5 w-3.5 stroke-[2.5]" />
                </div>
                {selectedPortal === "admin" && <CheckCircle2 className="h-4 w-4 text-white stroke-[3]" />}
              </div>
              <span className="font-heading font-black text-xs block leading-tight">
                Admin Portal
              </span>
              <span className={`text-[10px] block leading-tight mt-0.5 ${
                selectedPortal === "admin" ? "text-white/80 font-normal" : "text-[#64748B] font-medium"
              }`}>
                Platform admin
              </span>
            </button>
          </div>
        </div>

        {/* 2. GOOGLE AUTHENTICATION CTA */}
        <Button
          variant="secondary"
          size="lg"
          onClick={handleGoogleLogin}
          isLoading={isGoogleLoading}
          className="w-full justify-center gap-3 bg-white text-[#1E293B] border-2 border-[#1E293B] shadow-[4px_4px_0_#1E293B] hover:bg-[#FBBF24] transition-all text-sm mb-6"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </Button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-[#1E293B]/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-[#94A3B8] font-heading font-bold text-[10px]">
              Or with email password
            </span>
          </div>
        </div>

        {/* 3. EMAIL/PASSWORD FORM */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-heading font-bold text-[#1E293B]">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="warrior@dojo.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-heading font-bold text-[#1E293B]">
                Password
              </label>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full justify-center gap-2 shadow-[4px_4px_0_#1E293B] text-sm"
          >
            <span>Sign In to {selectedPortal === "admin" ? "Admin Portal" : "User Portal"}</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t-2 border-[#1E293B]/10 text-center">
          <p className="text-xs font-medium text-[#64748B]">
            Need a learner account?{" "}
            <Link
              href="/signup"
              className="font-heading font-bold text-[#8B5CF6] hover:underline"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md p-8 text-center text-xs font-bold text-[#64748B]">
          Loading DOJO authentication...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
