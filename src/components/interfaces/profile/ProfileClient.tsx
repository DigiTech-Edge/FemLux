"use client";

import React from "react";
import { Card } from "@nextui-org/react";
import { mockProfile, mockOrders } from "@/lib/data/profile";
import ProfileSidebar from "@/components/interfaces/profile/ProfileSidebar";
import ProfileTab from "@/components/interfaces/profile/ProfileTab";
import OrdersTab from "@/components/interfaces/profile/OrdersTab";
import SettingsTab from "@/components/interfaces/profile/SettingsTab";

const ProfileClient = ({ tab }: { tab: string }) => {
  return (
    <div className=" mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        <ProfileSidebar profile={mockProfile} />

        <Card className="p-6">
          {tab === "profile" && <ProfileTab profile={mockProfile} />}
          {tab === "orders" && <OrdersTab orders={mockOrders} />}
          {tab === "settings" && <SettingsTab />}
        </Card>
      </div>
    </div>
  );
};

export default ProfileClient;
