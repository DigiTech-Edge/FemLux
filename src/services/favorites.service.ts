import { prisma } from "@/utils/prisma";

export const favoritesService = {
  async getFavoriteStatus(userId: string, productId: string) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
    return !!favorite;
  },

  async toggleFavorite(userId: string, productId: string) {
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingFavorite) {
      // Remove favorite
      await prisma.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });
      return false;
    } else {
      // Add favorite
      await prisma.favorite.create({
        data: {
          userId,
          productId,
        },
      });
      return true;
    }
  },

  async getUserFavorites(userId: string) {
    return prisma.favorite.findMany({
      where: {
        userId,
      },
      include: {
        product: {
          include: {
            category: true,
            variants: true,
            _count: {
              select: {
                reviews: true,
              },
            },
          },
        },
      },
    });
  },
};
