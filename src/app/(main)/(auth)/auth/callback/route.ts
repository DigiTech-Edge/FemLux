import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  try {
    const code = requestUrl.searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=No code provided`
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${error.message}`
      );
    }

    // Removed automatic role assignment since roles are now managed through admin interface

    return NextResponse.redirect(requestUrl.origin);
  } catch (error) {
    console.error("Error in auth callback:", error);
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=Something went wrong`
    );
  }
}
