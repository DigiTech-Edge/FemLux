"use client";

import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Badge,
} from "@nextui-org/react";
import { LogOut, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { routes } from "@/lib/routes";
import { logout } from "@/services/actions/auth.actions";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cart";

interface TopNavbarProps {
  isAuthenticated: boolean;
}

const TopNavbar = ({ isAuthenticated }: TopNavbarProps) => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const items = useCartStore((state) => state.items);

  // Filter routes based on authentication status
  const visibleRoutes = routes.filter(
    (route) => !route.protected || isAuthenticated
  );

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
    <Navbar
      maxWidth="full"
      position="sticky"
      className="bg-background/70 backdrop-blur-md border-b"
    >
      <NavbarBrand>
        <Link href="/">
          <Image
            src="/logo.png"
            alt="FemLux Logo"
            width={80}
            height={80}
            className="object-cover"
          />
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {visibleRoutes.map((route) => (
          <NavbarItem key={route.path}>
            <Link
              href={route.path}
              className={`relative py-2 px-1 ${
                pathname === route.path
                  ? "text-primary"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {route.name}
              {pathname === route.path && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end" className="gap-2">
        <NavbarItem>
          <Link href="/cart">
            <Badge
              content={items.length}
              color="primary"
              shape="circle"
              size="sm"
              showOutline={false}
              isInvisible={items.length === 0}
            >
              <ShoppingCart className="h-6 w-6" />
            </Badge>
          </Link>
        </NavbarItem>
        <NavbarItem>
          {isAuthenticated ? (
            <Button
              color="primary"
              variant="flat"
              aria-label="Logout"
              isLoading={isLoading}
              startContent={<LogOut className="w-5 h-5" />}
              onPress={handleLogout}
            >
              <span className="hidden sm:inline">Logout</span>
            </Button>
          ) : (
            <Button
              as={Link}
              href="/login"
              color="primary"
              className="font-medium"
            >
              Sign In
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default TopNavbar;
