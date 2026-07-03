import Link from "next/link";
import { Globe, Menu, UserCircle } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-brand text-2xl font-bold tracking-tight text-primary"
        >
          cozy<span className="text-foreground">stays</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link href="/" className="hover:text-foreground">
            Stays
          </Link>
          <Link href="/" className="hover:text-foreground">
            Experiences
          </Link>
          <Link href="/" className="hover:text-foreground">
            Host your home
          </Link>
        </nav>

        <div className="flex items-center gap-3">
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
