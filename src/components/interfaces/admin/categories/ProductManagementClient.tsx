"use client";

import { Tabs, Tab } from "@nextui-org/react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ProductsClient from "../products/ProductsClient";
import CategoriesClient from "./CategoriesClient";
import { Product } from "@/lib/types/products";
import { CategoryWithCount } from "@/types/category";

interface ProductManagementClientProps {
  initialProducts: Product[];
  initialCategories: CategoryWithCount[];
}

export default function ProductManagementClient({
  initialProducts,
  initialCategories,
}: ProductManagementClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "products";

  const handleTabChange = (key: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", key);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <Tabs
        aria-label="Product Management"
        size="lg"
        color="primary"
        variant="underlined"
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-primary",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-primary",
        }}
        selectedKey={currentTab}
        onSelectionChange={(key) => handleTabChange(key as string)}
      >
        <Tab
          key="products"
          title={
            <div className="flex items-center space-x-2">
              <span>Products</span>
            </div>
          }
        >
          <div>
            <ProductsClient initialProducts={initialProducts} />
          </div>
        </Tab>
        <Tab
          key="categories"
          title={
            <div className="flex items-center">
              <span>Categories</span>
            </div>
          }
        >
          <div>
            <CategoriesClient initialCategories={initialCategories} />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
