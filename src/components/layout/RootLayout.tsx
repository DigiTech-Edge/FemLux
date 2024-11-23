"use client";

import React from "react";
import BottomNavbar from "../shared/BottomNavbar";
import Footer from "../shared/Footer";
import { Toaster } from "react-hot-toast";
import TopNavbar from "../shared/TopNavbar";

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  // Temporary mock auth state until Appwrite integration
  const isAuthenticated = false;
  const user = null;

  return (
    <div className="min-h-screen flex flex-col">
      <TopNavbar isAuthenticated={isAuthenticated} user={user} />
      <main className="flex-grow container mx-auto px-4 pb-20 sm:pb-0">
        {children}
      </main>
      <Footer />
      <BottomNavbar isAuthenticated={isAuthenticated} />
      <Toaster position="top-center" />
    </div>
  );
};

export default RootLayout;
