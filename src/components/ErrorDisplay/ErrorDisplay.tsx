import { getT } from "@/i18n/server";

interface ErrorDisplayProps {
  error: string;
}

export default async function ErrorDisplay({ error }: ErrorDisplayProps) {
  const t = await getT();

  return (
    <div className="rounded-2xl border border-dashed py-16 text-center">
      <p className="font-medium text-foreground">{error}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("error.retryHint")}
      </p>
    </div>
  );
}
