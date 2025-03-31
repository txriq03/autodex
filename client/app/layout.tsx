import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/Footer";
import Provider from "@/components/providers/Provider";

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-plex",
});

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
      <body className={`${inter.variable} font-plex antialiased dark`}>
        <Provider>
          <div className=" text-white bg-black min-h-screen flex flex-col">
            <Navbar />
            <main className=" flex-1">{children}</main>
            <Footer />
          </div>
        </Provider>
        <Toaster richColors />
      </body>
    </html>
  );
}
