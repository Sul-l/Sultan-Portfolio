// Lightbox for the project page gallery. Click any plate to see it full screen.
// Next and previous with the buttons, arrow keys or a swipe; Esc or Close to leave.
//
// Built on <dialog>.showModal(): the rest of the page becomes inert and Esc closes it.
// Tab is also kept inside the viewer explicitly, and focus returns to the image
// that opened it. Without JS the plates are plain links to the large image.
//
// All listeners are on the document, so this module (loaded from the project page,
// run once) keeps working across ClientRouter page swaps without binding twice.

let links: HTMLAnchorElement[] = [];
let index = 0;
let opener: HTMLElement | null = null;
let swipeX: number | null = null;
let swipeY = 0;

const dialog = () => document.querySelector<HTMLDialogElement>('[data-lightbox-dialog]');
const part = <T extends HTMLElement>(d: HTMLDialogElement, name: string) =>
  d.querySelector<T>(`[data-lightbox-${name}]`)!;

function preload(link: HTMLAnchorElement | undefined) {
  if (link) new Image().src = link.href;
}

function show(d: HTMLDialogElement, i: number) {
  if (!links.length) return;
  index = (i + links.length) % links.length;
  const link = links[index];
  const thumb = link.querySelector('img');
  const img = part<HTMLImageElement>(d, 'image');

  img.removeAttribute('src');
  img.width = Number(link.dataset.width) || 0;
  img.height = Number(link.dataset.height) || 0;
  img.alt = thumb?.alt ?? '';
  img.src = link.href;
  img.classList.remove('is-entering');
  void img.offsetWidth; // restart the fade-in
  img.classList.add('is-entering');

  part(d, 'count').textContent = `${index + 1} of ${links.length}`;
  const caption = part(d, 'caption');
  caption.textContent = link.dataset.caption ?? '';
  caption.hidden = !link.dataset.caption;

  const single = links.length < 2;
  part(d, 'prev').hidden = single;
  part(d, 'next').hidden = single;
  if (!single) {
    preload(links[(index + 1) % links.length]);
    preload(links[(index - 1 + links.length) % links.length]);
  }
}

function open(link: HTMLAnchorElement) {
  const d = dialog();
  if (!d) return false;
  links = [...document.querySelectorAll<HTMLAnchorElement>('a[data-lightbox]')];
  opener = link;
  show(d, links.indexOf(link));
  d.showModal();
  part(d, 'close').focus();
  return true;
}

document.addEventListener('click', (e) => {
  const target = e.target as Element;

  const link = target.closest<HTMLAnchorElement>('a[data-lightbox]');
  if (link) {
    // Let new-tab and new-window clicks through to the plain link
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (open(link)) e.preventDefault();
    return;
  }

  const d = dialog();
  if (!d?.open) return;
  if (target.closest('[data-lightbox-close]')) d.close();
  else if (target.closest('[data-lightbox-prev]')) show(d, index - 1);
  else if (target.closest('[data-lightbox-next]')) show(d, index + 1);
  // A click on the empty space around the image closes the viewer
  else if (target === d || target.hasAttribute('data-lightbox-stage')) d.close();
});

document.addEventListener('keydown', (e) => {
  const d = dialog();
  if (!d?.open) return;
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    show(d, index + 1);
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    show(d, index - 1);
  } else if (e.key === 'Tab') {
    // Keep focus on the viewer's own buttons
    const stops = [...d.querySelectorAll<HTMLElement>('button:not([hidden])')];
    if (!stops.length) return;
    const at = stops.indexOf(document.activeElement as HTMLElement);
    const nextStop = e.shiftKey ? (at <= 0 ? stops.length - 1 : at - 1) : at === stops.length - 1 ? 0 : at + 1;
    e.preventDefault();
    stops[nextStop].focus();
  }
});

// Swipe left or right on touch screens
document.addEventListener('pointerdown', (e) => {
  const d = dialog();
  if (!d?.open || e.pointerType !== 'touch' || !(e.target as Element).closest('[data-lightbox-stage]')) return;
  swipeX = e.clientX;
  swipeY = e.clientY;
});
document.addEventListener('pointerup', (e) => {
  const d = dialog();
  if (swipeX === null || !d?.open) return;
  const dx = e.clientX - swipeX;
  const dy = e.clientY - swipeY;
  swipeX = null;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(d, dx < 0 ? index + 1 : index - 1);
});
document.addEventListener('pointercancel', () => (swipeX = null));

// <dialog> "close" does not bubble, so listen in the capture phase.
document.addEventListener(
  'close',
  (e) => {
    const d = e.target as HTMLElement;
    if (!d.matches?.('[data-lightbox-dialog]')) return;
    part<HTMLImageElement>(d as HTMLDialogElement, 'image').removeAttribute('src');
    if (opener?.isConnected) opener.focus();
    opener = null;
  },
  true,
);

// Leaving the page (e.g. the browser's back button) closes the viewer first.
document.addEventListener('astro:before-swap', () => dialog()?.close());
