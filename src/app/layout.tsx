"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);

  useEffect(() => {
    if (prevPath !== pathname) {
      setLoading(true);
      const timeout = setTimeout(() => {
        setLoading(false);
        setPrevPath(pathname);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [pathname, prevPath]);

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {loading && <LoadingSpinner />}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
