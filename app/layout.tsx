import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Port Clinton Athletic Boosters",
    template: "%s | PC Athletic Boosters",
  },
  description:
    "Supporting Port Clinton student-athletes. One Town. One Team.",
  openGraph: {
    siteName: "Port Clinton Athletic Boosters",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800 antialiased selection:bg-pc-red selection:text-white">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
