interface ErrorDisplayProps {
  error: string;
}

export default function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="rounded-2xl border border-dashed py-16 text-center">
      <p className="font-medium text-foreground">{error}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Please try again in a moment.
      </p>
    </div>
  );
}
