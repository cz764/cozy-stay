"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-2xl border border-dashed py-16 text-center">
      <p className="font-medium text-foreground">Something went wrong.</p>
      <p className="mt-1 text-sm text-muted-foreground">
        We couldn&rsquo;t load this page. Please try again in a moment.
      </p>
      {/* Production strips the message; the digest is the handle for finding
          this exact throw in the server logs. */}
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          Reference: {error.digest}
        </p>
      )}
      <Button variant="outline" className="mt-4" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
