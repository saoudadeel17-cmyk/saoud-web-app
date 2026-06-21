import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAQR Persian Heritage Exports",
  description: "Persian rugs, Arabian mats, and handmade traditional exports.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}