import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "Rut - Gezinsplanner",
  description: "Eenvoudige gezinsplanner voor vetverlies",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Rut",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#4A90A4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className="bg-[#F8F9FA] text-[#2D3436] antialiased">
        <main className="pb-20 min-h-screen">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
