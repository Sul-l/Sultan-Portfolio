# Sultan's design portfolio

Astro site. Run with `npm run dev` (opens at http://127.0.0.1:4321), check with `npm run build`. Windows machines.

## Where things are
- Personal details and links: src/site.ts
- Pages: src/pages/
- Projects: src/content/projects/[name]/index.md, with images in the same folder
- Filter names and order (Print, Social media, Illustration): src/lib/sections.ts
- Colors and fonts: the :root block in src/styles/global.css

## Rules
- Keep the "Salon" design: Cormorant Garamond and Instrument Sans, ivory paper, oxblood accent.
- Use the CSS variables in :root, never hardcoded colors.
- Every project needs a `section`: print, social or illustration. Design work stays first.
- Don't change src/layouts, src/lib or content.config.ts unless I ask.
- Never use em dashes in site copy. Use commas, colons or periods.
- Keep changes small and tell me which files you changed.
- Run `npm run build` after changes to make sure nothing broke.
