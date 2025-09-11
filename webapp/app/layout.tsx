import React from "react";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import { GoogleAnalytics } from "@next/third-parties/google"

import Header from "../components/Header";
import './globals.css'

export const metadata: Metadata = {
  title: "Next Hat - Nanocl Registry",
  description: "Collections of production-ready to use Statefiles for Nanocl to deploy in seconds.",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/public/favicon.png" />
      </head>
      <body className={`bg-secondary font-sans antialiased text-foreground min-h-screen flex flex-col ${fontSans.variable}`}>
        <Header />
        <main className="max-w-[1024px] mx-auto px-4 py-6">{children}</main>
      </body>
      <GoogleAnalytics gaId="G-PE9F5EFX1D" />
    </html>
  );
}
