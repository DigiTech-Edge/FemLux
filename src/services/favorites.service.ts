import { prisma } from "@/utils/prisma";

export const favoritesService = {
  async getFavoriteStatus(userId: string, productId: string) {
    try {
      const favorite = await prisma.favorite.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });
      return !!favorite;
    } catch (error) {
      console.error("Error in getFavoriteStatus:", error);
      throw error;
    }
  },

  async toggleFavorite(userId: string, productId: string) {
    try {
      const existingFavorite = await prisma.favorite.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

      if (existingFavorite) {
        await prisma.favorite.delete({
          where: {
            id: existingFavorite.id,
          },
        });
        return false;
      } else {
        await prisma.favorite.create({
          data: {
            userId,
            productId,
          },
        });
        return true;
      }
    } catch (error) {
      console.error("Error in toggleFavorite:", error);
      throw error;
    }
  },

  async getUserFavorites(userId: string) {
    try {
      return prisma.favorite.findMany({
        where: {
          userId,
        },
        include: {
          product: {
            include: {
              category: true,
              variants: true,
              reviews: true,
              _count: {
                select: {
                  reviews: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error("Error in getUserFavorites:", error);
      throw error;
    }
  },

  async clearAllFavorites(userId: string) {
    try {
      await prisma.favorite.deleteMany({
        where: {
          userId,
        },
      });
    } catch (error) {
      console.error("Error in clearAllFavorites:", error);
      throw error;
    }
  },
};
