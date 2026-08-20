import Image from "next/image";

import type { ListingDetail } from "@/data/types";

interface GalleryProps {
  listing: ListingDetail;
}

/** Cover shot plus up to four tiles; the tiles collapse away on mobile. */
export function Gallery({ listing }: GalleryProps) {
  // The gallery includes the cover; fall back to it if the gallery is empty.
  const images = listing.images.length > 0 ? listing.images : [listing.image];
  const [cover, ...rest] = images;
  const tiles = rest.slice(0, 4);
  const altBase = `${listing.title} in ${listing.location}`;

  return (
    <div className="mt-4 grid gap-2 overflow-hidden rounded-2xl md:grid-cols-2">
      <div className="relative aspect-[4/3]">
        <Image
          src={cover}
          alt={`${altBase} — photo 1`}
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
                alt={`${altBase} — photo ${index + 2}`}
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
