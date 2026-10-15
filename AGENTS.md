# Project guidance

## Components style

- Use function instead of const.
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
