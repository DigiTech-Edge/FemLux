"use client";

import { adminRoutes } from "@/lib/routes";
import { Button, Divider, Tooltip } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Info, LogOut, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex flex-col h-screen bg-white dark:bg-black border-r border-divider fixed left-0 top-0 w-[80px] lg:w-[240px]">
      <div className="p-6 flex flex-col items-center">
        <div className="flex justify-center items-center lg:hidden">
          <Tooltip
            content={
              <div className="px-2 py-1">
                <Image
                  src="/logo.png"
                  alt="FemLux Logo"
                  width={120}
                  height={40}
                  className="mx-auto"
                />
                <p className="font-medium">admin@femlux.com</p>
                <p className="text-tiny text-default-500">Administrator</p>
              </div>
            }
            placement="right"
          >
            <Info className="w-8 h-8 text-default-400" />
          </Tooltip>
        </div>

        <div className="md:hidden lg:block">
          <Image
            src="/logo.png"
            alt="FemLux Logo"
            width={120}
            height={40}
            className="mx-auto"
          />
          <div className="mt-4 text-center">
            <p className="font-medium">admin@femlux.com</p>
            <p className="text-sm text-default-500">Administrator</p>
          </div>
        </div>
      </div>

      <Divider className="my-4" />

      <nav className="flex-1 px-2 space-y-2 overflow-hidden">
        {adminRoutes.map((route) => {
          const isActive = pathname === route.path;
          return (
            <Link
              key={route.path}
              href={route.path}
              className={`relative flex items-center h-11 ${
                isActive ? "text-pink-500" : "text-foreground/70 hover:text-foreground"
              }`}
            >
              <div className="flex items-center w-full px-3 gap-3">
                <route.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-base truncate md:hidden lg:block">
                  {route.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-tab"
                    className="absolute left-0 top-0 h-full w-1 bg-pink-500"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="px-2 pb-4">
        <Divider className="mb-4" />
        <div className="flex flex-col gap-2">
          <Link href="/" className="block">
            <Button
              className={`
                w-full min-w-0 h-11 md:justify-center lg:justify-start gap-3 
                bg-gradient-to-r from-blue-500/10 to-blue-500/5 hover:from-blue-500/20 hover:to-blue-500/10
                text-blue-600 dark:text-blue-400
                transition-all duration-200
                group
              `}
              variant="flat"
              startContent={
                <Home className="w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
              }
            >
              <span className="truncate md:hidden lg:block font-medium">Back to Site</span>
            </Button>
          </Link>
          <Button
            className={`
              w-full min-w-0 h-11 md:justify-center lg:justify-start gap-3
              bg-gradient-to-r from-danger/10 to-danger/5 hover:from-danger/20 hover:to-danger/10
              text-danger dark:text-danger-400
              transition-all duration-200
              group
            `}
            variant="flat"
            startContent={
              <LogOut className="w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
            }
          >
            <span className="truncate md:hidden lg:block font-medium">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
