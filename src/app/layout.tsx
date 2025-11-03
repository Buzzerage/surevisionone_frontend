import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/arbitrages.css";
import ThemeProvider from "@/providers/ThemeProvider";
import LanguageProvider from "@/providers/LanguageProvider";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SureVision - Arbitraje Deportivo",
  description: "Encuentra oportunidades de arbitraje deportivo en tiempo real.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 👇 PROVIDER GLOBAL */}
        <ThemeProvider>
          <LanguageProvider>
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
