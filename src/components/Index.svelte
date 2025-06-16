<script>
	import StreetScroller from "./StreetScroller.svelte";
	import { browser } from '$app/environment';
	import { getContext, onMount } from "svelte";
	import useWindowDimensions from "$runes/useWindowDimensions.svelte.js";
	import data from "$data/annotations.csv";
	let mounted = $state(false);
	let height = $state(null);
	let markersByBlock = data.reduce((acc, marker) => {
			const block = marker.block;
			if (!acc[block]) {
				acc[block] = [];
			}
			acc[block].push(marker);
			return acc;
	}, {});

	let dimensions = new useWindowDimensions();

    $effect(() => {
		if(mounted && height === null) {
			if(dimensions.height > 0) {
				height = dimensions.height;
			}
		}
	});


	onMount(() => {
		mounted = true;
		
	});
	
	let copy = getContext("copy");

</script>


<svelte:boundary onerror={(e) => console.error(e)}>



{#if mounted && markersByBlock && height}

	{#each copy.body || [] as { type, value: props, component }, idx (idx)}
		{#if type === "intro"}
			<StreetScroller {props} {type} markers={markersByBlock[type]} count={"first"} height={height}/>
		{/if}
		{#if type === "intro2"}
			<StreetScroller {props} {type} markers={markersByBlock[type]} count={null}	height={height}/>
		{/if}
		{#if type === "intro3"}
			<StreetScroller {props} {type}markers={markersByBlock[type]} count={null}	height={height}/>
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