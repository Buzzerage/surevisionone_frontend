import type { Metadata } from "next";
// Asumo que los archivos de fuentes se encuentran en tu proyecto
import { Geist, Geist_Mono } from "next/font/google"; 
import "./globals.css";
// ⚠️ IMPORTAR EL COMPONENTE DE TEMA
import ThemeProvider from "./components/ThemeProvider";
import { LanguageProvider } from "./context/LanguageProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arbitrage Dashboard", // Título ajustado
  description: "Dashboard para Arbitraje de Apuestas", // Descripción ajustada
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Es crucial que el <html> NO tenga el atributo data-theme aquí, 
    // ya que el ThemeProvider lo maneja de forma dinámica.
    // También cambié lang="en" por "es" o lo que necesites.
    <html lang="es">
      <body
        // Clases de fuente de Next.js
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 🚀 ENVUELVE LA APLICACIÓN CON EL PROVEEDOR DE IDIOMA Y TEMA */}
        <LanguageProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}