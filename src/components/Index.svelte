<script>
	import GridScroller from "./GridScroller.svelte";
	import StreetScroller from "./StreetScroller.svelte";
	import Ranking from "./Ranking.svelte";
	import { browser } from '$app/environment';
	import VideoPlayer from "./VideoPlayer.svelte";
	import { getContext, onMount } from "svelte";
	import useWindowDimensions from "$runes/useWindowDimensions.svelte.js";
	import data from "$data/annotations.csv";
    import ExternalLink from "@lucide/svelte/icons/external-link";
	import Footer from "./Footer.svelte";
	import { isModalOpen, modalContent } from '$utils/appState.svelte.js';

	let scrollY = $state(0);
	let mounted = $state(false);
	let height = $state(null);
	let width = $state(null);
	let markersByBlock = data.reduce((acc, marker) => {
			const block = marker.block;
			if (!acc[block]) {
				acc[block] = [];
			}
			acc[block].push(marker);
			return acc;
	}, {});

	let guesses = $state({});
	let wrongAnswers = $state({});
	let unlockedTitles = $state({});


	

	let dimensions = new useWindowDimensions();

    $effect(() => {
		if(mounted && height === null) {
			if(dimensions.height > 0) {
				height = dimensions.height;
				width = dimensions.width;
			}
		}
	});


	onMount(() => {
		mounted = true;
		
	});
	
	let copy = getContext("copy");
	$inspect(copy);


	function showHint() {
		modalContent.set({
			type: 'image',
			src: 'assets/images/beware_0.jpg'
		});
		isModalOpen.set(true);
		setTimeout(() => {
			isModalOpen.set(false);
		}, 2000);
	}

	function checkGuess(key) {
		const guess = guesses[key] || '';
		if (guess.toLowerCase() === 'unisex') {
			unlockedTitles[key] = 'Unisex';
		} else {
			guesses[key] = '';
			wrongAnswers[key] = true;
			setTimeout(() => {
				wrongAnswers[key] = false;
			}, 2000);
		}
	}

</script>

<svelte:window bind:scrollY />

<!-- svelte-ignore a11y_missing_attribute -->
<!-- svelte-ignore a11y_media_has_caption -->
<svelte:boundary onerror={(e) => console.error(e)}>


{#if mounted && markersByBlock && height}

	<div class="masthead">
		<a href="https://pudding.cool" target="_blank"><img src="assets/branding/main.png" alt=""></a>
	</div>

	{#each copy.body || [] as { type, value: props, component }, idx (idx)}
		{#if type === "intro"}
			<!-- <StreetScroller {props} {type} markers={markersByBlock[type]} count={"first"} height={height} width={width} {scrollY}/> -->
		{:else if type === "intro2"}
			<!-- <StreetScroller {props} {type} markers={markersByBlock[type]} count={null}	height={height} width={width} {scrollY}/> -->
		{:else if type === "intro3"}
			<!-- <StreetScroller {props} {type} markers={markersByBlock[type]} count={null}	height={height} width={width} {scrollY}/> -->
		{:else if type === "imageGridVideo"}
			<div class="text-section">
				<VideoPlayer {scrollY} {height}/>
			</div>
		{:else if type === "gridScroller"}
			<div class="grid-section">
				{#each props.slides as slide, i}
					<div class="text-section">
						 <p>{slide.text}
						 </p>
					</div>

					{#if ["acab", "fuhgeddaboudit", "covid","fuck"].indexOf(slide.images) > -1}
						<GridScroller height={height} slide={slide} {scrollY}/>
					{/if}
				{/each}
			</div>			
		{:else if type === "head"}
			<div class="head" style="">
				<h1>{copy.meta.title}</h1>
				<h3>{copy.meta.description}</h3>
				<p>{@html copy.meta.byline}</p>
			</div>
		{:else if type === "maps"}
			<h4 class="map-section-title">{props.mapsTitle}</h4>

			<div class="map-section">
				{#each props.slides as slide, i}
					{@const key = `${idx}-${i}`}
					<div class="map-slide map-slide-{slide.width}">
						<div class="map-slide-text-wrapper">
							<p class="map-slide-title">{@html unlockedTitles[key] || slide.title}
							{#if slide.img !== "broadway-zoom.jpg"}
								<span class="map-slide-matches">{slide.matches} matches</span>
							{/if}
							</p>
							<p class="map-slide-text">
								{@html slide.text}
								{#if slide.title === '???' && !unlockedTitles[key]}
									<form class="guess-form" on:submit|preventDefault={() => checkGuess(key)}>
										<input type="text" placeholder="Guess word" bind:value={guesses[key]}>
										<button type="submit">Submit</button>
										{#if wrongAnswers[key]}
											<span class="wrong-answer">Wrong</span>
										{/if}
									</form>
								{/if}
								{#if slide.title == "Beware"}
									<button class="map-slide-button-hint" on:click={showHint}>View hint!</button>
								{/if}
								{#if slide.img !== "broadway-zoom.jpg"}
									{#if slide.title !== "???"}
										<a target="_blank" href="https://www.alltext.nyc/search?q={slide.title}">View Images of &ldquo;{slide.title}&rdquo; <span><ExternalLink color="white" /></span></a>
									{:else if unlockedTitles[key] && slide.title == "???"}
										<a target="_blank" href="https://www.alltext.nyc/search?q=unisex">View Images of &ldquo;Unisex&rdquo; <span><ExternalLink color="white" /></span></a>
									{/if}
								{/if}
							</p>	
						</div>
						
						<img alt="Map of NYC showing the location of text that appears in Google Street View matching the phrase &ldquo;{slide.title}&rdquo;" src="assets/images/{slide.img}" style="margin-bottom:50px;">
					</div>
				{/each}
			</div>

		{:else if type === "section"}
			{@const className = props.className}
			<div class="text-section {className}">
				{#each props.section || [] as { type, value: props, component }, idx (idx)}

					{#if type === "text"}
						<p>{@html props}</p>
					{/if}

					{#if type === "image"}
						<img alt="Map of NYC showing the location of text that appears in Google Street View matching the phrase &ldquo;{props.replace('.jpg', '')}&rdquo;" src='assets/images/{props}' style="margin-bottom:{className === "pizza" ? '10px' : '50px'};">
						{#if className === "pizza"}
							<p class="map-slide-text">
								<a target="_blank" href="https://www.alltext.nyc/search?q=pizza">View Images of &ldquo;Pizza&rdquo; <span><ExternalLink color="white" /></span></a>
							</p>
						{/if}
					{/if}
					
				{/each}
			</div>
		{:else if type === "ranking"}
			<Ranking {height} {props} {width} />
		{/if}
	{/each}

	<Footer />

	



{/if}

</svelte:boundary>

<style>
	.map-section-title {
		font-size: 24px;
		margin-top: 60px;
		font-weight: 600;
		text-align: left;
		margin: 0 auto;
		font-family: var(--sans);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		margin-bottom: 30px;
		opacity: 1;
		color: #ffc868;
		max-width: 600px;
		width: calc(100% - 20px);
	}
	.map-section {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
		max-width: 600px;
		width: calc(100% - 20px);
		margin: 0 auto;
		font-family: var(--sans);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	.map-slide-text-wrapper {
		/* height: 120px; */
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
		margin-bottom: 10px;
		margin-top: 0px;
	}
	.map-slide-matches {
		font-size: 12px;
		font-weight: 400;
		margin-bottom: 10px;
		margin-top: 5px;
		color: rgba(255,255,255,.8);
	}
	.map-slide-text {
		font-size: 14px;
		line-height: 1.5;
		opacity: 1;
		margin-top: 0px;
		color: rgba(255,255,255,.8);
	}

	.map-slide-text a {
		background-color: #3F3F3F;
		color: #fff;
		font-size: 12px;
		font-weight: 00;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		padding: 2px 5px;
		border-radius: 5px;
		text-decoration: none;
		text-decoration-color: #fff;
		text-decoration-thickness: 1px;
		text-underline-offset: 2px;
		text-decoration: underline;
		text-decoration-color: #999;
		text-decoration-thickness: 1px;
		text-underline-offset: 1px;
		white-space: nowrap;
	}

	.map-slide-text a span {
		width: 12px;
		display: inline-block;
		margin-left: 2px;
		font-size: 14px;
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
		max-width: 650px;
		width: calc(100% - 50px);
		margin: 0 auto;
	}
	.intro {
		background-color: red;
	}
	.map-slide-button-hint {
		display: inline-block;
		padding: 2px 5px;
		border-radius: 5px;
		text-decoration: underline;
		font-size: 12px;
		background-color: white;
		color: black;
		font-family: var(--sans);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		font-size: 12px;
		font-weight: 400;
	}

	.guess-form {
		margin-top: 10px;
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
		gap: 5px;
	}

	.guess-form input {
		border-radius: 3px;
		border: none;
		outline: none;
		background: #333;
		color: white;
		padding: 4px 6px;
		font-size: 12px;
		width: 100px;
	}

	.guess-form button {
		padding: 4px 5px;
		font-size: 12px;
		outline: none;
		border: none;
		background: #FFF;
		color: black;
		min-height: 0;
		margin: 0px;
		border-radius: 3px;
	}

	.wrong-answer {
		color: #ff8e8e;
		font-size: 12px;
	}

	h1 {
		font-size: 89px;
		line-height: 1.1;
		margin-bottom: 50px;
		letter-spacing: -2px;
		text-transform: uppercase;
	}

	h3 {
		font-size: 36px;
	}

	.head p {
		font-size: 16px;
		opacity: .8;
	}

	@media only screen and (max-width: 650px) {
		.head {
			width: calc(100% - 20px);
		}
		h1 {
			font-size: 48px;
			margin-bottom: 10px;
		}

		h3 {
			font-size: 21px;
			max-width: 375px;
			margin: 0 auto;
		}
		.head p {
			font-size: 14px;
		}

		.map-slide-half {
			grid-column: 1 / -1;
		}
	}


</style>