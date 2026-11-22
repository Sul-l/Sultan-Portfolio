import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Each project is a folder in src/content/projects/ with an index.md and its images.
// The folder name becomes the page URL: projects/claudia/ -> /work/claudia
const projects = defineCollection({
  loader: glob({
    pattern: '*/index.md',
    base: './src/content/projects',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // Which homepage section the project sits in: print, social or illustration
      section: z.enum(['print', 'social', 'illustration']).default('illustration'),
      category: z.string(),
      summary: z.string(),
      cover: image(),
      coverAlt: z.string(),
      // Which part of the cover to keep when it is cropped in the grid, e.g. "70% center"
      coverPosition: z.string().default('center'),
      client: z.string().optional(),
      year: z.number().optional(),
      role: z.string().optional(),
      // The featured project is the large image on the homepage
      featured: z.boolean().default(false),
      // Lower numbers appear first in the grid
      order: z.number().default(100),
      // Blends white paper backgrounds into the site's paper colour. Good for artwork, off for photos.
      blend: z.boolean().default(false),
      // Drafts are hidden from the live site
      draft: z.boolean().default(false),
      gallery: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
            caption: z.string().optional(),
            // Wide images span the full width, others sit two to a row
            wide: z.boolean().default(false),
          }),
        )
        .default([]),
      // How many gallery images sit side by side on the project page (2 or 3)
      galleryColumns: z.union([z.literal(2), z.literal(3)]).default(2),
    }),
});

export const collections = { projects };
