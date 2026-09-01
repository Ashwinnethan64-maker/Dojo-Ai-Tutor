"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, LogOut, ArrowLeft, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DojoLogo } from "@/components/dojo/logo";
import { GeometricDecoration } from "@/components/dojo/geometric-decoration";
import { getBrowserClient } from "@/lib/supabase/client";

export default function AdminAccessDeniedPage() {
  const handleSignOut = async () => {
    const supabase = getBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Decorative Accents */}
      <div className="absolute top-10 left-10 hidden md:block">
        <GeometricDecoration variant="blob" color="pink" size="lg" rotation={15} />
      </div>
      <div className="absolute bottom-10 right-10 hidden md:block">
        <GeometricDecoration variant="star" color="yellow" size="lg" rotation={-20} />
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <DojoLogo size="lg" showText={false} priority />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-[#1E293B]">
            Admin Access Required
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] font-medium">
            Protected Platform Operations Area
          </p>
        </div>

        <Card shadowVariant="hard" className="p-6 sm:p-8 bg-white border-2 border-[#1E293B] space-y-6 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#FEE2E2] border-2 border-[#EF4444] flex items-center justify-center shadow-[3px_3px_0_#EF4444]">
            <ShieldAlert className="h-7 w-7 text-[#EF4444] stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <h2 className="font-heading font-black text-lg text-[#1E293B]">
              Authorization Incomplete
            </h2>
            <p className="text-xs text-[#64748B] leading-relaxed font-medium">
              Your authenticated account is not registered on the DOJO AI administrator allowlist. If you believe this is an error, contact your platform administrator.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link href="/dashboard" className="block">
              <Button size="lg" variant="primary" className="w-full gap-2 shadow-[4px_4px_0_#1E293B]">
                <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
                <span>Return to User Portal</span>
              </Button>
            </Link>

            <Button
              size="md"
              variant="outline"
              onClick={handleSignOut}
              className="w-full gap-2 text-xs text-[#EF4444] hover:bg-[#FEE2E2]/30"
            >
              <LogOut className="h-4 w-4 stroke-[2.5]" />
              <span>Sign Out &amp; Switch Account</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
