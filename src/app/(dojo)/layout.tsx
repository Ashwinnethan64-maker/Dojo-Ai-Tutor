import React from "react";
import { ToastProvider } from "@/components/ui/toast";
import { LanguageProvider } from "@/contexts/language-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { AppShell } from "@/components/dojo/app-shell";

export default function DojoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AppShell>{children}</AppShell>
        </LanguageProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}
