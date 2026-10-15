"use client";

import { CozyHeart } from "@/components/icons/CozyHeart";
import { useWishlist } from "@/hooks/useWishlist";
import { useT } from "@/i18n/client";
import { cn } from "@/utils";

interface WishlistButtonProps {
  id: string;
  title: string;
  // overlay: icon over a photo; inline: labelled pill for page headers.
  variant?: "overlay" | "inline";
  className?: string;
}

export function WishlistButton({
  id,
  title,
  variant = "overlay",
  className,
}: WishlistButtonProps) {
  const t = useT();
  const { has, toggle } = useWishlist();
  const saved = has(id);

  if (variant === "inline") {
    return (
      <button
        type="button"
        aria-pressed={saved}
        aria-label={t("card.save", { title })}
        onClick={() => toggle(id)}
        className={cn(
          "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium outline-none transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50",
          className,
        )}
      >
        <CozyHeart
          className={cn(
            "size-4 transition-colors",
            saved ? "fill-primary text-primary" : "fill-transparent",
          )}
          stroke="currentColor"
          strokeWidth={2.5}
        />
        {saved ? t("listing.saved") : t("listing.save")}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={t("card.save", { title })}
      onClick={() => toggle(id)}
      className={cn(
        "rounded-full p-2 text-white/90 outline-none transition-transform duration-200 hover:scale-108 focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className,
      )}
    >
      <CozyHeart
        className={cn(
          "size-6 stroke-white [stroke-width:2px] transition-colors",
          saved ? "fill-primary" : "fill-black/50",
        )}
      />
    </button>
  );
}
