"use client";

import React from "react";
import { Card } from "@nextui-org/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useInView } from "framer-motion";
import { CategoryWithCount } from "@/types/category";
import { useRouter } from "next/navigation";
interface CategoryCardProps {
  category: CategoryWithCount;
  index: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, index }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  const router = useRouter();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.21, 1.11, 0.81, 0.99],
      }}
      className="h-full w-full"
    >
      <div className="block h-full w-full">
        <Card
          isPressable
          className="relative w-full h-[240px] overflow-hidden group bg-default-100"
          onPress={() => router.push(`/shop?categories=${category.name}`)}
        >
          <div className="relative w-full h-full">
            <Image
              src={category.image || "/images/placeholder.jpg"}
              alt={category.name}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-white">
              <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
              {category._count && (
                <p className="text-sm text-white/80">
                  {category._count.products} items
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
