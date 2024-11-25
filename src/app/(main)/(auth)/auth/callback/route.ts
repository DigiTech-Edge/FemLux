import { isAdminEmail } from "@/helpers/adminEmail";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code`);
  }

  try {
    const supabase = await createClient();

    // Exchange the code for a session
    const {
      error,
      data: { user },
    } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${error.message}`
      );
    }

    if (user?.email) {
      await supabase.auth.updateUser({
        data: { role: isAdminEmail(user.email) ? "admin" : "user" },
      });
    }

    return NextResponse.redirect(requestUrl.origin);
  } catch (error) {
    console.error("Error in auth callback:", error);
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=Something went wrong`
    );
  }
}
