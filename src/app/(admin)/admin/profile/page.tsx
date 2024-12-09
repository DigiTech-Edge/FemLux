import { Suspense } from "react";
import ProfileClient from "@/components/interfaces/admin/profile/ProfileClient";
import BannerManagement from "@/components/interfaces/admin/profile/BannerManagement";
import { fetchProfile } from "@/services/actions/profile.actions";
import { fetchBanners } from "@/services/actions/banner.actions";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default async function ProfilePage() {
  const [profileData, banners] = await Promise.all([
    fetchProfile(),
    fetchBanners(false),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <ProfileClient profile={profileData} />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <BannerManagement initialBanners={banners} />
      </Suspense>
    </div>
  );
}
