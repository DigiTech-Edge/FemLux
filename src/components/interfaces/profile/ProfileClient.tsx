"use client";

import React from "react";
import { Card } from "@nextui-org/react";
import ProfileSidebar from "@/components/interfaces/profile/ProfileSidebar";
import ProfileTab from "@/components/interfaces/profile/ProfileTab";
import OrdersTab from "@/components/interfaces/profile/OrdersTab";
import SettingsTab from "@/components/interfaces/profile/SettingsTab";
import { Profile, ProfileFormData, PasswordUpdate } from "@/types/profile";
import { OrderWithDetails } from "@/types/order";
import { updateProfileAction } from "@/services/actions/profile.actions";
import { updatePasswordAction } from "@/services/actions/profile.actions";
import { cancelOrderAction } from "@/services/actions/orders.actions";
import toast from "react-hot-toast";

interface ProfileClientProps {
  tab: string;
  profile: Profile;
  orders: OrderWithDetails[];
}

const ProfileClient = ({ tab, profile, orders }: ProfileClientProps) => {
  const handleProfileUpdate = async (data: ProfileFormData) => {
    try {
      await updateProfileAction({
        ...profile,
        name: data.name,
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  const handlePasswordChange = async (data: PasswordUpdate) => {
    try {
      await updatePasswordAction(data);
      toast.success("Password updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update password"
      );
      console.error(error);
    }
  };

  const handleOrderCancel = async (orderId: string) => {
    try {
      await cancelOrderAction(orderId);
      toast.success("Order cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel order");
      console.error(error);
    }
  };

  return (
    <div className="mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        <ProfileSidebar profile={profile} />

        <Card className="p-6">
          {tab === "profile" && (
            <ProfileTab profile={profile} onUpdate={handleProfileUpdate} />
          )}
          {tab === "orders" && (
            <OrdersTab orders={orders} onCancel={handleOrderCancel} />
          )}
          {tab === "settings" && (
            <SettingsTab onPasswordChange={handlePasswordChange} />
          )}
        </Card>
      </div>
    </div>
  );
};

export default ProfileClient;
