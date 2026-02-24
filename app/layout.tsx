import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Port Clinton Athletic Boosters",
  description:
    "Supporting Port Clinton student-athletes. One Town. One Team.",
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
