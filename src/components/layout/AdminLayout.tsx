"use client";

import React from "react";
import AdminBottomNavbar from "@/components/shared/AdminBottomNavbar";
import AdminSidebar from "@/components/shared/AdminSidebar";
import { AnimatePresence, motion } from "framer-motion";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-background space-x-4">
      <AdminSidebar />
      <main className="md:pl-[80px] lg:pl-[240px] pt-6 pb-20 md:pb-6 px-2 md:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <AdminBottomNavbar />
    </div>
  );
};

export default AdminLayout;
