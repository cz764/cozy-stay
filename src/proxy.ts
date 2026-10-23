import { NextResponse, type NextRequest } from "next/server";

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_COOKIE_OPTIONS,
  LOCALE_HEADER,
  LOCALE_PARAM,
  isLocale,
} from "@/i18n/config";

export function proxy(request: NextRequest) {
  const requested = request.nextUrl.searchParams.get(LOCALE_PARAM);
  const stored = request.cookies.get(LOCALE_COOKIE)?.value;

  const locale = isLocale(requested)
    ? requested
    : isLocale(stored)
      ? stored
      : DEFAULT_LOCALE;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);
  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // A shared `?lg=` link becomes the visitor's preference for later visits.
  if (isLocale(requested) && requested !== stored) {
    response.cookies.set(LOCALE_COOKIE, requested, LOCALE_COOKIE_OPTIONS);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|icon.png).*)"],
};
