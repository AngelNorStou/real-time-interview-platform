import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Interview Platform",
  description: "Real-time interview platform",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="bg-white shadow-sm">
            <Navbar />
          </div>

          <div className="bg-gradient-to-br from-blue-900 via-slate-800 to-cyan-900 min-h-screen">
            <main className="mx-auto w-full px-3 py-6">{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}