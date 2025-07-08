<script>
	import GridScroller from "./GridScroller.svelte";
	import StreetScroller from "./StreetScroller.svelte";
	import Ranking from "./Ranking.svelte";
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
		{:else if type === "gridScroller"}
			<div class="grid-section">
				{#each props.slides as slide, i}
					<div class="text-section">
						 <p>The result is a search engine of much of what’s written in NYC’s streets, but limited to text that a Google Streetview car can capture; we’re, of course, missing text from places such as alleyways and parks, or anything too small to be viewable by the camera.
						 </p>
					</div>

					{#if slide.images == "acab" || slide.images == "fuhgeddaboudit"}
						<GridScroller height={height} slide={slide} />
					{/if}
				{/each}
			</div>			
		{:else if type === "head"}
			<div class="head" style="">
				<h1>{copy.meta.title}</h1>
				<h3>{copy.meta.description}</h3>
				<p>{copy.meta.byline}</p>
			</div>
		{:else if type === "maps"}
			<h4 class="map-section-title">{props.mapsTitle}</h4>

			<div class="map-section">
				{#each props.slides as slide, i}
					<div class="map-slide map-slide-{slide.width}">
						<div class="map-slide-text-wrapper">
							<p class="map-slide-title">{@html slide.title}</p>
							<p class="map-slide-text">{@html slide.text}</p>
						</div>
						
						<img src="assets/images/{slide.img}" style="margin-bottom:50px;">
					</div>
				{/each}
			</div>

		{:else if type === "section"}
			<!-- <div class="text-section {props.className}">
				{#each props.section || [] as { type, value: props, component }, idx (idx)}

					{#if type === "text"}
						<p>{@html props}</p>
					{/if}

					{#if type === "image"}
						<img src={props.media} style="margin-bottom:50px;">
					{/if}
				{/each}
			</div> -->
		{:else if type === "ranking"}
			<Ranking {height} {props} />
		{/if}
	{/each}



	



{/if}

</svelte:boundary>

<style>
	.map-section-title {
		font-size: 18px;
		margin-top: 60px;
		font-weight: 400;
		text-align: left;
		max-width: 600px;
		margin: 0 auto;
		font-family: var(--sans);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		margin-bottom: 30px;
		opacity: .6;
	}
	.map-section {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
		max-width: 600px;
		margin: 0 auto;
		font-family: var(--sans);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	.map-slide-text-wrapper {
		height: 120px;
	}
	.map-slide {
		/* display: flex; */
		/* flex-direction: column; */
		/* align-items: flex-start; */
		/* justify-content: flex-end; */
	}

	.map-slide-full {
		width: 100%;
		grid-column: 1 / -1;
	}
	.map-slide img {
		border-radius: 10px;
		border: 1px solid #3F3F3F;
	}
	.map-slide-title {
		font-size: 24px;
		font-weight: 400;
		margin-bottom: 0px;
		margin-top: 0px;
	}
	.map-slide-text {
		font-size: 14px;
		line-height: 1.5;
		opacity: .8;
		margin-top: 0px;
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