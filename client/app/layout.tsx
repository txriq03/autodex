import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import TanstackProvider from "@/components/providers/TanstackProvider";
import ContractProvider from "@/components/providers/ContractProvider";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AutoDex",
  description:
    "Decentralised platform for listing and discovering your next ride.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased bg-[#13171d] min-h-screen flex flex-col`}
      >
        <TanstackProvider>
          <ContractProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster richColors />
          </ContractProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
