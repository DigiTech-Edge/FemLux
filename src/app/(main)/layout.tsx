import React from "react";
import RootLayout from "@/components/layout/RootLayout";
import { createClient } from "@/utils/supabase/server";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <RootLayout isAuthenticated={!!user}>{children}</RootLayout>;
}
