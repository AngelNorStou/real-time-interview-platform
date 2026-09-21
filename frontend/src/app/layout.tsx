import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ToastProvider } from "@/components/toast-provider";

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
          <ToastProvider>
            <div
              className="min-h-screen bg-[#08162b]"
              style={{
                backgroundImage:
                  "radial-gradient(60% 55% at 0% 0%, rgba(37,99,235,0.30) 0%, transparent 70%), radial-gradient(55% 50% at 100% 100%, rgba(6,182,212,0.22) 0%, transparent 70%)",
                backgroundAttachment: "fixed",
              }}
            >
              <div className="sticky top-0 z-50">
                <Navbar />
              </div>
              <main className="mx-auto w-full px-3 py-6">{children}</main>
            </div>
          </ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}