"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardBody,
  Avatar,
  Button,
  Divider,
  Link,
} from "@nextui-org/react";
import { User, Package, Settings, Menu, X, ArrowRight } from "lucide-react";
import { UserProfile } from "@/lib/types/user";
import { cn } from "@/helpers/utils";
import { motion, AnimatePresence } from "framer-motion";
import UserAvatar from "@/components/shared/UserAvatar";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";

interface ProfileSidebarProps {
  profile: UserProfile;
  className?: string;
}

const tabs = [
  {
    key: "profile",
    label: "Profile",
    icon: User,
  },
  {
    key: "orders",
    label: "Orders",
    icon: Package,
  },
  {
    key: "settings",
    label: "Settings",
    icon: Settings,
  },
];

const fetcher = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No session");

  return user.user_metadata.role;
};

export default function ProfileSidebar({
  profile,
  className,
}: ProfileSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = React.useState(false);
  const activeTab = searchParams.get("tab") || "profile";

  const { data } = useSWR("role", fetcher);

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    router.push(`/profile?${params.toString()}`);
    setIsOpen(false);
  };

  const SidebarContent = () => (
    <>
      <div className="flex flex-col items-center gap-4 p-6">
        {data === "admin" && (
          <Link className="text-sm text-blue-500 self-end" href="/admin">
            <motion.span className="flex gap-1 items-center hover:translate-x-1 transition-all duration-300">
              Admin
              <ArrowRight size={16} />
            </motion.span>
          </Link>
        )}
        <UserAvatar showEditButton className="w-24 h-24" />
        <div className="text-center">
          <h2 className="text-md font-semibold">{profile.name}</h2>
          <p className="text-sm text-gray-500">{profile.email}</p>
        </div>
      </div>
      <Divider />
      <nav className="flex flex-col p-2 relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <Button
              key={tab.key}
              variant="light"
              className={cn(
                "relative w-full justify-start gap-2 h-11 px-3",
                isActive
                  ? "text-pink-500"
                  : "text-foreground/70 hover:text-foreground"
              )}
              onPress={() => handleTabChange(tab.key)}
            >
              <div className="flex items-center gap-2">
                <Icon size={20} />
                <span>{tab.label}</span>
              </div>
              {isActive && (
                <motion.div
                  layoutId="profile-tab"
                  className="absolute left-0 top-0 h-full w-1 bg-pink-500"
                  initial={false}
                  transition={{
                    layout: {
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    },
                  }}
                />
              )}
            </Button>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile Menu */}
      <div className="md:hidden relative">
        <Button
          isIconOnly
          variant="light"
          onPress={() => setIsOpen(true)}
          className="absolute left-0 -top-6 z-30"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </Button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-x-0 top-[64px] bottom-0 sm:bottom-0 bg-black/50 z-30"
                onClick={() => setIsOpen(false)}
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 20 }}
                className="fixed left-0 top-[64px] bottom-0 sm:bottom-0 w-[280px] bg-background z-30 overflow-y-auto"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-end p-4">
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() => setIsOpen(false)}
                      aria-label="Close menu"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  {data === "admin" && (
                    <Link
                      className="text-sm text-blue-500 self-end mx-6"
                      href="/admin"
                    >
                      <motion.span className="flex gap-1 items-center hover:translate-x-1 transition-all duration-300">
                        Admin
                        <ArrowRight size={16} />
                      </motion.span>
                    </Link>
                  )}
                  <div className="flex-1">
                    <div className="flex flex-col items-center gap-4 p-6">
                      <Avatar
                        src={profile.avatar}
                        className="w-24 h-24"
                        alt={profile.name}
                      />
                      <div className="text-center">
                        <h2 className="text-xl font-semibold">
                          {profile.name}
                        </h2>
                        <p className="text-sm text-gray-500">{profile.email}</p>
                      </div>
                    </div>
                    <Divider />
                    <nav className="flex flex-col p-2 relative">
                      {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.key;
                        return (
                          <Button
                            key={tab.key}
                            variant="light"
                            className={cn(
                              "relative w-full justify-start gap-2 h-11 px-3",
                              isActive
                                ? "text-pink-500"
                                : "text-foreground/70 hover:text-foreground"
                            )}
                            onPress={() => handleTabChange(tab.key)}
                          >
                            <div className="flex items-center gap-2">
                              <Icon size={20} />
                              <span>{tab.label}</span>
                            </div>
                            {isActive && (
                              <motion.div
                                layoutId="profile-tab-mobile"
                                className="absolute left-0 top-0 h-full w-1 bg-pink-500"
                                initial={false}
                                transition={{
                                  layout: {
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                  },
                                }}
                              />
                            )}
                          </Button>
                        );
                      })}
                    </nav>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Sidebar */}
      <Card className={cn("hidden md:block h-fit", className)}>
        <CardBody className="p-0">
          <SidebarContent />
        </CardBody>
      </Card>
    </>
  );
}
