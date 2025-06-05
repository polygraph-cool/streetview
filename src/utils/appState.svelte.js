// State management using Svelte 5 runes
let activebg = $state([]);
let loaded = $state(false);
let parallax_loaded = $state(false);
let y = $state(0);
let bgcolor = $state('black');

// Export derived values for reactive access
export let currentY = $derived(y);

// Getters for state values
export function getActiveBg() { return activebg; }
export function getLoaded() { return loaded; }
export function getParallaxLoaded() { return parallax_loaded; }
export function getY() { return y; }
export function getBgColor() { return bgcolor; }

// Setters for state values
export function setActiveBg(value) { activebg = value; }
export function setLoaded(value) { loaded = value; }
export function setParallaxLoaded(value) { parallax_loaded = value; }
export function updateScrollPosition(position) { y = position; }
export function setBgColor(value) { bgcolor = value; } 