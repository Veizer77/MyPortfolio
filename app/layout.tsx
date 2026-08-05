import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-izzat.vercel.app"),
  title: {
    default: "Muhammad Izzat Farahidi — Portfolio",
    template: "%s",
  },
  description: "Portfolio of Muhammad Izzat Farahidi — Software Engineer & AI Enthusiast",
  icons: {
    icon: "/assets/zet.png",
    shortcut: "/assets/zet.png",
    apple: "/assets/zet.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
