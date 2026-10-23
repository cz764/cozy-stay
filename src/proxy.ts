import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { getSupabaseEnv } from "@/auth/server";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_COOKIE_OPTIONS,
  LOCALE_HEADER,
  LOCALE_PARAM,
  isLocale,
} from "@/i18n/config";

export async function proxy(request: NextRequest) {
  const requested = request.nextUrl.searchParams.get(LOCALE_PARAM);
  const stored = request.cookies.get(LOCALE_COOKIE)?.value;

  const locale = isLocale(requested)
    ? requested
    : isLocale(stored)
      ? stored
      : DEFAULT_LOCALE;

  // Built from the live request headers so refreshed auth cookies, which
  // Supabase writes onto `request.cookies` below, reach the render too.
  const nextWithLocale = () => {
    const headers = new Headers(request.headers);
    headers.set(LOCALE_HEADER, locale);
    return NextResponse.next({ request: { headers } });
  };

  let response = nextWithLocale();

  const { url, key } = getSupabaseEnv();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = nextWithLocale();
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Refreshes an expiring session and writes the new tokens back. Server
  // components cannot set cookies, so this is the only place it can happen.
  await supabase.auth.getUser();

  // A shared `?lg=` link becomes the visitor's preference for later visits.
  if (isLocale(requested) && requested !== stored) {
    response.cookies.set(LOCALE_COOKIE, requested, LOCALE_COOKIE_OPTIONS);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|icon.png).*)"],
};
