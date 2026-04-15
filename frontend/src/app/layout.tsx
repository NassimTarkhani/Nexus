import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/src/lib/hooks/useTheme";
import { DevTools } from "@/src/components/DevTools";
import { BackgroundAnimations } from "@/src/components/BackgroundAnimations";
import { ApiKeysSyncer } from "@/src/components/ApiKeysSyncer";
import AuthInitializer from "@/src/components/AuthInitializer";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NEXUS | AI Workspace",
  description: "Advanced AI Chat and Workflow Orchestration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <BackgroundAnimations />
          <AuthInitializer />
          <ApiKeysSyncer />
          <DevTools />
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
