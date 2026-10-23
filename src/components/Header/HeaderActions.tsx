"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Globe,
  Heart,
  Languages,
  LogIn,
  LogOut,
  Menu,
  UserCircle,
  UserRound,
} from "lucide-react";

import { logout } from "@/auth/actions";
import { loginHref } from "@/auth/redirect";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale, useT } from "@/i18n/client";
import { LOCALE_NAMES } from "@/i18n/config";
import { LanguageDialog } from "./LanguageDialog";

interface HeaderActionsProps {
  isAuthenticated: boolean;
}

export function HeaderActions({ isAuthenticated }: HeaderActionsProps) {
  const t = useT();
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [languageOpen, setLanguageOpen] = useState(false);
  const [isLoggingOut, startLogout] = useTransition();
  // The dropdown has unmounted by the time the dialog closes, so Radix cannot
  // restore focus on its own; remember which control opened the dialog.
  const languageOpener = useRef<HTMLElement | null>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);

  const openLanguage = (opener: HTMLElement | null) => {
    languageOpener.current = opener;
    setLanguageOpen(true);
  };

  // Log in returns the visitor to this exact page, search included.
  const query = searchParams.toString();
  const returnTo = query ? `${pathname}?${query}` : pathname;

  return (
    <>
      {/* The globe is hidden below `sm`; the Language menu item covers phones. */}
      <button
        type="button"
        aria-label={t("header.language")}
        onClick={(event) => openLanguage(event.currentTarget)}
        className="hidden rounded-full p-2 text-muted-foreground outline-none hover:bg-accent cursor-pointer focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:block"
      >
        <Globe className="size-5" aria-hidden="true" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger
          ref={menuTrigger}
          aria-label={t("header.menu")}
          className="flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 shadow-sm outline-none transition-shadow hover:shadow-md focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <Menu className="size-4 text-muted-foreground" aria-hidden="true" />
          <UserCircle
            className="size-6 text-muted-foreground"
            aria-hidden="true"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 cursor-pointer">
          <DropdownMenuItem asChild>
            <Link href="/wishlist">
              <Heart />
              {t("header.wishlist")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <UserRound />
              {t("header.profile")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => openLanguage(menuTrigger.current)}>
            <Languages />
            {t("header.language")}
            <span className="ml-auto text-xs text-muted-foreground">
              {LOCALE_NAMES[locale]}
            </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {isAuthenticated ? (
            <DropdownMenuItem
              disabled={isLoggingOut}
              onSelect={() => startLogout(() => logout())}
            >
              <LogOut />
              {t("header.logout")}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem asChild>
              <Link href={loginHref(returnTo)}>
                <LogIn />
                {t("header.login")}
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <LanguageDialog
        open={languageOpen}
        onOpenChange={setLanguageOpen}
        returnFocusTo={languageOpener}
      />
    </>
  );
}
