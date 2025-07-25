<script>
	import "$styles/app.css";
	import Header from "$components/Header.svelte";
	import { isPageLoading } from '$utils/appState.svelte.js';
	import Modal from '$components/helpers/Modal.svelte';
	import useWindowDimensions from "$runes/useWindowDimensions.svelte.js";
	let dimensions = new useWindowDimensions();
	let { children } = $props();
</script>

<!-- <Header /> -->
<main id="content" style="height: {dimensions.height}px;" class:not-loaded={$isPageLoading}>
	{@render children?.()}
</main>
<Modal height={dimensions.height}/>

<style>
.not-loaded {
	height: var(--height);
	overflow: hidden;
	pointer-events: all;
}
</style>