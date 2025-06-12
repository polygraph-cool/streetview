<script>
	import StreetScroller from "./StreetScroller.svelte";
	import { getContext, onMount } from "svelte";
	import data from "$data/annotations.csv";
	let mounted = $state(false);

	let markersByBlock = data.reduce((acc, marker) => {
			const block = marker.block;
			if (!acc[block]) {
				acc[block] = [];
			}
			acc[block].push(marker);
			return acc;
	}, {});

	onMount(() => {
		mounted = true;
	});
	
	let copy = getContext("copy");
</script>


<svelte:boundary onerror={(e) => console.error(e)}>

{#if mounted && markersByBlock}

	{#each copy.body || [] as { type, value: props, component }, idx (idx)}
		{#if type === "intro"}
			<StreetScroller {props} markers={markersByBlock[type]}/>
		{/if}
		{#if type === "intro2"}
			<StreetScroller {props} markers={markersByBlock[type]}/>
		{/if}
		{#if type === "intro3"}
			<StreetScroller {props} markers={markersByBlock[type]}/>
		{/if}
	{/each}
	<div style="height: 100vh;">
	</div>
{/if}

	<!-- <div class="intro" style="height:1200px;">
	</div>
	<StreetScroller />
	<div class="intro" style="height:1200px;">
	</div>
	<StreetScroller /> -->

</svelte:boundary>

<style>
	.intro {
		background-color: red;
	}

</style>