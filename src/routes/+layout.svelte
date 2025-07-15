<script>
	import "$styles/app.css";
	import Header from "$components/Header.svelte";
	import { isPageLoading } from '$utils/appState.svelte.js';
	import Modal from '$components/helpers/Modal.svelte';

	let { children } = $props();

	$effect(() => {
		console.log('isPageLoading:', $isPageLoading);
	});
</script>

<!-- <Header /> -->
<main id="content" class:not-loaded={$isPageLoading}>
	{@render children?.()}
</main>
<Modal />

<style>
.not-loaded {
	height: 100vh;
	overflow: hidden;
	pointer-events: all;
}
</style>