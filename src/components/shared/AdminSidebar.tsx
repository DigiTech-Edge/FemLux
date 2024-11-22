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
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="hidden md:flex flex-col h-screen bg-white dark:bg-black border-r border-divider fixed left-0 top-0 w-[80px] lg:w-[240px]"
    >
      <div className="p-6 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center items-center"
        >
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
        </motion.div>

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
            <motion.div
              key={route.path}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full"
            >
              <Link href={route.path} className="block">
                <Button
                  className={`w-full min-w-0 h-11 md:justify-center lg:justify-start gap-3 px-3 ${
                    isActive ? "bg-pink-500 text-white hover:bg-pink-600" : ""
                  }`}
                  variant={isActive ? "solid" : "light"}
                  startContent={
                    <route.icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        isActive ? "text-white" : "text-default-500"
                      }`}
                    />
                  }
                >
                  <span
                    className={`text-base truncate md:hidden lg:block ${
                      isActive ? "text-white" : "text-default-700"
                    }`}
                  >
                    {route.name}
                  </span>
                </Button>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <div className="px-2 pb-4">
        <Divider className="mb-4" />
        <div className="space-y-2">
          <Link href="/" className="block">
            <Button
              className="w-full min-w-0 h-11 md:justify-center lg:justify-start gap-3 bg-blue-500 text-white hover:bg-blue-600"
              variant="flat"
              startContent={<Home className="w-5 h-5 flex-shrink-0" />}
            >
              <span className="truncate md:hidden lg:block">Back to Site</span>
            </Button>
          </Link>
          <Button
            className="w-full min-w-0 h-11 md:justify-center lg:justify-start gap-3 hover:bg-danger/10"
            variant="flat"
            color="danger"
            startContent={<LogOut className="w-5 h-5 flex-shrink-0" />}
          >
            <span className="truncate md:hidden lg:block">Logout</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSidebar;
