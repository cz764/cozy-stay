---
name: verify-responsive-ui
description: Verify UI changes in cozy-stays at the project's actual responsive breakpoints. Use when a change affects layout, styling, visibility, or responsive interactions.
---

# Verify responsive UI

## Choose widths from the project

- Inspect the affected components and their shared layout to identify relevant responsive classes, media queries, or container queries.
- Resolve breakpoint values from the current styles and configuration. Start with `src/app/globals.css`; when Tailwind defaults apply, read `node_modules/tailwindcss/theme.css`. Do not assume fixed device presets or copy breakpoint values into this skill.
- Check immediately below and at each relevant breakpoint, where the new rule begins to apply. Include a narrow mobile width, such as 320 CSS pixels, and representative tablet and desktop widths selected from the project's breakpoint ranges. Reuse widths when they cover multiple checks.
- For container queries, vary the affected container's width as well as the viewport.

## Verify in a browser

- Run the app with `npm run dev` if a local server is not already available, and open the affected routes using available browser tooling.
- Inspect rendered content at the selected widths for horizontal overflow, clipped or overlapping content, awkward wrapping, image sizing, and incorrect visibility. Check shared elements affected by the change, such as the header and navigation.
- Exercise affected controls and interactions at the relevant widths. Confirm controls remain reachable, usable, and keyboard accessible as layouts change.
- Check loading, empty, or error states when the change affects their layout. Fix regressions introduced by the change and recheck the affected widths.

## Check infinite scroll

For UI or layout changes, include a regression check of the listing feed, even when pagination code is unchanged. Read `src/components/ListingFeed/ListingFeed.tsx` and `src/data/constants.ts` for the current loading behavior and limits.

- At narrow mobile and wide desktop widths, scroll through multiple page loads. Confirm approaching the end triggers loading and appends results without duplicate cards, repeated requests for the same page, lost results, or unexpected scroll jumps.
- Resize across relevant grid breakpoints after results have been appended. Confirm loading still triggers and the grid and loading skeleton remain aligned without overflow.
- Reach the configured automatic loading limit and verify that “Load more stays” appears, works with keyboard input, and resumes loading. With enough data, verify the final page displays the end state and stops further requests.
- Verify loading and error/retry states when reproducible with available browser tooling. If the dataset or tooling cannot cover a state, report it as unverified.

## Report the result

Briefly list the routes, viewport widths, and interactions checked, plus any unresolved issues. If browser access or required data is unavailable, state the limitation and distinguish source inspection from browser verification.
