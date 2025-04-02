import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Image from "next/image";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tempus Capital Loan Application",
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
        <div>
          <Toaster />
        </div>
        <div className="bg-[#263469] w-screen  flex items-center relative py-4 ">
          <Image
            className="absolute left-10"
            src="/logo-light.png"
            alt="Tempus Capital"
            width={64}
            height={64}
          />
          <p className="text-white text-2xl font-bold mx-auto">
            Tempus Capital
          </p>
        </div>
        {children}
      </body>
    </html>
  );
}
