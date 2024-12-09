import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import { Check, XCircle } from "lucide-react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "FemLux",
  description:
    "Empowering women through fashion and beauty. Your one-stop destination for all things feminine and fabulous.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                color: "#000",
                padding: "16px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                fontSize: "14px",
                maxWidth: "400px",
                border: "1px solid #eaeaea",
              },
              success: {
                style: {
                  background: "#d4edda", // light green color
                  color: "#000",
                },
                icon: (
                  <span style={{ color: "green" }}>
                    <Check size={16} />
                  </span>
                ),
              },
              error: {
                style: {
                  background: "#f8d7da", // light red color
                  color: "#000",
                },
                icon: (
                  <span style={{ color: "red" }}>
                    <XCircle size={16} />
                  </span>
                ),
              },
            }}
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}
