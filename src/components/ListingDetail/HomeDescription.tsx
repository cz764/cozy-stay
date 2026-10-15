import { getT } from "@/i18n/server";

interface HomeDescriptionProps {
  description: string;
}

export async function HomeDescription({ description }: HomeDescriptionProps) {
  const t = await getT();

  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground">
        {t("listing.about")}
      </h2>
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">
        {description}
      </p>
    </section>
  );
}
