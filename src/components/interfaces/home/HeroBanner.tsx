"use client";

import React from "react";
import Image from "next/image";
import Carousel from "@/components/ui/Carousel";
import { BannerWithId } from "@/types/banner";
import { motion } from "framer-motion";
import { cn } from "@/helpers/utils";

interface HeroBannerProps {
  banners: BannerWithId[];
}

const HeroBanner = ({ banners }: HeroBannerProps) => {
  return (
    <div className="relative w-full overflow-hidden">
      <Carousel
        autoplay
        loop
        showIndicators
        showControls
        slideWidth="100%"
        autoplayDelay={5000}
        className={cn(
          "w-full",
          "[&_.carousel-control]:!bg-white/10 [&_.carousel-control]:backdrop-blur-md",
          "[&_.carousel-control]:!w-12 [&_.carousel-control]:!h-12",
          "[&_.carousel-control]:rounded-full [&_.carousel-control]:border",
          "[&_.carousel-control]:border-white/20 [&_.carousel-control:hover]:!bg-white/20",
          "[&_.carousel-indicators_button]:!w-2 [&_.carousel-indicators_button]:!h-2",
          "[&_.carousel-indicators_button]:!rounded-full",
          "[&_.carousel-indicators_button]:!bg-white/50",
          "[&_.carousel-indicators_button.active]:!bg-white"
        )}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="relative w-full flex-[0_0_100%]">
            <div className="relative aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9] w-full">
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                priority
                className="object-cover brightness-75 scale-[1.02]"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="max-w-4xl relative"
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-1 bg-gradient-to-r from-pink-500 to-violet-500 mb-6 rounded-full"
                  />
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="font-bold mb-4 sm:mb-6 md:mb-8 leading-[1.1] 
                      text-4xl sm:text-5xl md:text-6xl lg:text-7xl
                      bg-clip-text text-transparent 
                      bg-gradient-to-r from-white via-white to-white/70
                      drop-shadow-2xl"
                  >
                    {banner.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="text-lg sm:text-xl md:text-2xl 
                      mb-6 sm:mb-8 md:mb-10 
                      max-w-xl 
                      text-gray-300/90
                      drop-shadow-lg 
                      font-light
                      leading-relaxed"
                  >
                    {banner.description}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "150px" }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                    className="h-[2px] bg-gradient-to-r from-white/20 to-transparent rounded-full"
                  />
                </motion.div>
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.5),transparent_70%)]" />
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroBanner;
