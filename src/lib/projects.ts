import { getCollection } from 'astro:content';
import { sectionRank } from './sections';

// All published projects, grouped by section, then by their order number.
export async function getProjects() {
  const all = await getCollection('projects', ({ data }) => import.meta.env.DEV || !data.draft);
  return all.sort(
    (a, b) =>
      sectionRank(a.data.section) - sectionRank(b.data.section) ||
      a.data.order - b.data.order ||
      a.data.title.localeCompare(b.data.title),
  );
}
