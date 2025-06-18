<script>
	import StreetScroller from "./StreetScroller.svelte";
	import Carousel from "./Carousel.svelte";
	import { browser } from '$app/environment';
	import { getContext, onMount } from "svelte";
	import useWindowDimensions from "$runes/useWindowDimensions.svelte.js";
	import data from "$data/annotations.csv";
	import Section from "./Section.svelte";
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


<!-- svelte-ignore a11y_missing_attribute -->
<!-- svelte-ignore a11y_media_has_caption -->
<svelte:boundary onerror={(e) => console.error(e)}>



{#if mounted && markersByBlock && height}
	{#each copy.body || [] as { type, value: props, component }, idx (idx)}
		{#if type === "intro"}
			<StreetScroller {props} {type} markers={markersByBlock[type]} count={"first"} height={height}/>
		{:else if type === "intro2"}
			<StreetScroller {props} {type} markers={markersByBlock[type]} count={null}	height={height}/>
		{:else if type === "intro3"}
			<StreetScroller {props} {type} markers={markersByBlock[type]} count={null}	height={height}/>
		{:else if type === "imageGridVideo"}
			<div class="text-section">
				<img src="assets/images/song.png" style="margin-bottom:50px;">
				<button style="margin-bottom:50px;">Show me another set of images 🔀</button>
				<video src="assets/images/NYCText.mp4" controls></video>
			</div>
		{:else if type === "carousel"}
			<Carousel />
		{:else if type === "head"}
			<div class="head" style="">
				<h1>{copy.meta.title}</h1>
				<h3>{copy.meta.description}</h3>
				<p>{copy.meta.byline}</p>
			</div>	
		{:else if type === "section"}
			<div class="text-section {props.className}">
				
				{#each props.section || [] as { type, value: props, component }, idx (idx)}

					{#if type === "text"}
						<p>{@html props}</p>
					{/if}

					{#if type === "image"}
						<img src={props.media} style="margin-bottom:50px;">
					{/if}

				{/each}
			</div>
		{/if}
	{/each}


{/if}




	<!-- <div class="intro" style="height:1200px;">
	</div>
	<StreetScroller />
	<div class="intro" style="height:1200px;">
	</div>
	<StreetScroller /> -->

</svelte:boundary>

<style>
	button {
		background:black;
		color:white;
		margin:0 auto;
		display:block;
		border:1px solid #232323;
		padding:10px 20px;
		border-radius:15px;
		font-family: var(--sans);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		font-size: 18px;
	}
	.head {
		font-family: 'Atlas Grotesk';
		text-align: center;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	.intro {
		background-color: red;
	}

</style>