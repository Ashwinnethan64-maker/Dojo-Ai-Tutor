import React from "react";
import { ToastProvider } from "@/components/ui/toast";
import { AuthProvider } from "@/contexts/auth-context";
import { LanguageProvider } from "@/contexts/language-context";
import { EditorThemeProvider } from "@/contexts/theme-context";
import { AppShell } from "@/components/dojo/app-shell";

export default function DojoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <AuthProvider>
        <EditorThemeProvider>
          <LanguageProvider>
            <AppShell>{children}</AppShell>
          </LanguageProvider>
        </EditorThemeProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
