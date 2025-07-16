<script>
	import { setContext } from "svelte";
	import { browser } from "$app/environment";
	import Meta from "$components/Meta.svelte";
	import Index from "$components/Index.svelte";
	import copy from "$data/copy.json";
	import version from "$utils/version.js";

	let { data } = $props();

	version();

	const preloadFont = [
		"https://pudding.cool/assets/fonts/atlas/AtlasGrotesk-Regular-Web.woff2",
		"https://pudding.cool/assets/fonts/atlas/AtlasGrotesk-Bold-Web.woff2",
		"https://pudding.cool/assets/fonts/atlas/AtlasTypewriter-Medium-Web.woff2"
	];

	setContext("copy", copy);
	setContext("data", data);
</script>

<Meta title={copy.meta.title} description={copy.meta.description} {preloadFont} />
<Index />
