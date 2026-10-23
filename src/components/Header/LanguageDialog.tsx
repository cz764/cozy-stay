"use client";

import { useTransition, type RefObject } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { setLocale } from "@/i18n/actions";
import { useLocale, useT } from "@/i18n/client";
import { LOCALES, LOCALE_NAMES, type Locale } from "@/i18n/config";
import { cn } from "@/utils";

interface LanguageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnFocusTo: RefObject<HTMLElement | null>;
}

export function LanguageDialog({
  open,
  onOpenChange,
  returnFocusTo,
}: LanguageDialogProps) {
  const t = useT();
  const current = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const choose = (locale: Locale) => {
    if (locale === current) {
      onOpenChange(false);
      return;
    }
    startTransition(async () => {
      await setLocale(locale);
      // The cookie only applies to the next render; refresh re-renders the
      // layout in place so the header and page switch without a reload.
      router.refresh();
      onOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        closeLabel={t("dialog.close")}
        className="sm:max-w-md"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          returnFocusTo.current?.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle>{t("language.title")}</DialogTitle>
          <DialogDescription>{t("language.description")}</DialogDescription>
        </DialogHeader>
        <ul className="grid gap-2 sm:grid-cols-2" aria-busy={isPending}>
          {LOCALES.map((locale) => {
            const selected = locale === current;
            return (
              <li key={locale}>
                <button
                  type="button"
                  lang={locale}
                  aria-pressed={selected}
                  disabled={isPending}
                  onClick={() => choose(locale)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium outline-none transition-colors hover:bg-accent focus-ring disabled:opacity-60",
                    selected && "border-foreground",
                  )}
                >
                  {LOCALE_NAMES[locale]}
                  {selected && (
                    <>
                      <Check className="size-4" aria-hidden="true" />
                      <span className="sr-only">{t("language.current")}</span>
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
