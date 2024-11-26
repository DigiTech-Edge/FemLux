"use client";

import React from "react";
import BottomNavbar from "../shared/BottomNavbar";
import Footer from "../shared/Footer";
import TopNavbar from "../shared/TopNavbar";

interface RootLayoutProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

const RootLayout = ({ children, isAuthenticated }: RootLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNavbar isAuthenticated={isAuthenticated} />
      <main className="flex-grow container mx-auto px-4 pb-20 sm:pb-0">
        {children}
      </main>
      <Footer />
      <BottomNavbar isAuthenticated={isAuthenticated} />
    </div>
  );
};

export default RootLayout;
