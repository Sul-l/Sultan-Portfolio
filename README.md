# Sultan Alghamdi, design portfolio

Built with [Astro](https://astro.build). Direction A, "Salon".

## Run it on your computer

You need Node.js 22.12 or newer. In PowerShell, inside this folder:

```
npm install
npm run dev
```

Open http://127.0.0.1:4321. The page reloads by itself whenever you save a file.

## Edit your details

Open `src/site.ts` and set your email and social links. Links left empty are hidden.

The About page copy is in `src/pages/about.astro`. It's a draft, so rewrite it in your own voice.

## Add a project

1. Make a folder in `src/content/projects/`, for example `salfa-packaging/`. The folder name becomes the URL: `/work/salfa-packaging`.
2. Put your images in it. Export JPGs around 2400px on the long side. Astro resizes and compresses them for you when it builds.
3. Copy an `index.md` from another project into the folder and edit it.

The settings at the top of `index.md`:

| Field | What it does |
| --- | --- |
| `section` | Which filter it belongs to: `print`, `social` or `illustration`. Print comes first on the homepage. |
| `title`, `category`, `summary` | Shown in the grid and on the project page. Categories become the filter buttons. |
| `cover`, `coverAlt` | The main image and its description for screen readers. |
| `coverPosition` | Which part of the cover to keep when the grid crops it, e.g. `70% center`. |
| `client`, `year`, `role` | Optional facts on the project page. Leave out any you don't want. |
| `featured: true` | Makes it the big image on the homepage. Use it on one project only. |
| `order` | Lower numbers appear first. |
| `blend: true` | Melts white paper backgrounds into the site colour. Good for artwork, turn it off for photos and mockups. |
| `draft: true` | Hides the project on the live site but still shows it while you work locally. |
| `galleryColumns` | How many gallery images sit side by side: `2` (default) or `3`. |
| `gallery` | Extra images. Add `wide: true` to make one span the full width. |

Everything below the settings is the case study text, written in Markdown. Replace the text in [brackets].

## Put it online (Cloudflare Pages)

1. Create a repository on GitHub and push this folder to it.
2. In the Cloudflare dashboard, go to Workers & Pages, create a Pages project, and connect the repository.
3. Framework preset: Astro. Build command: `npm run build`. Output directory: `dist`.
4. Once it deploys, add your custom domain in the project's settings.
5. Set `site` in `astro.config.mjs` to your domain.

Every time you push to GitHub, Cloudflare rebuilds and publishes the site.

## The brush reveal

Artwork paints itself in through a dry-brush mask as it scrolls into view. The mask is `public/brush-mask.svg`, and the styles are at the bottom of `src/styles/global.css` under "Dry-brush reveal". Visitors who have reduced motion turned on see the images straight away.
