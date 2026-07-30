export function SearchField({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-1 items-center gap-3 rounded-full px-4 py-2 transition-colors hover:bg-accent/60 sm:px-3 sm:py-1.5">
      <span className="text-muted-foreground">{icon}</span>
      <span className="flex flex-1 flex-col">
        <span className="text-xs font-semibold text-foreground">{label}</span>
        {children}
      </span>
    </label>
  );
}

export function SearchDivider() {
  return <div className="hidden h-8 w-px bg-border sm:block" />;
}
