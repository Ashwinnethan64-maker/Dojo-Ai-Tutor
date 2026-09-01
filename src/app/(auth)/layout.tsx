import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-[#FFFDF5] bg-dojo-dots relative overflow-x-hidden">
      <main className="w-full flex items-center justify-center my-auto">
        {children}
      </main>
    </div>
  );
}
