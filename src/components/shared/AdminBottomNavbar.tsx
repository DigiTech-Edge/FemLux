"use client";

import { adminRoutes } from "@/lib/routes";
import { logout } from "@/services/actions/auth.actions";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { MoreVertical, LogOut, Home } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

const AdminBottomNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/70 backdrop-blur-md border-t z-50">
      <div className="flex items-center justify-around h-full px-2">
        {adminRoutes.map((route) => {
          const isActive = pathname === route.path;

          return (
            <Link
              key={route.path}
              href={route.path}
              className={`relative flex flex-col items-center justify-center w-16 h-full ${
                isActive
                  ? "text-pink-500"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              <div className="flex flex-col items-center">
                <route.icon className="w-5 h-5" />
                <span className="text-xs mt-1 max-[500px]:hidden">
                  {route.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="bottom-tab"
                    className="absolute -bottom-[1px] left-0 right-0 h-1 bg-pink-500"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </div>
            </Link>
          );
        })}

        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly variant="light" className="w-16 h-full">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Admin actions" closeOnSelect={false}>
            <DropdownItem
              key="back"
              startContent={<Home className="w-4 h-4" />}
              className="text-blue-500"
              onPress={() => router.push("/")}
            >
              Back to Site
            </DropdownItem>
            <DropdownItem
              key="logout"
              className="text-danger"
              color="danger"
              startContent={<LogOut className="w-4 h-4" />}
              onPress={handleLogout}
            >
              {isLoading && <Spinner size="sm" />} Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </nav>
  );
};

export default AdminBottomNavbar;
