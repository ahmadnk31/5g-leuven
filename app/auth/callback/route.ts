import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const next = requestUrl.searchParams.get('next') ?? '/dashboard';

    if (!code) {
      console.error("No code provided in auth callback");
      return NextResponse.json(
        { error: "No code provided" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const forwardedHost = request.headers.get('x-forwarded-host');
    const origin = requestUrl.origin;
    const isLocalEnv = process.env.NODE_ENV === 'development';

    if (isLocalEnv) {
      return NextResponse.redirect(`${origin}${next}`);
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`);
    } else {
      return NextResponse.redirect(`${origin}${next}`);
    }

  } catch (error) {
    console.error("Unexpected error in auth callback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}