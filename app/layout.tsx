"use client";

import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar/Sidebar"; // Import the Sidebar component
import SingUp from "../app/(main)/auth/main/page"; // Import the SignUp component

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showMain, setShowMain] = useState(false);

  useEffect(() => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      setShowMain(true);
    }
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex">
          {showMain ? (
            <>
              <Sidebar />
              <main className="flex-1 md:ml-64 p-4 mt-16 md:mt-0 bg-slate-100 min-h-screen max-h-full">
                {children}
              </main>
            </>
          ) : (
            <main className="flex-1 p-4 mt-16 md:mt-0 bg-slate-100 h-90%">
                <SingUp />
              </main>
          )}
        </div>
      </body>
    </html>
  );
}
