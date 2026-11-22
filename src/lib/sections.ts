// The homepage sections, in the order they appear.
// To rename a section or change its intro line, edit it here.
export const SECTIONS = [
  { key: 'print', short: 'Print', title: 'Print and posters', intro: 'Booklets, posters and campaigns made for the page.' },
  { key: 'social', short: 'Social media', title: 'Social media', intro: 'Posts and campaigns made for the feed.' },
  { key: 'illustration', short: 'Illustration', title: 'Illustration', intro: 'Painted and drawn work.' },
] as const;

export type SectionKey = (typeof SECTIONS)[number]['key'];

export const sectionRank = (key: string) => {
  const i = SECTIONS.findIndex((s) => s.key === key);
  return i === -1 ? SECTIONS.length : i;
};
