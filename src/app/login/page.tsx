import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { NEXT_PARAM, safeNextPath } from "@/auth/redirect";
import { getUser } from "@/auth/server";
import { LoginForm } from "@/components/LoginForm/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getT } from "@/i18n/server";

interface LoginPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("meta.pageTitle", { page: t("login.title") }) };
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const requested = params[NEXT_PARAM];
  const next = safeNextPath(Array.isArray(requested) ? requested[0] : requested);

  if (await getUser()) redirect(next);

  const t = await getT();

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">{t("login.title")}</CardTitle>
        <CardDescription>{t("login.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm next={next} />
      </CardContent>
    </Card>
  );
}
