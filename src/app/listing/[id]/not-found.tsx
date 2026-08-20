import Link from "next/link";

export default function ListingNotFound() {
  return (
    <div className="mx-auto max-w-5xl rounded-2xl border border-dashed py-16 text-center">
      <p className="font-medium text-foreground">This stay doesn&apos;t exist</p>
      <p className="mt-1 text-sm text-muted-foreground">
        It may have been removed, or the link is wrong.
      </p>
      <Link
        href="/"
        className="mt-4 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        Browse all stays
      </Link>
    </div>
  );
}
