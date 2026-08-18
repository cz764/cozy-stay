// Ports scripts/seed-listings.ts into supabase/seed.sql so the 50
// hand-written listings are never transcribed by hand.
const fs = require("fs");

const REPO = require("path").join(__dirname, "..");

const src = fs.readFileSync(`${REPO}/scripts/seed-listings.ts`, "utf8");
const arrayLiteral = src
  .replace(/import[\s\S]*?;\n/, "")
  .replace(/export const listings: Listing\[\] =/, "")
  .trim()
  .replace(/;\s*$/, "");
const listings = eval(arrayLiteral);
if (!Array.isArray(listings) || listings.length !== 50) {
  throw new Error(`expected 50 listings, got ${listings && listings.length}`);
}

const q = (s) => `'${String(s).replace(/'/g, "''")}'`;

const values = listings
  .map(
    (l, i) =>
      `  (${i + 1},${q(l.title)},${q(l.location)},${l.pricePerNight},${l.rating},${l.reviewCount},${l.maxGuests},${l.amenities.laundry},${l.amenities.petsFriendly},${l.amenities.ac})`,
  )
  .join(",\n");

const sql = `-- Seed data for cozy-stays — generated from scripts/seed-listings.ts, do not edit the
-- base VALUES block by hand. Re-runnable: truncates and repopulates everything.
-- Run AFTER supabase/migrations/0001_init.sql, in the Supabase SQL Editor.

begin;

truncate table public.bookings, public.reviews, public.listing_images, public.listings
  restart identity cascade;

-- 1) The 50 original hand-written listings (insert order preserves ids 1..50,
--    which the image seeding below relies on).
with base (seed, title, location, price, rating, review_count, guests, laundry, pets, ac) as (
  values
${values}
)
insert into public.listings
  (title, location, price_per_night, rating, review_count, max_guests,
   laundry, pets_friendly, ac, description,
   host_name, host_avatar_url, host_joined_year, host_is_superhost)
select
  title, location, price, rating, review_count, guests, laundry, pets, ac,
  (array[
    'Nestled in the heart of ',
    'Wake up to the sounds of ',
    'Your home base in ',
    'A quiet corner of ',
    'Experience the best of ',
    'Settle into the rhythm of '
  ])[1 + seed % 6] || location ||
    ', this stay comfortably sleeps up to ' || guests ||
    ' guests. Thoughtful touches throughout, fast wifi, and a host who knows the neighborhood inside out — the perfect base from morning coffee to nightcap.',
  (array['Maya','Jonas','Priya','Marco','Sofia','Kenji','Amara','Lucas','Ingrid','Tomas','Leila','Owen','Chiara','Anders','Noor','Felix'])[1 + seed % 16],
  'https://i.pravatar.cc/150?u=cozyhost' || (1 + seed % 16),
  2014 + seed % 11,
  (seed % 3 = 0)
from base
order by seed;

-- 2) ~1,950 synthetic listings so infinite scroll has real depth. All values
--    are deterministic (modular arithmetic, no random()) so reseeding is stable.
insert into public.listings
  (title, location, price_per_night, rating, review_count, max_guests,
   laundry, pets_friendly, ac, description,
   host_name, host_avatar_url, host_joined_year, host_is_superhost)
select
  (array['Sunlit','Cozy','Quiet','Rustic','Modern','Charming','Breezy','Secluded','Elegant','Whimsical','Serene','Historic'])[1 + i % 12]
    || ' ' ||
  (array['loft','cabin','studio','villa','cottage','bungalow','flat','chalet','casita','townhouse'])[1 + i % 10]
    || ' ' ||
  (array['with garden views','near the old town','steps from the water','on a quiet lane','above the market','with a sunny terrace','by the trailhead','in the arts district'])[1 + i % 8],
  (array['Lisbon, Portugal','Lake Tahoe, California','Amsterdam, Netherlands','Santorini, Greece','Kyoto, Japan','Joshua Tree, California','Barcelona, Spain','Chamonix, France','Cotswolds, England','Marrakesh, Morocco','Tulum, Mexico','Brooklyn, New York','Bergen, Norway','Melbourne, Australia','Tokyo, Japan','Puglia, Italy','Tofino, Canada','Buenos Aires, Argentina','Oaxaca, Mexico','Prague, Czechia','Ericeira, Portugal','Rovaniemi, Finland','Istanbul, Türkiye','Stellenbosch, South Africa','Hudson Valley, New York','Paris, France','Seoul, South Korea','Muskoka, Canada','Positano, Italy','Madrid, Spain'])[1 + i % 30],
  60 + (i * 7919) % 540,
  round(4.50 + ((i * 31) % 50) / 100.0, 2),
  3 + (i * 7) % 38,
  1 + (i * 13) % 10,
  (i % 2 = 0),
  (i % 3 = 0),
  (i % 4 <> 0),
  (array[
    'Nestled in the heart of ',
    'Wake up to the sounds of ',
    'Your home base in ',
    'A quiet corner of ',
    'Experience the best of ',
    'Settle into the rhythm of '
  ])[1 + i % 6] ||
    (array['Lisbon, Portugal','Lake Tahoe, California','Amsterdam, Netherlands','Santorini, Greece','Kyoto, Japan','Joshua Tree, California','Barcelona, Spain','Chamonix, France','Cotswolds, England','Marrakesh, Morocco','Tulum, Mexico','Brooklyn, New York','Bergen, Norway','Melbourne, Australia','Tokyo, Japan','Puglia, Italy','Tofino, Canada','Buenos Aires, Argentina','Oaxaca, Mexico','Prague, Czechia','Ericeira, Portugal','Rovaniemi, Finland','Istanbul, Türkiye','Stellenbosch, South Africa','Hudson Valley, New York','Paris, France','Seoul, South Korea','Muskoka, Canada','Positano, Italy','Madrid, Spain'])[1 + i % 30] ||
    ', this stay comfortably sleeps up to ' || (1 + (i * 13) % 10) ||
    ' guests. Thoughtful touches throughout, fast wifi, and a host who knows the neighborhood inside out — the perfect base from morning coffee to nightcap.',
  (array['Maya','Jonas','Priya','Marco','Sofia','Kenji','Amara','Lucas','Ingrid','Tomas','Leila','Owen','Chiara','Anders','Noor','Felix'])[1 + i % 16],
  'https://i.pravatar.cc/150?u=cozyhost' || (1 + i % 16),
  2014 + i % 11,
  (i % 5 = 0)
from generate_series(1, 1950) as i;

-- 3) Images. The original 50 keep their existing picsum seeds (cozy1..cozy50)
--    so cards look identical before/after the backend swap.
insert into public.listing_images (listing_id, url, sort_order)
select id, 'https://picsum.photos/seed/cozy' || id || '/800/600', 0
from public.listings
where id <= 50;

insert into public.listing_images (listing_id, url, sort_order)
select id, 'https://picsum.photos/seed/stay' || id || '/800/600', 0
from public.listings
where id > 50;

-- Four extra gallery shots per listing for the detail page.
insert into public.listing_images (listing_id, url, sort_order)
select l.id, 'https://picsum.photos/seed/stay' || l.id || 'p' || n || '/800/600', n
from public.listings l
cross join lateral generate_series(1, 4) as n;

-- 4) Reviews — exactly review_count rows per listing, so the count shown on
--    cards is always truthful.
insert into public.reviews (listing_id, author, rating, body, created_at)
select
  l.id,
  (array['Elena','Raj','Katie','Mateus','Hana','Dmitri','Alice','Yusuf','Greta','Sam','Mei','Pablo','Astrid','Theo','Zara','Nils','Rosa','Ken','Freya','Omar','June','Iker','Wren','Bao'])[1 + ((l.id * 7 + n * 3) % 24)::int],
  case when (l.id + n) % 11 = 0 then 3 else (4 + (l.id + n) % 2)::int end,
  (array[
    'Lovely stay — exactly as pictured, and the host was quick to answer questions.',
    'The location could not be better. We walked everywhere and slept great.',
    'Spotless, comfortable, and full of charm. Would absolutely come back.',
    'Check-in was seamless and the space felt bigger than the photos suggest.',
    'A little gem. The morning light in the main room is worth the trip alone.',
    'Great value for the area. The kitchen had everything we needed.',
    'Our second time here and it somehow keeps getting better.',
    'Quiet at night, lively by day. The host''s local tips were spot on.',
    'The bed is the most comfortable I have had while traveling. Truly.',
    'Perfect for our group — plenty of space and a very well-stocked kitchen.',
    'Minor hiccup with hot water on day one, resolved within the hour.',
    'The photos undersell it. The terrace at sunset is unforgettable.'
  ])[1 + ((l.id * 5 + n) % 12)::int],
  now() - (((l.id * 11 + n * 17) % 700))::int * interval '1 day'
from public.listings l
cross join lateral generate_series(1, l.review_count) as n;

-- 5) Bookings — 2 to 5 blocked ranges per listing over the next ~4 months.
--    Overlaps are fine; availability derivation unions blocked days.
insert into public.bookings (listing_id, start_date, end_date)
select
  l.id,
  current_date + ((l.id * 3 + b * 23) % 110)::int,
  current_date + ((l.id * 3 + b * 23) % 110)::int + (2 + (l.id + b) % 5)::int
from public.listings l
cross join lateral generate_series(1, (2 + l.id % 4)::int) as b;

commit;

select
  (select count(*) from public.listings)       as listings,
  (select count(*) from public.listing_images) as images,
  (select count(*) from public.reviews)        as reviews,
  (select count(*) from public.bookings)       as bookings;
`;

fs.mkdirSync(`${REPO}/supabase`, { recursive: true });
fs.writeFileSync(`${REPO}/supabase/seed.sql`, sql);
console.log(`wrote supabase/seed.sql (${sql.length} bytes, ${listings.length} base listings)`);
