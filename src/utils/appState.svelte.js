import { writable } from 'svelte/store';

// State management using Svelte stores
export const activeBg = writable([]);
export const loaded = writable(false);
export const parallaxLoaded = writable(false);
export const y = writable(0);
export const bgColor = writable('black');

export const isModalOpen = writable(false);
export const modalContent = writable({});
export const isPageLoading = writable(false); 