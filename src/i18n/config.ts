// BCP 47 tags; zh-CN rather than zh-Hans because it is what browsers send
// in Accept-Language and what most travel sites use.
export const LOCALES = ["en", "es", "fr", "zh-CN"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

// Shown in each language's own name, never translated: someone who cannot
// read the current UI language still has to be able to find their own.
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  "zh-CN": "简体中文",
};

// `?lg=fr` in any URL switches language and is remembered in the cookie.
export const LOCALE_PARAM = "lg";
export const LOCALE_COOKIE = "lg";
// Middleware forwards the resolved locale so server components never
// re-implement the param-then-cookie precedence.
export const LOCALE_HEADER = "x-locale";

export const LOCALE_COOKIE_OPTIONS = {
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax",
} as const;

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" && (LOCALES as readonly string[]).includes(value)
  );
}
