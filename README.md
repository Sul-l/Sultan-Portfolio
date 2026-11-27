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
| `coverCaption` | Optional small caption under the cover on the project page, e.g. `fig. 01, cover`. |
| `client`, `year`, `role` | Optional. Shown with the section in one small line under the project title. Leave out any you don't want. |
| `featured: true` | Makes it the big image on the homepage. Use it on one project only. |
| `order` | Lower numbers appear first. |
| `blend: true` | Melts white paper backgrounds into the site colour. Good for artwork, turn it off for photos and mockups. |
| `draft: true` | Hides the project on the live site but still shows it while you work locally. |
| `gallery` | The project's images, shown after the cover. Each has `src` and `alt`, plus the optional settings below. |
| `galleryColumns` | Optional, for a plain grid: `2` or `3` images to a row. Leave it out to lay images out with `span` instead. |

Each gallery image can also have:

| Setting | What it does |
| --- | --- |
| `span: full` | The image gets the whole width. This is the default. |
| `span: half` | The image sits side by side with the next `half` image, good for detail pairs. With `galleryColumns: 3` they sit three to a row. |
| `caption` | Optional small caption under the image, e.g. `fig. 03, chapter 01`. Shown only when you set it. |
| `wide: true` | Older setting, the same as `span: full`. |

For example:

```yaml
gallery:
  - src: ./spread.jpg
    alt: Opening spread with the chapter title.
    caption: fig. 02, opening spread
  - src: ./detail-1.jpg
    alt: Close-up of the emblem.
    span: half
  - src: ./detail-2.jpg
    alt: Close-up of the type.
    span: half
```

Images are never cropped on the project page: each keeps its own shape and fits within the screen height. Clicking one opens it full screen. The cover always comes first.

Everything below the settings is the project's notes, written in Markdown. They appear after the images as a short "Notes" section. Replace the text in [brackets].

## Put it online (Cloudflare Pages)

1. Create a repository on GitHub and push this folder to it.
2. In the Cloudflare dashboard, go to Workers & Pages, create a Pages project, and connect the repository.
3. Framework preset: Astro. Build command: `npm run build`. Output directory: `dist`.
4. Once it deploys, add your custom domain in the project's settings.
5. Set `site` in `astro.config.mjs` to your domain.

Every time you push to GitHub, Cloudflare rebuilds and publishes the site.

## The brush reveal

Artwork paints itself in through a dry-brush mask as it scrolls into view. The mask is `public/brush-mask.svg`, and the styles are at the bottom of `src/styles/global.css` under "Dry-brush reveal". Visitors who have reduced motion turned on see the images straight away.
