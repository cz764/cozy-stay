import Image from "next/image";

import type { ListingDetail } from "@/data/types";
import { getT } from "@/i18n/server";

interface GalleryProps {
  listing: ListingDetail;
}

export async function Gallery({ listing }: GalleryProps) {
  const t = await getT();
  const images = listing.images.length > 0 ? listing.images : [listing.image];
  const [cover, ...rest] = images;
  const tiles = rest.slice(0, 4);
  const photoAlt = (number: number) =>
    t("listing.photoAlt", {
      title: listing.title,
      location: listing.location,
      number,
    });

  return (
    <div className="mt-4 grid gap-2 overflow-hidden rounded-2xl md:grid-cols-2">
      <div className="relative aspect-[4/3]">
        <Image
          src={cover}
          alt={photoAlt(1)}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      {tiles.length > 0 && (
        <div className="hidden grid-cols-2 gap-2 md:grid">
          {tiles.map((url, index) => (
            <div key={url} className="relative aspect-[4/3]">
              <Image
                src={url}
                alt={photoAlt(index + 2)}
                fill
                sizes="25vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
