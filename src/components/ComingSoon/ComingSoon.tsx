import Link from "next/link";
import { Heart, LogIn, UserRound, type LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getT } from "@/i18n/server";

export type ComingSoonFeature = "wishlist" | "profile" | "login";

const icons: Record<ComingSoonFeature, LucideIcon> = {
  wishlist: Heart,
  profile: UserRound,
  login: LogIn,
};

interface ComingSoonProps {
  feature: ComingSoonFeature;
}

export async function ComingSoon({ feature }: ComingSoonProps) {
  const t = await getT();
  const Icon = icons[feature];

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-dashed px-6 py-16 text-center">
      <Icon
        className="mx-auto size-10 text-muted-foreground"
        aria-hidden="true"
      />
      <h1 className="mt-4 text-2xl font-semibold text-foreground">
        {t(`comingSoon.${feature}.title`)}
      </h1>
      <Badge variant="secondary" className="mt-2">
        {t("comingSoon.badge")}
      </Badge>
      <p className="mt-3 text-sm text-muted-foreground">
        {t(`comingSoon.${feature}.body`)}
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        {t("comingSoon.backHome")}
      </Link>
    </div>
  );
}
