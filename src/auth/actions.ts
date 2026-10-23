"use server";

import { redirect } from "next/navigation";

import { NEXT_PARAM, safeNextPath } from "./redirect";
import { createSupabaseServerClient } from "./server";

export type LoginError =
  | "invalidEmail"
  | "passwordRequired"
  | "invalidCredentials"
  | "emailNotConfirmed"
  | "rateLimited"
  | "unknown";

export interface LoginState {
  error?: LoginError;
}

// Format only: whether the address can receive mail is not checked anywhere.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function login(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get(NEXT_PARAM));

  if (!EMAIL_PATTERN.test(email)) return { error: "invalidEmail" };
  if (!password) return { error: "passwordRequired" };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    switch (error.code) {
      case "invalid_credentials":
        return { error: "invalidCredentials" };
      case "email_not_confirmed":
        return { error: "emailNotConfirmed" };
      case "over_request_rate_limit":
        return { error: "rateLimited" };
      default:
        return { error: "unknown" };
    }
  }

  redirect(next);
}

export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}
