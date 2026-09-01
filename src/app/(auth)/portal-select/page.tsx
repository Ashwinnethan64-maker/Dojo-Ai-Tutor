"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Shield,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DojoLogo } from "@/components/dojo/logo";
import { GeometricDecoration } from "@/components/dojo/geometric-decoration";
import { getBrowserClient } from "@/lib/supabase/client";
import { isAdminUser } from "@/lib/auth/admin";

export default function PortalSelectPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const supabase = getBrowserClient();
    if (!supabase) {
      setIsAdmin(true); // default safe view in disconnected mode
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        router.push("/login");
        return;
      }
      setUserEmail(data.user.email || "");
      const hasAdmin = isAdminUser(data.user);
      if (!hasAdmin) {
        // Regular user directly directed to dashboard
        router.replace("/dashboard");
      } else {
        setIsAdmin(true);
      }
    });
  }, [router]);

  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-[#8B5CF6] border-t-transparent animate-spin" />
          <p className="font-heading font-bold text-sm text-[#1E293B]">Authenticating Portal Permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-8 relative">
      {/* Decorative Geometric Accents */}
      <div className="absolute -top-6 -right-6 hidden sm:block">
        <GeometricDecoration variant="star" color="mint" size="lg" rotation={-20} />
      </div>
      <div className="absolute -bottom-6 -left-6 hidden sm:block">
        <GeometricDecoration variant="blob" color="yellow" size="lg" rotation={15} />
      </div>

      {/* Brand Header */}
      <div className="text-center space-y-3">
        <div className="flex justify-center mb-2">
          <DojoLogo size="lg" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/30">
          <Sparkles className="h-3.5 w-3.5 text-[#8B5CF6]" />
          <span className="text-xs font-heading font-bold text-[#8B5CF6]">
            Verified Administrator: {userEmail}
          </span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-[#1E293B]">
          Welcome to DOJO AI
        </h1>
        <p className="text-sm text-[#64748B] font-medium max-w-md mx-auto">
          Choose your operating environment to continue your session.
        </p>
      </div>

      {/* Portal Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* User Portal Card */}
        <Link href="/dashboard" className="block group">
          <Card
            hoverable
            shadowVariant="hard"
            className="p-6 h-full bg-white border-2 border-[#1E293B] flex flex-col justify-between space-y-6 transition-all"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6] border-2 border-[#1E293B] flex items-center justify-center shadow-[3px_3px_0_#1E293B]">
                <GraduationCap className="h-6 w-6 text-white stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <Badge variant="purple">Learner Arena</Badge>
                <h3 className="font-heading text-xl font-black text-[#1E293B] group-hover:text-[#8B5CF6] transition-colors">
                  Enter DOJO Portal
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed font-medium">
                  Access interactive Python workouts, spaced repetition flashcards, Sensei AI hints, and belt progression.
                </p>
              </div>
            </div>

            <Button variant="primary" className="w-full justify-between shadow-[3px_3px_0_#1E293B]">
              <span>Launch DOJO</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </Button>
          </Card>
        </Link>

        {/* Admin Portal Card */}
        <Link href="/admin" className="block group">
          <Card
            hoverable
            shadowVariant="yellow"
            className="p-6 h-full bg-[#1E293B] border-2 border-[#1E293B] text-white flex flex-col justify-between space-y-6 transition-all"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FBBF24] border-2 border-[#1E293B] flex items-center justify-center shadow-[3px_3px_0_#1E293B]">
                <Shield className="h-6 w-6 text-[#1E293B] stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <Badge variant="warning">Content Ops</Badge>
                <h3 className="font-heading text-xl font-black text-white group-hover:text-[#FBBF24] transition-colors">
                  Enter Admin Portal
                </h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed font-medium">
                  Curate and approve AI-generated workouts, inspect test suite telemetry, and manage curriculum modules.
                </p>
              </div>
            </div>

            <Button variant="yellow" className="w-full justify-between shadow-[3px_3px_0_#0F172A]">
              <span>Launch Admin</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </Button>
          </Card>
        </Link>
      </div>
    </div>
  );
}
