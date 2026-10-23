import { Suspense } from "react";
import Link from "next/link";

import { getUser } from "@/auth/server";
import { Logo } from "@/components/Logo/Logo";
import { getT } from "@/i18n/server";
import { HeaderActions } from "./HeaderActions";

export async function Header() {
  const t = await getT();
  const user = await getUser();

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Logo />

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-lg font-medium md:flex">
          <Link
            href="/"
            className="border-b-2 border-foreground pb-1 text-foreground"
          >
            {t("header.stays")}
          </Link>
          <Link
            href="/"
            className="border-b-2 border-transparent pb-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("header.experiences")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden font-brand text-sm text-muted-foreground lg:inline">
            {t("header.tagline")}
          </span>
          {/* useSearchParams inside HeaderActions needs a boundary; every route
              renders dynamically, so the fallback never shows in practice. */}
          <Suspense>
            <HeaderActions isAuthenticated={user !== null} />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
