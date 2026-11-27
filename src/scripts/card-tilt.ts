// Tilts a project card's frame slightly toward the mouse while it is lifted on hover.
// Writes two CSS variables (--rx, --ry) once per animation frame; global.css turns
// them into a rotate transform, so the work stays on the GPU.
//
// Listeners sit on the document, so they keep working across ClientRouter page swaps
// and are never bound twice. Mouse and trackpad only, and off for reduced motion.
// Loaded once from Base.astro.

const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
const MAX_TILT = 5; // degrees at the frame's edge

let card: HTMLElement | null = null;
let well: HTMLElement | null = null;
let px = 0;
let py = 0;
let frame = 0;

function release() {
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
  well?.style.removeProperty('--rx');
  well?.style.removeProperty('--ry');
  card = well = null;
}

function paint() {
  frame = 0;
  if (!card || !well) return;
  // Measure the card, not the frame: the frame is the element being transformed,
  // so its box would shift under the pointer and make the tilt jitter.
  const r = card.getBoundingClientRect();
  const nx = Math.min(Math.max((px - r.left) / r.width, 0), 1) - 0.5;
  const ny = Math.min(Math.max((py - r.top) / r.height, 0), 1) - 0.5;
  well.style.setProperty('--ry', `${(nx * 2 * MAX_TILT).toFixed(2)}deg`);
  well.style.setProperty('--rx', `${(-ny * 2 * MAX_TILT).toFixed(2)}deg`);
}

document.addEventListener(
  'pointermove',
  (e) => {
    if (e.pointerType !== 'mouse' || !fine.matches || calm.matches) return;
    const next = (e.target as Element).closest<HTMLElement>('.card');
    if (next !== card) {
      release();
      card = next;
      well = next?.querySelector<HTMLElement>('.card__well') ?? null;
    }
    if (!card) return;
    px = e.clientX;
    py = e.clientY;
    if (!frame) frame = requestAnimationFrame(paint);
  },
  { passive: true },
);

document.documentElement.addEventListener('pointerleave', release);
document.addEventListener('astro:before-swap', release);
