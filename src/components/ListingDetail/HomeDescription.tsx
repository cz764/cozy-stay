interface HomeDescriptionProps {
  description: string;
}

export function HomeDescription({ description }: HomeDescriptionProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground">
        About this home
      </h2>
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">
        {description}
      </p>
    </section>
  );
}
