import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MainSidebar } from "@/components/main-sidebar";
import { LearningDataProvider } from "@/lib/mock-data-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Learning Tracker",
  description: "Track your mastery-based learning paths",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LearningDataProvider>
          <div className="flex h-screen overflow-hidden">
            <MainSidebar />
            {children}
          </div>
        </LearningDataProvider>
      </body>
    </html>
  );
}
