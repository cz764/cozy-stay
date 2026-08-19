"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

/**
 * Floating "return to top" button. Hidden until the page is scrolled past one
 * viewport height — before that, the top is already at hand and the button
 * would only cover cards.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // React bails out of no-op setState, so the unthrottled listener only
    // re-renders on the two threshold crossings, not on every scroll event.
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <Button
      variant="secondary"
      size="icon-lg"
      aria-label="Return to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={scrollToTop}
      className={cn(
        // hover:bg-border replaces the variant's translucent hover with a
        // darker step of the same stone hue.
        "fixed right-6 bottom-6 z-50 rounded-full border shadow-lg transition-[opacity,background-color] duration-300 hover:bg-border",
        // Kept mounted so the opacity transition runs both ways;
        // pointer-events-none stops the invisible button from eating clicks.
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <ArrowUp />
    </Button>
  );
}
