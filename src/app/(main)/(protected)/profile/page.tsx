import ProfileClient from "@/components/interfaces/profile/ProfileClient";
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

  return (
    <main className="min-h-screen pb-20">
      <ProfileClient tab={tab} />
    </main>
  );
}
