"use client";

import React from "react";
import { Button, Chip } from "@nextui-org/react";
import { ProductFilters } from "@/lib/types/products";
import { X } from "lucide-react";

interface ActiveFiltersProps {
  filters: ProductFilters;
  onRemove: (key: keyof ProductFilters, value?: string) => void;
  onClearAll: () => void;
}

export default function ActiveFilters({
  filters,
  onRemove,
  onClearAll,
}: ActiveFiltersProps) {
  if (!Object.keys(filters).length) return null;

  return (
    <div className="container mx-auto px-4 py-2">
      <div className="flex flex-wrap items-center gap-2">
        {filters.categories?.map((category) => (
          <Chip
            key={`category-${category}`}
            onClose={() => onRemove("categories", category)}
            variant="flat"
            color="primary"
            classNames={{
              base: "h-8",
              content: "px-2",
            }}
          >
            Category: {category}
          </Chip>
        ))}

        {filters.priceRange && (
          <Chip
            key="price-range"
            onClose={() => onRemove("priceRange")}
            variant="flat"
            color="primary"
            classNames={{
              base: "h-8",
              content: "px-2",
            }}
          >
            Price: ${filters.priceRange.min} - ${filters.priceRange.max}
          </Chip>
        )}

        {filters.search && (
          <Chip
            key="search"
            onClose={() => onRemove("search")}
            variant="flat"
            color="primary"
            classNames={{
              base: "h-8",
              content: "px-2",
            }}
          >
            Search: {filters.search}
          </Chip>
        )}

        {filters.isNew !== undefined && (
          <Chip
            key="new"
            onClose={() => onRemove("isNew")}
            variant="flat"
            color="primary"
            classNames={{
              base: "h-8",
              content: "px-2",
            }}
          >
            {filters.isNew ? "New Arrivals" : "Regular Products"}
          </Chip>
        )}

        <Button
          size="sm"
          variant="light"
          startContent={<X className="w-4 h-4" />}
          onPress={onClearAll}
        >
          Clear All
        </Button>
      </div>
    </div>
  );
}
