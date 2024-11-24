import React from "react";
import RootLayout from "@/components/layout/RootLayout";
import { supabase } from "@/utils/supabase";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { session, error } = await getServerSession();

  // if (error) {
  //   console.error("Session error:", error);
  // }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(user);
  return (
    <RootLayout isAuthenticated={!!user} user={user ?? null}>
      {children}
    </RootLayout>
  );
}
