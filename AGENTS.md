# Project guidance

## Product

- Treat 'cozystay' as it's own brand logo, make sure when we refer it in codebase and text, they are consistent.

## Developer

- When working on features, create a feature branch locally. Leave commit on user, unless asked to do so.
- After each change, show a summary on what has changed, why this decision, and how it works.

## Components style

- Use function to define components instead of const. When defining variable and handler functions inside component, use const.
- Use `interface xxxProps` to define component props.
- Ask for approvals when adding effects.
- Ask for approvals when making UX decisions.

## Comments

- Add comments only when omitting them would make the code's intent or constraints harder to understand by a senior frontend engineer with 4+ years experience.
- Explain non-obvious reasons, framework requirements. Avoid comments that restate the code, routine section labels, and boilerplate file headers.
- Write important and architecture decisions, trade-offs to /doc/DECISIONS.md
- For example, a comment explaining why `generateMetadata` belongs in the route's `src/app/listing/[id]/page.tsx` is useful when that placement would otherwise be unclear.

## UI verification

For changes that affect layout or appearance, use the [responsive verification skill](.agents/skills/verify-responsive-ui/SKILL.md). Base viewport checks on the project's actual breakpoints and report what was verified.

## Hyphens and dashes

> Adapted from [this LinkedIn post](https://www.linkedin.com/posts/meticulousproofreading_i-see-these-punctuation-symbols-muddled-a-share-7495398480195174400-P9vF/).

Applies to any text a person can read, whether an end user or a developer: UI strings, translation files, docs, code comments, commit messages, database scripts, environment and config files, folder structures and naming conventions. Never use a spaced hyphen (" - ") in place of a dash.

- Hyphen (-): joins compound words and identifiers. e.g. "eye-rolling", "well-known", `cozy-stay`, `verify-responsive-ui`.
- En dash (–), spaced, is the default dash in this project:
  1. A break or pause. e.g. "She showed universal signs of fear – tight facial muscles, dilated pupils, fast breathing."
  2. An aside that expands the sentence. e.g. "Digital channel use has increased – children, the elderly, people with disabilities – which adds new expectations."
  3. A leading list followed by its subject. e.g. "Loud, fun, friendly – LinkedIn à la 2026."
  4. Page title separator. e.g. "{page} – cozystay".
- En dash (–), unspaced: number and time ranges. e.g. "2:00–3:00pm", "100–200".
- Em dash (—), unspaced, only for:
  1. Omitted letters. e.g. "For f—'s sake!"
  2. An interrupted sentence. e.g. "Look, I have no idea what—"
  3. A speaker cut off mid-word. e.g. "But Janif—"
