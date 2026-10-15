"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
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
      // Stay mounted for the fade; inert removes hidden controls from focus and assistive tech.
      inert={!visible}
      onClick={scrollToTop}
      className={cn(
        "fixed right-6 bottom-6 z-50 rounded-full border shadow-lg transition-[opacity,background-color] duration-300 hover:bg-border",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <ArrowUp />
    </Button>
  );
}
