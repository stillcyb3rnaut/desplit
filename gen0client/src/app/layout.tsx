import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers"; // Import headers to get cookies (for server-side)
import ContextProvider from "@/context";
import { AppProvider } from "@/context/AppContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "desplit",
  description: "Split and settle onchain",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Getting cookies from the request headers (server-side)
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Setting custom favicon */}
        <link
          rel="icon"
          href="https://res.cloudinary.com/dde0qo4wb/image/upload/v1738333193/desplit/qv8sesx6c9x2sm5qlqei.png"
        />

        {/* Wrapping the children with ContextProvider and AppProvider */}
        <ContextProvider cookies={cookies}>
          <AppProvider>{children}</AppProvider>
        </ContextProvider>
      </body>
    </html>
  );
}
