<script>
	import StreetScroller from "./StreetScroller.svelte";
	import Carousel from "./Carousel.svelte";
	import { browser } from '$app/environment';
	import VideoPlayer from "./VideoPlayer.svelte";
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

	<div class="masthead">
		<a href="https://pudding.cool" target="_blank"><img src="assets/branding/main.png" alt=""></a>
	</div>

	{#each copy.body || [] as { type, value: props, component }, idx (idx)}
		{#if type === "intro"}
			<StreetScroller {props} {type} markers={markersByBlock[type]} count={"first"} height={height}/>
		{:else if type === "intro2"}
			<StreetScroller {props} {type} markers={markersByBlock[type]} count={null}	height={height}/>
		{:else if type === "intro3"}
			<StreetScroller {props} {type} markers={markersByBlock[type]} count={null}	height={height}/>
		{:else if type === "imageGridVideo"}
			<div class="text-section">
				<!-- <img src="assets/images/song.png" style="margin-bottom:50px;"> -->
				<!-- <button style="margin-bottom:50px;">Show me another set of images 🔀</button> -->
				 <VideoPlayer />
			</div>
		{:else if type === "carousel"}
			<Carousel />
		{:else if type === "head"}
			<div class="head" style="">
				<h1>{copy.meta.title}</h1>
				<h3>{copy.meta.description}</h3>
				<p>{copy.meta.byline}</p>
			</div>
		{:else if type === "maps"}
			<div class="map-section">
				{#each props.slides as slide, i}
					<div class="map-slide">
						<p>{@html slide.title}</p>
						<p>{@html slide.text}</p>
						<img src="assets/images/{slide.img}" style="margin-bottom:50px;">
					</div>
				{/each}
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

</svelte:boundary>

<style>
	.map-section {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
		max-width: 800px;
		margin: 0 auto;
		font-family: var(--sans);
	}
	.map-slide img {
		border-radius: 10px;
		border: 1px solid #3F3F3F;
	}
	.masthead {
		position: relative;
		z-index: 1000000000;
	}
	.masthead a {
		width: 100%;
		height: auto;
		display: block;
		margin: 0 auto;
		position: absolute;
		top: 20px;
		max-width: 190px;
		left: 0;
		right: 0;
		margin: 0 auto;
	}
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