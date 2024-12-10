"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Trash2 } from "lucide-react";
import { ProductWithRelations } from "@/types/product";
import { toggleFavorite } from "@/services/actions/favorite.actions";
import toast from "react-hot-toast";
import ProductCard from "@/components/ui/ProductCard";
import { Button } from "@nextui-org/react";
import Link from "next/link";

interface FavoritesListProps {
  favorites: {
    productId: string;
    dateAdded: string;
    product: ProductWithRelations;
  }[];
}

export default function FavoritesList({ favorites }: FavoritesListProps) {
  const handleRemoveFavorite = async (productId: string) => {
    try {
      await toggleFavorite(productId);
      toast.success("Removed from favorites");
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove from favorites");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {favorites.map((favorite, index) => (
        <motion.div
          key={favorite.productId}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <div className="relative">
            <ProductCard
              product={favorite.product}
              index={index}
              isFavoriteView
              additionalActions={
                <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    className="bg-white/80 backdrop-blur-sm hover:bg-white"
                    onPress={() => handleRemoveFavorite(favorite.productId)}
                  >
                    <Trash2 className="w-4 h-4 text-danger" />
                  </Button>
                </div>
              }
              addedDate={new Date(favorite.dateAdded).toLocaleDateString()}
            />
          </div>
        </motion.div>
      ))}
      {favorites.length === 0 && (
        <div className="col-span-full text-center py-12">
          <Heart className="w-12 h-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No favourites yet</h3>
          <p className="text-gray-600">
            Start adding products to your favourites list!
          </p>
          <Button
            as={Link}
            href="/shop"
            color="primary"
            variant="flat"
            className="mt-4"
          >
            Browse Products
          </Button>
        </div>
      )}
    </div>
  );
}
