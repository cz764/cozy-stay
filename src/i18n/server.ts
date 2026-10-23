import { cache } from "react";
import { cookies, headers } from "next/headers";

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_HEADER,
  isLocale,
  type Locale,
} from "./config";
import { messages } from "./messages";
import { createT } from "./translate";

export const getLocale = cache(async (): Promise<Locale> => {
  const fromHeader = (await headers()).get(LOCALE_HEADER);
  if (isLocale(fromHeader)) return fromHeader;

  // Renders the proxy matcher skips still honor a stored preference.
  const fromCookie = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(fromCookie) ? fromCookie : DEFAULT_LOCALE;
});

export const getMessages = cache(async () => messages[await getLocale()]);

export const getT = cache(async () =>
  createT(await getLocale(), await getMessages()),
);
