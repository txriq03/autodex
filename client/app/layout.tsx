import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import TanstackProvider from "@/components/providers/TanstackProvider";
import ContractProvider from "@/components/providers/ContractProvider";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/Footer";
import { HeroUIProvider } from "@heroui/system";

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
      <body className={`${inter.variable} font-sans antialiased `}>
        <HeroUIProvider>
          <TanstackProvider>
            <ContractProvider>
              <div className="dark text-white bg-black min-h-screen flex flex-col">
                <Navbar />
                <main className=" flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster richColors />
            </ContractProvider>
          </TanstackProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
