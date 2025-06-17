<script>
	import StreetScroller from "./StreetScroller.svelte";
	import { browser } from '$app/environment';
	import { getContext, onMount } from "svelte";
	import useWindowDimensions from "$runes/useWindowDimensions.svelte.js";
	import data from "$data/annotations.csv";
	import Section from "./Section.svelte";
	import { div } from "three/tsl";
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

	console.log(copy)

</script>


<svelte:boundary onerror={(e) => console.error(e)}>



{#if mounted && markersByBlock && height}
	{#each copy.body || [] as { type, value: props, component }, idx (idx)}
		{#if type === "intro"}
			<StreetScroller {props} {type} markers={markersByBlock[type]} count={"first"} height={height}/>
		{:else if type === "intro2"}
			<StreetScroller {props} {type} markers={markersByBlock[type]} count={null}	height={height}/>
		{:else if type === "intro3"}
			<StreetScroller {props} {type} markers={markersByBlock[type]} count={null}	height={height}/>
		{:else if type === "section"}
			<div class="text-section {props.className}">
				{#each props.section || [] as { type, value: props, component }, idx (idx)}
					{#if type === "text"}
						<p>{@html props}</p>
					{/if}
				{/each}
			</div>

	  	
		{/if}
	{/each}


	<div class="head" style="">
		<h1>{copy.meta.title}</h1>
		<h3>{copy.meta.description}</h3>
		<p>{copy.meta.byline}</p>
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
	.head {
		font-family: 'Atlas Grotesk';
		text-align: center;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	.intro {
		background-color: red;
	}

	.text-section {
		font-family: var(--sans);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		font-size: 18px;
		max-width: 600px;
		margin: 0 auto;
		padding: 100px 0;
	}	

</style>