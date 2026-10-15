import type { Metadata } from "next";

import { ComingSoon } from "@/components/ComingSoon/ComingSoon";
import { getT } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("meta.pageTitle", { page: t("comingSoon.login.title") }),
  };
}

export default function LoginPage() {
  return <ComingSoon feature="login" />;
}
