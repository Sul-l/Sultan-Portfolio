// Project filters on the home page.
// The address bar remembers the choice (e.g. /#print), so links, refreshes and the
// "All work" link on a project page land on the right filter. Without JS the
// buttons stay hidden and every project shows.
//
// This module runs once (it is loaded from Base.astro) and sets the filters up
// again after every page swap from the ClientRouter. Each setup binds to the fresh
// DOM, and window listeners from the previous page are removed through an
// AbortController, so nothing is ever bound twice.

import type { TransitionBeforePreparationEvent } from 'astro:transitions/client';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let controller: AbortController | null = null;
let navigationType: string | undefined;
let latestTransition = 0;

function setup() {
  const bar = document.querySelector<HTMLElement>('[data-filters]');
  if (!bar || bar.dataset.ready !== undefined) return;
  bar.dataset.ready = '';

  controller?.abort();
  controller = new AbortController();
  const { signal } = controller;

  const items = [...document.querySelectorAll<HTMLElement>('[data-grid] > li')];
  const buttons = [...bar.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const keys = buttons.map((b) => b.dataset.filter);
  bar.hidden = false;

  const apply = (value: string) => {
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === value)));
    items.forEach((li) => {
      li.hidden = value !== 'all' && li.dataset.section !== value;
    });
  };

  // Cards glide to their new places. Each card gets a view transition name only
  // for the length of the animation, so it does not affect page navigation.
  const applyAnimated = (value: string) => {
    if (!document.startViewTransition || reduceMotion.matches) {
      apply(value);
      return;
    }
    const id = ++latestTransition;
    items.forEach((li) => (li.style.viewTransitionName = `card-${li.dataset.project}`));
    document.startViewTransition(() => apply(value)).finished.finally(() => {
      if (id !== latestTransition) return;
      items.forEach((li) => (li.style.viewTransitionName = ''));
    });
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const value = btn.dataset.filter ?? 'all';
      applyAnimated(value);
      // Keep the router's history state, or the back button stops working.
      history.replaceState(history.state, '', value === 'all' ? '#work' : `#${value}`);
    });
  });

  const fromHash = (scroll: boolean) => {
    const key = location.hash.slice(1);
    if (!keys.includes(key) || key === 'all') return;
    apply(key);
    if (scroll) document.getElementById('work')?.scrollIntoView();
  };
  // Back and forward restore the old scroll position, so don't jump to the grid then.
  fromHash(navigationType !== 'traverse');
  window.addEventListener('hashchange', () => fromHash(true), { signal });
}

document.addEventListener('astro:before-preparation', (e) => {
  navigationType = (e as TransitionBeforePreparationEvent).navigationType;
});
document.addEventListener('astro:before-swap', () => {
  controller?.abort();
  controller = null;
});
// after-swap runs before the new page is shown, so the right filter is already in
// place when the transition starts. page-load is a safety net.
document.addEventListener('astro:after-swap', setup);
document.addEventListener('astro:page-load', setup);
setup();
