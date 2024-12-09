import { prisma } from "@/utils/prisma";
import { Banner } from "@/types/banner";

export async function getBanners(activeOnly = true) {
  const banners = await prisma.banner.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    orderBy: { createdAt: 'desc' },
  });

  return banners;
}

export async function createBanner(data: Banner) {
  const banner = await prisma.banner.create({
    data: {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      isActive: data.isActive,
    },
  });

  return banner;
}

export async function updateBanner(id: string, data: Partial<Banner>) {
  const banner = await prisma.banner.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      isActive: data.isActive,
      updatedAt: new Date(),
    },
  });

  return banner;
}

export async function deleteBanner(id: string) {
  await prisma.banner.delete({
    where: { id },
  });

  return { success: true };
}

export async function toggleBannerStatus(id: string) {
  const banner = await prisma.banner.findUnique({
    where: { id },
  });

  if (!banner) {
    throw new Error("Banner not found");
  }

  const updatedBanner = await prisma.banner.update({
    where: { id },
    data: {
      isActive: !banner.isActive,
      updatedAt: new Date(),
    },
  });

  return updatedBanner;
}
