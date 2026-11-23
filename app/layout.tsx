import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MobileNavBar from "./components/MobileNavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recipe Book",
  description: "A Progressive Web App for Recipe Book",
  icons: [
      {
        url: '/cookbook-small.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-24 sm:pb-0">
        {children}
        <MobileNavBar />
      </body>
    </html>
  );
}
