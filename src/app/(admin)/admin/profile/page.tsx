import { Suspense } from "react";
import ProfileClient from "@/components/interfaces/admin/profile/ProfileClient";
import { adminProfile } from "@/lib/data/admin/profile";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <Suspense fallback={<div>Loading profile...</div>}>
        <ProfileClient profile={adminProfile} />
      </Suspense>
    </div>
  );
}
