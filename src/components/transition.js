import { crossfade } from 'svelte/transition';
import { quintOut } from 'svelte/easing';

export const [send, receive] = crossfade({
	duration: (d) => Math.sqrt(d * 200),

	fallback(node, params) {
		const style = getComputedStyle(node);
		const transform = style.transform === 'none' ? '' : style.transform;

		return {
			duration: 1500,
			easing: quintOut,
			css: (t) => `
				transform: ${transform} scale(${1});
				opacity: ${t}
			`
		};
	}
});