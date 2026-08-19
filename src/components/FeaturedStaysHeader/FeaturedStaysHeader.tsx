interface FeaturedStaysHeaderProps {
  location: string | undefined;
  guests: string | undefined;
  total: number;
}

export default function FeaturedStaysHeader({
  location,
  guests,
  total,
}: FeaturedStaysHeaderProps) {
  const staysText =
    total === 1 ? "stay" : `${location || guests ? total : ""} stays`;
  const locationText = location ? ` in “${location}”` : "";
  const guestText = guests ? `up to ${guests} guests` : "";

  return (
    <h2 className="mb-6 text-xl font-semibold">
      {`Featured ${staysText} ${locationText} ${guestText}`}
    </h2>
  );
}
