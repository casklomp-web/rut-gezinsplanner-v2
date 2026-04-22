import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/layout/BottomNav";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { ToastProvider } from "@/components/ui/Toast";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { Providers } from "@/components/providers";
import { KeyboardShortcutsProvider } from "@/components/providers/KeyboardShortcutsProvider";
import { PWAInstallPrompt } from "@/components/ui/PWAInstallPrompt";
import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "Rut - Gezinsplanner",
  description: "Eenvoudige gezinsplanner voor vetverlies",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Rut",
  },
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192' },
      { url: '/icon-512x512.png', sizes: '512x512' },
    ],
    apple: [
      { url: '/icon-192x192.png' },
    ],
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
      <head>
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className="bg-[#F8F9FA] dark:bg-gray-900 text-[#2D3436] dark:text-gray-100 antialiased transition-colors">
        <Providers>
          <KeyboardShortcutsProvider>
            <ErrorBoundary>
              <ToastProvider>
                <AuthProvider>
                  <div className="lg:flex lg:min-h-screen">
                    <SidebarNav />
                    <main className="flex-1 pb-20 lg:pb-0 lg:ml-64 w-full">
                      <div className="w-full lg:max-w-5xl xl:max-w-6xl lg:px-8 xl:px-12">
                        {children}
                      </div>
                    </main>
                  </div>
                  <BottomNav />
                  <PWAInstallPrompt />
                </AuthProvider>
              </ToastProvider>
            </ErrorBoundary>
          </KeyboardShortcutsProvider>
        </Providers>
      </body>
    </html>
  );
}
