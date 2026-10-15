import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import type { ListingDetail } from "@/data/types";
import { getT } from "@/i18n/server";

interface HostProps {
  host: ListingDetail["host"];
}

export async function Host({ host }: HostProps) {
  const t = await getT();

  return (
    <section className="mt-8 border-t pt-6">
      <div className="flex items-center gap-3">
        <Image
          src={host.avatarUrl}
          alt=""
          width={48}
          height={48}
          className="size-12 rounded-full object-cover"
        />
        <div>
          <p className="flex items-center gap-2 font-medium text-foreground">
            {t("listing.hostedBy", { name: host.name })}
            {host.isSuperhost && (
              <Badge variant="secondary">{t("listing.superhost")}</Badge>
            )}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("listing.hostingSince", { year: host.joinedYear })}
          </p>
        </div>
      </div>
    </section>
  );
}
