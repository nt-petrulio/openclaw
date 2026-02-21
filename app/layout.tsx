import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const mono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenClaw",
  description: "Nazartsio's personal ops hub",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${mono.className} bg-black`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
