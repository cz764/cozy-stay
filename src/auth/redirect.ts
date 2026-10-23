// `/login?next=/listing/42` sends the visitor back where they were.
export const NEXT_PARAM = "next";

const LOGIN_PATH = "/login";

// Only a same-origin path may be a post-login destination: a full URL or a
// protocol-relative `//host` would make the login page an open redirect.
export function safeNextPath(value: unknown): string {
  if (typeof value !== "string") return "/";
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return "/";
  }
  if (value === LOGIN_PATH || value.startsWith(`${LOGIN_PATH}?`)) return "/";
  return value;
}

export function loginHref(returnTo: string): string {
  const next = safeNextPath(returnTo);
  return next === "/"
    ? LOGIN_PATH
    : `${LOGIN_PATH}?${NEXT_PARAM}=${encodeURIComponent(next)}`;
}
