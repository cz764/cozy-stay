import Link from "next/link";
import { Globe, Menu, UserCircle } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-brand text-2xl font-bold tracking-tight text-primary"
        >
          cozy<span className="text-foreground">stays</span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-lg font-medium md:flex">
          <Link
            href="/"
            className="border-b-2 border-foreground pb-1 text-foreground"
          >
            Stays
          </Link>
          <Link
            href="/"
            className="border-b-2 border-transparent pb-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            Experiences
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden font-brand text-sm text-muted-foreground lg:inline">
            Escape and relax
          </span>
          <button className="hidden rounded-full p-2 text-muted-foreground hover:bg-accent sm:block">
            <Globe className="size-5" />
          </button>
          <button className="flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-sm transition-shadow hover:shadow-md">
            <Menu className="size-4 text-muted-foreground" />
            <UserCircle className="size-6 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
