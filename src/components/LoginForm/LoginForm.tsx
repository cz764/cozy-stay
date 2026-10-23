"use client";

import { useActionState, useId } from "react";

import { login, type LoginState } from "@/auth/actions";
import { NEXT_PARAM } from "@/auth/redirect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useT } from "@/i18n/client";

interface LoginFormProps {
  next: string;
}

const initialState: LoginState = {};

export function LoginForm({ next }: LoginFormProps) {
  const t = useT();
  const [state, formAction, isPending] = useActionState(login, initialState);
  const errorId = useId();
  const isCredentialError =
    state.error === "invalidCredentials" || state.error === "invalidEmail";

  return (
    <form action={formAction} className="grid gap-5" aria-busy={isPending}>
      <input type="hidden" name={NEXT_PARAM} value={next} />

      <div className="grid gap-2">
        <label htmlFor="login-email" className="text-sm font-medium">
          {t("login.email")}
        </label>
        <Input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          autoFocus
          aria-invalid={isCredentialError || undefined}
          aria-describedby={state.error ? errorId : undefined}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="login-password" className="text-sm font-medium">
          {t("login.password")}
        </label>
        <Input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={isCredentialError || undefined}
          aria-describedby={state.error ? errorId : undefined}
        />
      </div>

      {state.error && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {t(`login.errors.${state.error}`)}
        </p>
      )}

      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? t("login.submitting") : t("login.submit")}
      </Button>
    </form>
  );
}
