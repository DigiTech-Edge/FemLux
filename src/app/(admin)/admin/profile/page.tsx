import { Suspense } from "react";
import ProfileClient from "@/components/interfaces/admin/profile/ProfileClient";
import BannerManagement from "@/components/interfaces/admin/profile/BannerManagement";
import { fetchProfile } from "@/services/actions/profile.actions";
import { fetchBanners } from "@/services/actions/banner.actions";
import { Spinner } from "@nextui-org/react";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const [profileData, banners] = await Promise.all([
    fetchProfile(),
    fetchBanners(false),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen">
            <Spinner />
          </div>
        }
      >
        <ProfileClient profile={profileData} />
      </Suspense>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen">
            <Spinner />
          </div>
        }
      >
        <BannerManagement initialBanners={banners} />
      </Suspense>
    </div>
  );
}
