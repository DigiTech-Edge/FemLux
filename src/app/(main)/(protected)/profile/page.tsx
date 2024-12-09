import ProfileClient from "@/components/interfaces/profile/ProfileClient";
import { fetchProfile } from "@/services/actions/profile.actions";
import { fetchUserOrders } from "@/services/actions/orders.actions";
import React from "react";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{
    tab?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const tab = resolvedSearchParams.tab || "profile";

  // Fetch profile and orders data
  const [profile, orders] = await Promise.all([
    fetchProfile(),
    fetchUserOrders(),
  ]);

  return (
    <main className="min-h-screen pb-20">
      <ProfileClient tab={tab} profile={profile} orders={orders} />
    </main>
  );
}
