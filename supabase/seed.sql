-- Seed data for cozy-stays — generated from src/lib/data.ts, do not edit the
-- base VALUES block by hand. Re-runnable: truncates and repopulates everything.
-- Run AFTER supabase/migrations/0001_init.sql, in the Supabase SQL Editor.

begin;

truncate table public.bookings, public.reviews, public.listing_images, public.listings
  restart identity cascade;

-- 1) The 50 original hand-written listings (insert order preserves ids 1..50,
--    which the image seeding below relies on).
with base (seed, title, location, price, rating, review_count, guests, laundry, pets, ac) as (
  values
  (1,'Sunlit loft with harbor views','Lisbon, Portugal',128,4.92,214,4,true,true,true),
  (2,'Cabin tucked in the pines','Lake Tahoe, California',245,4.78,98,6,true,true,false),
  (3,'Minimalist studio near the canals','Amsterdam, Netherlands',176,4.85,312,2,false,false,true),
  (4,'Whitewashed villa above the bay','Santorini, Greece',389,4.97,156,8,true,false,true),
  (5,'Warm townhouse in the old quarter','Kyoto, Japan',142,4.89,187,5,true,true,true),
  (6,'Desert retreat with a private pool','Joshua Tree, California',298,4.81,73,4,false,true,true),
  (7,'Bright apartment by the Sagrada','Barcelona, Spain',159,4.74,421,3,true,false,true),
  (8,'Quiet chalet at the foot of the Alps','Chamonix, France',264,4.93,134,10,true,true,false),
  (9,'Converted barn on a working farm','Cotswolds, England',198,4.88,142,6,true,true,false),
  (10,'Rooftop flat with medina views','Marrakesh, Morocco',96,4.71,268,4,false,false,true),
  (11,'Beach bungalow steps from the sand','Tulum, Mexico',212,4.83,331,4,false,true,true),
  (12,'Loft above a corner bakery','Brooklyn, New York',231,4.69,512,3,true,false,true),
  (13,'Fjord-side cabin with a wood sauna','Bergen, Norway',276,4.95,87,5,true,true,false),
  (14,'Garden cottage near the lanes','Melbourne, Australia',167,4.77,203,4,true,true,true),
  (15,'Skyline studio in Shibuya','Tokyo, Japan',189,4.86,476,2,true,false,true),
  (16,'Stone house with an olive grove','Puglia, Italy',154,4.9,119,7,true,true,true),
  (17,'Modern A-frame in the rainforest','Tofino, Canada',288,4.94,64,4,false,true,false),
  (18,'Colonial apartment on a leafy street','Buenos Aires, Argentina',88,4.72,294,5,true,true,true),
  (19,'Hillside casita with valley views','Oaxaca, Mexico',114,4.87,158,3,false,true,true),
  (20,'Riverside flat near the Charles Bridge','Prague, Czechia',132,4.79,367,4,true,false,false),
  (21,'Surf shack with an outdoor shower','Ericeira, Portugal',121,4.76,182,6,true,true,false),
  (22,'Glass cabin under the northern lights','Rovaniemi, Finland',412,4.98,96,2,false,false,false),
  (23,'Penthouse over the Bosphorus','Istanbul, Türkiye',243,4.84,221,6,true,false,true),
  (24,'Vineyard guesthouse with a long terrace','Stellenbosch, South Africa',168,4.91,108,8,true,true,true),
  (25,'Tiny home on a quiet meadow','Hudson Valley, New York',149,4.8,137,2,false,true,true),
  (26,'Artist''s studio with north light','Paris, France',207,4.75,389,2,true,false,false),
  (27,'Overwater bungalow on the lagoon','Bora Bora, French Polynesia',620,4.96,79,4,false,false,true),
  (28,'Restored hanok with a courtyard','Seoul, South Korea',173,4.89,164,5,true,false,true),
  (29,'Lakefront cottage with a rowboat','Muskoka, Canada',259,4.82,112,8,true,true,false),
  (30,'Bright flat in the Latin Quarter','Montreal, Canada',136,4.7,248,4,true,true,true),
  (31,'Cliffside room above the Amalfi road','Positano, Italy',344,4.93,193,3,false,false,true),
  (32,'Loft in a converted tea warehouse','Colombo, Sri Lanka',79,4.68,141,4,true,false,true),
  (33,'Mountain hut on the ridge trail','Queenstown, New Zealand',226,4.9,88,6,true,true,false),
  (34,'Sunny apartment near the Prado','Madrid, Spain',145,4.73,405,5,true,true,true),
  (35,'Houseboat on a quiet canal','Utrecht, Netherlands',183,4.86,127,3,false,true,false),
  (36,'Adobe casa with a rooftop firepit','Santa Fe, New Mexico',211,4.85,154,6,true,true,true),
  (37,'Treehouse above a coffee farm','Monteverde, Costa Rica',163,4.92,102,4,false,false,false),
  (38,'Georgian flat on a cobbled close','Edinburgh, Scotland',192,4.81,236,5,true,false,false),
  (39,'Courtyard riad with a plunge pool','Fez, Morocco',118,4.88,173,8,true,false,true),
  (40,'Alpine studio by the gondola','Zermatt, Switzerland',302,4.94,148,2,true,false,false),
  (41,'Beach house with a shaded deck','Byron Bay, Australia',274,4.79,217,7,true,true,true),
  (42,'Warehouse loft in the arts district','Berlin, Germany',138,4.71,358,4,true,true,false),
  (43,'Stilt house over the mangroves','Koh Lanta, Thailand',92,4.83,196,4,false,true,true),
  (44,'Cottage with a walled rose garden','Galway, Ireland',156,4.87,129,6,true,true,false),
  (45,'Loft with a view of the Duomo','Florence, Italy',229,4.9,284,3,false,false,true),
  (46,'Ranch house on the high plains','Bozeman, Montana',254,4.76,91,10,true,true,true),
  (47,'Sea-view apartment in the old town','Dubrovnik, Croatia',187,4.84,262,5,true,false,true),
  (48,'Windmill cottage on the polder','Zaanse Schans, Netherlands',205,4.89,76,4,false,true,false),
  (49,'Terraced flat above the harbour','Reykjavík, Iceland',236,4.82,145,6,true,false,false),
  (50,'Poolside villa in the rice fields','Ubud, Indonesia',134,4.95,308,8,true,false,true)
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
