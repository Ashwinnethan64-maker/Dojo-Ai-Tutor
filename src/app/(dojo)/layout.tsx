import React from "react";
import { ToastProvider } from "@/components/ui/toast";
import { LanguageProvider } from "@/contexts/language-context";
import { AppShell } from "@/components/dojo/app-shell";

export default function DojoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <LanguageProvider>
        <AppShell>{children}</AppShell>
      </LanguageProvider>
    </ToastProvider>
  );
}
