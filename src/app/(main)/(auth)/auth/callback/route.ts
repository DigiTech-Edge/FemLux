import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { userService } from "@/services/users.service";

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
      data: { user },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${error.message}`
      );
    }

    // Create/update user profile
    await userService.upsertProfile(user!);

    return NextResponse.redirect(requestUrl.origin);
  } catch (error) {
    console.error("Error in auth callback:", error);
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=Something went wrong`
    );
  }
}
