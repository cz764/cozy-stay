import Link from "next/link";

import { cn } from "@/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "font-brand text-2xl font-bold tracking-tight text-primary",
        className,
      )}
    >
      cozy<span className="text-foreground">stay</span>
    </Link>
  );
}
