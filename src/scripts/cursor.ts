// Custom cursor: a small oxblood dot that follows the mouse exactly.
// Over project cards it opens into a circle reading "View", over the "All work"
// link on project pages it reads "Back".
//
// Only for devices with a real mouse or trackpad ((hover: hover) and (pointer: fine)).
// Where the system cursor should stay (text, links in body copy, form fields) is
// decided in global.css: wherever the computed cursor is not `none`, the dot hides.
//
// The element is attached to <html>, not <body>, so ClientRouter page swaps
// (which replace <body>) never remove or duplicate it. Loaded once from Base.astro.

const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
const root = document.documentElement;

let el: HTMLElement | null = null;
let label: HTMLElement | null = null;
let x = 0;
let y = 0;
let frame = 0;
let seen = false;

type State = '' | 'link' | 'view' | 'back' | 'hidden';

function build() {
  if (el) return;
  el = document.createElement('div');
  el.className = 'cursor';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<span class="cursor__dot"></span><span class="cursor__label"></span>';
  label = el.querySelector('.cursor__label');
}

function stateFor(target: Element | null): State {
  if (!target) return 'hidden';
  if (target.closest('.card, .hero__figure a, a[data-lightbox]')) return 'view';
  if (target.closest('a.back')) return 'back';
  if (getComputedStyle(target).cursor !== 'none') return 'hidden';
  if (target.closest('a, button, [role="button"]')) return 'link';
  return '';
}

function setState(state: State) {
  if (!el || !label) return;
  if (el.dataset.state === state) return;
  el.dataset.state = state;
  if (state === 'view') label.textContent = 'View';
  else if (state === 'back') label.textContent = 'Back';
}

function paint() {
  frame = 0;
  if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
}

function onMove(e: PointerEvent) {
  if (e.pointerType !== 'mouse') return;
  x = e.clientX;
  y = e.clientY;
  if (!seen) {
    seen = true;
    el?.classList.add('is-visible');
  }
  if (!frame) frame = requestAnimationFrame(paint);
}

function onOver(e: PointerEvent) {
  if (e.pointerType !== 'mouse') return;
  setState(stateFor(e.target as Element));
}

function onLeave() {
  seen = false;
  el?.classList.remove('is-visible');
}

// After a page swap the element under the pointer has changed without any
// pointerover event, so look it up again.
function refresh() {
  if (!el || !root.classList.contains('has-cursor')) return;
  if (!el.isConnected) root.append(el);
  if (seen) setState(stateFor(document.elementFromPoint(x, y)));
}

// Scrolling moves the page under a still pointer without any pointerover event.
let scrollFrame = 0;
function onScroll() {
  if (!seen || scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0;
    setState(stateFor(document.elementFromPoint(x, y)));
  });
}

function enable() {
  build();
  if (!el) return;
  root.classList.add('has-cursor');
  if (!el.isConnected) root.append(el);
  document.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerover', onOver, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  root.addEventListener('pointerleave', onLeave);
}

function disable() {
  root.classList.remove('has-cursor');
  el?.remove();
  onLeave();
  document.removeEventListener('pointermove', onMove);
  document.removeEventListener('pointerover', onOver);
  window.removeEventListener('scroll', onScroll);
  root.removeEventListener('pointerleave', onLeave);
}

function sync() {
  if (fine.matches) enable();
  else disable();
}

// The swap copies the new page's <html> attributes, which drops .has-cursor.
document.addEventListener('astro:after-swap', () => {
  if (fine.matches) root.classList.add('has-cursor');
  refresh();
});
document.addEventListener('astro:page-load', refresh);
fine.addEventListener('change', sync);
sync();
