import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/toaster";

export const metadata: Metadata = {
  title: {
    default: "Ideal Visa Tour | International Tours & Visa Support",
    template: "%s | Ideal Visa Tour",
  },
  description:
    "Curated international tour packages with end-to-end visa support — Türkiye, Dubai, Malaysia, Thailand, Maldives, and beyond.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
