import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import type { ListingDetail } from "@/data/types";

interface HostProps {
  host: ListingDetail["host"];
}

export function Host({ host }: HostProps) {
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
            Hosted by {host.name}
            {host.isSuperhost && <Badge variant="secondary">Superhost</Badge>}
          </p>
          <p className="text-sm text-muted-foreground">
            Hosting since {host.joinedYear}
          </p>
        </div>
      </div>
    </section>
  );
}
