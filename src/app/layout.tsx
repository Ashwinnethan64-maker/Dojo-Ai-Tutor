import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DOJO AI — Practice. Learn. Master.",
  description:
    "AI-powered coding workouts that help you practice programming, learn from your mistakes, and build lasting coding skills.",
  icons: {
    icon: [
      { url: "/Dojo_ai.ico", sizes: "any" },
    ],
    shortcut: "/Dojo_ai.ico",
    apple: "/Dojo_ai.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#8B5CF6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/Dojo_ai.ico" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#FFFDF5] text-[#1E293B]">
        {children}
      </body>
    </html>
  );
}
