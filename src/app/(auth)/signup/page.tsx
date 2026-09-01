"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { GeometricDecoration } from "@/components/dojo/geometric-decoration";
import { DojoLogo } from "@/components/dojo/logo";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setErrorMsg(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        router.push("/dashboard");
      }
    } catch {
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    setErrorMsg(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
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
      setErrorMsg(err?.message || "Failed to launch Google sign-up.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 relative">
      {/* Playful Floating Geometric Accents */}
      <div className="absolute -top-6 -right-6 hidden sm:block">
        <GeometricDecoration variant="star" color="mint" size="lg" rotation={-15} />
      </div>
      <div className="absolute -bottom-6 -left-6 hidden sm:block">
        <GeometricDecoration variant="blob" color="yellow" size="md" />
      </div>

      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-block group">
          <DojoLogo size="xl" showText={false} priority />
        </Link>
        <h1 className="font-heading text-3xl font-black tracking-tight text-[#1E293B]">
          Begin Your Training
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] font-medium">
          Join DOJO AI to build true algorithmic problem-solving mastery
        </p>
      </div>

      <Card shadowVariant="hard" className="p-6 sm:p-8 bg-white">
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl border-2 border-[#EF4444] bg-[#FFFDF5] text-xs font-bold text-[#EF4444] shadow-[2px_2px_0_#EF4444]">
            {errorMsg}
          </div>
        )}

        {/* Primary Google Sign Up Button */}
        <Button
          type="button"
          variant="secondary"
          isLoading={isGoogleLoading}
          onClick={handleGoogleSignup}
          className="w-full text-xs py-3 gap-2.5 shadow-[4px_4px_0_#1E293B] mb-5 font-heading font-bold"
        >
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
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
          <span>Sign up with Google</span>
        </Button>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-[#1E293B]/20" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-white px-3 font-heading font-bold text-[#64748B]">
              Or create with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <Input
            label="Full Name / Handle"
            type="text"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. Ashwin Coder"
          />

          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ashwin@example.com"
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
          />

          <Button type="submit" variant="primary" isLoading={isLoading} className="w-full gap-2 shadow-[4px_4px_0_#1E293B] text-sm py-3 mt-2">
            <span>Create Free Dojo Account</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </Button>
        </form>

        <p className="mt-6 text-center text-xs font-medium text-[#64748B]">
          Already have an account?{" "}
          <Link href="/login" className="font-heading font-black text-[#8B5CF6] hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#FFFDF5] bg-dojo-dots">
      <Suspense fallback={
        <div className="w-10 h-10 rounded-full border-4 border-[#1E293B] border-t-[#8B5CF6] animate-spin" />
      }>
        <SignupForm />
      </Suspense>
    </div>
  );
}
