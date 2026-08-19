/**
 * How many stays the first render asks for. The server has no viewport, so this
 * can't adapt to screen size — 24 fills the widest grid (6 columns) and merely
 * over-fetches a little on mobile, which is cheaper than a second round trip.
 */
export const DEFAULT_LIMIT = 24;

/** Upper bound so a hand-crafted `?limit=99999` can't ask for the world. */
export const MAX_LIMIT = 60;

/**
 * How many pages infinite scroll fetches on its own before pausing behind a
 * "Load more" button — a deliberate click every ~144 cards breaks the
 * doom-scroll loop without making deep browsing tedious.
 */
export const AUTO_LOAD_PAGES = 6;
