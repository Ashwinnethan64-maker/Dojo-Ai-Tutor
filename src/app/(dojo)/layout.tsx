import React from "react";
import { ToastProvider } from "@/components/ui/toast";
import { AppShell } from "@/components/dojo/app-shell";

export default function DojoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <AppShell>{children}</AppShell>
    </ToastProvider>
  );
}
