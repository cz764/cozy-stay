"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const t = useT();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-2xl border border-dashed py-16 text-center">
      <p className="font-medium text-foreground">{t("error.title")}</p>
      <p className="mt-1 text-sm text-muted-foreground">{t("error.body")}</p>
      {/* Production strips the message; the digest is the handle for finding
          this exact throw in the server logs. */}
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          {t("error.reference", { digest: error.digest })}
        </p>
      )}
      <Button variant="outline" className="mt-4" onClick={reset}>
        {t("error.tryAgain")}
      </Button>
    </div>
  );
}
