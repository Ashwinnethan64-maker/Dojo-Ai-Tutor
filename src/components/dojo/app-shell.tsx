"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/dojo/sidebar";
import { Header } from "@/components/dojo/header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#FFFDF5] text-[#1E293B]">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-[#1E293B]/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <Sidebar className="relative z-10 w-72 shadow-[6px_0_0_#1E293B]" />
        </div>
      )}

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-8 bg-dojo-dots">
          {children}
        </main>
      </div>
    </div>
  );
}
