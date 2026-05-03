import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NestPH — Find your place in the Philippines",
    template: "%s | NestPH",
  },
  description:
    "Browse premium property listings in Cebu City, Mandaue, Lapu-Lapu, and Talisay. Find your next home with NestPH.",
  keywords: ["real estate", "Philippines", "Cebu", "property", "for sale", "NestPH"],
  openGraph: {
    title: "NestPH — Find your place in the Philippines",
    description:
      "Browse premium property listings in Cebu City, Mandaue, Lapu-Lapu, and Talisay.",
    siteName: "NestPH",
    locale: "en_PH",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-canvas text-ink antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
