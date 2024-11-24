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

    // Exchange the code for a session using the official method
    const {
      data: { session },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      throw error;
    }

    if (!session) {
      throw new Error("No session found");
    }

    // Successful login, redirect to home page
    return NextResponse.redirect(requestUrl.origin);
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=auth_callback_error`
    );
  }
}
