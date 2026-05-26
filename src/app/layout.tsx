import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CartProvider } from "../context/CartContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Motor-Api | Catálogo Automotivo Técnico Premium",
  description: "Catálogo automotivo premium e minimalista. Componentes mecânicos de alta performance para engenharia automotiva.",
  keywords: "automotivo, e-commerce, radiador, motor, turbo, supercharger, alta performance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-light text-brand-black">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
