<script>
	import { getContext } from "svelte";
	import Footer from "$components/Footer.svelte";
	import StreetView from "./StreetView.svelte";
	import useWindowDimensions from "$runes/useWindowDimensions.svelte.js";
	import { easeCubicInOut } from 'd3-ease';

	import Scrolly from "$components/helpers/Scrolly.svelte";

	let waypoints = {
		0: [6.18, -.002],
		1: [3.961244051213098,-0.04427003953391351],
		2: [3.961244051213098,-0.04427003953391351],
		3: [3.961244051213098,-0.04427003953391351],
	}

	let _triggerArt = $state([]);
	let textBlocks = [1,2,3]
	let scrollY = $state(0);
	let value = $state();
	let percentScrolledValues = $state([]);

	let dimensions = new useWindowDimensions();

	let position = $state([0, 0]);

	$effect(() => {
		if (value === undefined || value === null) {
			position = [0, 0];
			return;
		}
		
		const currentWaypoint = waypoints[value] ?? [0, 0];
		const prevWaypoint = waypoints[value - 1] ?? currentWaypoint;
		const rawProgress = percentScrolledValues[value] ?? 0;
		
		// Apply easing to the progress
		const easedProgress = easeCubicInOut(rawProgress);
		
		// Interpolate both coordinates using eased progress
		const x = prevWaypoint[0] + (currentWaypoint[0] - prevWaypoint[0]) * easedProgress;
		const y = prevWaypoint[1] + (currentWaypoint[1] - prevWaypoint[1]) * easedProgress;
		
		position = [x, y];
	});

	function constrain(n, low, high) {
		return Math.max(Math.min(n, high), low);
	}

	$effect(() => {
		percentScrolledValues = _triggerArt.map((el, i) => {
			// Get the element's position relative to the top of the page
			const elementTop = el.getBoundingClientRect().top + window.scrollY;
			const elementHeight = el.getBoundingClientRect().height;
			
			// Calculate the start and end points for the scroll animation
			const sectionStart = elementTop - dimensions.height;
			const sectionEnd = elementTop;
			
			// Calculate how far we've scrolled through this section
			let offset = scrollY - sectionStart;
			offset = constrain(offset, 0, sectionEnd - sectionStart);
			
			// Calculate the percentage through the section
			let percentScrolled = offset / (sectionEnd - sectionStart);
			return constrain(percentScrolled, 0, 1);
		});
	});

	// Example panorama URL - you should replace this with your actual Google Street View panorama URL
	const panoramaUrl = "assets/images/full.png";

</script>

<svelte:window bind:scrollY />

<svelte:boundary onerror={(e) => console.error(e)}>
	<div class="intro" style="height:1200px;">
	</div>
	
	<div class="wrapper">
		<div class="container">
			<p class="moving" style="left: {position[0]}%; background:black;color:white; font-family: monospace;">
				Value: {value}, Progress: {percentScrolledValues[value] ? percentScrolledValues[value].toFixed(2) : '0.00'}, Position: {position.map(x => x.toFixed(2)).join(', ')}
			</p>
			<StreetView 
				panoramaUrl={panoramaUrl}
				coords={position}
			/>
		</div>

		<div class="text">
			<Scrolly 
				bind:value 
				top={-100} 
				bottom={-100} 
				increments={10}
			>
				{#each textBlocks as step, i}
					{@const active = value === i}
					<div class:active class="step scrolly-block" bind:this={_triggerArt[i]}>
						<p style="opacity: 1">hola</p>
					</div>
				{/each}
			</Scrolly>
		</div>
	</div>
</svelte:boundary>

<style>
	.intro {
		height: 1200px;
		background-color: red;
	}
	.wrapper {
		position: relative;
		/* height: 300vh; */
	}

	.container {
		position: sticky;
		top: 0;
		height: 100%;
		width: 100%;
		pointer-events: none;
	}

	.container p {
		position: absolute;
		top: 50%;
		z-index: 10000;
	}

	.moving {
		transition: left 0.1s linear;
	}

	.scrolly-block {
		position: relative;
		z-index: 1;
		height: 500px;
		background-color: rgba(255,255,0,0.5);
		margin-bottom: 100vh;
	}

	p {
		margin: 0;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		overflow-x: hidden;
	}
</style>