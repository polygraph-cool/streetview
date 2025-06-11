<script>
	import StreetView from "./StreetView.svelte";
	import useWindowDimensions from "$runes/useWindowDimensions.svelte.js";
	import { easeCubicInOut } from 'd3-ease';
    import { onMount } from "svelte";
	import Scrolly from "$components/helpers/Scrolly.svelte";

	let { props } = $props();

    let waypoints = {};
    let waysSet = $state(false);
    let zoom = $state(50);
    let zoomLevels = {};

    onMount(() => {
        console.log(props.slides);

        props.slides.forEach((slide, i) => {
            waypoints[i] = slide.coords.split(",").map(d => +d);
            zoomLevels[i] = +slide.zoom;
        });
        waysSet = true;
    });
    

	
	let _triggerArt = $state([]);
	let textBlocks = [1,2,3]
	let scrollY = $state(0);
	let value = $state();
	let percentScrolledValues = $state([]);

	let dimensions = new useWindowDimensions();
	let position = $state([0, 0]);

	$effect(() => {
        if(waysSet) {
            if (value === undefined || value === null) {
                position = waypoints[0];
                zoom = 50;
                return;
            }
            
            const currentZoom = zoomLevels[value] ? zoomLevels[value] : 50;
            const prevZoom = zoomLevels[value - 1] ?? currentZoom;

            const currentWaypoint = waypoints[value] ?? waypoints[0];
            const prevWaypoint = waypoints[value - 1] ?? currentWaypoint;
            const rawProgress = percentScrolledValues[value] ?? 0;
            
            // Apply easing to the progress
            const easedProgress = easeCubicInOut(rawProgress);
            
            // Interpolate both coordinates using eased progress
            const x = prevWaypoint[0] + (currentWaypoint[0] - prevWaypoint[0]) * easedProgress;
            const y = prevWaypoint[1] + (currentWaypoint[1] - prevWaypoint[1]) * easedProgress;
            zoom = prevZoom + (currentZoom - prevZoom) * easedProgress;
            position = [x, y];
        }
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
	const panoramaUrl = `assets/images/${props.panorama_id}.jpg`;

</script>

<svelte:window bind:scrollY />

<svelte:boundary onerror={(e) => console.error(e)}>
	{#if waysSet}
        <div class="wrapper">
            <div class="container value-{value}">
                <p class="moving" style="left: {position[0]}%; background:black;color:white; font-family: monospace;">
                    Value: {value}, Progress: {percentScrolledValues[value] ? percentScrolledValues[value].toFixed(6) : '0.00'}, Position: {position.map(x => x.toFixed(6)).join(', ')}
                </p>
                {#if position}
                    <StreetView 
                        panoramaUrl={panoramaUrl}
                        coords={position}
                        zoom={zoom ? zoom : 50}
                    />
                {/if}
            </div>
            <div class="text">
                <Scrolly 
                    bind:value 
                    top={-100} 
                    bottom={-100} 
                    increments={10}
                >
                    {#each props.slides as step, i}
                        {@const active = value === i}
                        <div class:active class="step scrolly-block" bind:this={_triggerArt[i]}>
                            <div class="text-wrapper">
                                <p class="text-fg" style="opacity: 1">
                                    <span class="text-inner">{step.text}</span>
                                </p>
                                <p aria-hidden="true" class="text-bg" style="opacity: 1">
                                    <span class="text-inner">{step.text}</span>
                                </p>
                            </div>
                            
                        </div>
                    {/each}
                </Scrolly>
            </div>
        </div>
    {/if}

</svelte:boundary>

<style>
    .container {
		position: sticky;
		top: 0;
		height: 100%;
		width: 100%;
		pointer-events: none;
	}
    .text {
        /* display: none; */
    }
	.text-wrapper {
		position: relative;
		margin-left: 100px;
		max-width: 500px;
	}

	.text-wrapper .text-inner {
		font: inherit;
		font-family: monospace;
		font-weight: 600;
	}

	p.text-bg, p.text-fg {
		margin: 0 auto 30px;
		letter-spacing: 0px;
		-ms-text-size-adjust: 100%;
		-moz-text-size-adjust: 100%;
		-webkit-text-size-adjust: 100%;
		text-size-adjust: 100%;
	}

	.text-fg {
		z-index: 1;
		position: relative;
		-webkit-font-smoothing: antialiased;
		pointer-events: all;
	}

	.text-fg .text-inner, .text-bg .text-inner {
		padding: 14px 0 11px;
		box-shadow: 15px 0 #fff0, -15px 0 #fff0;
		-webkit-box-decoration-break: clone;
		box-decoration-break: clone;
		background-color: #fff0;
		vertical-align: baseline;
	}

	.text-bg {
		position: absolute;
		top: 0;
		-webkit-font-smoothing: antialiased;
		left: 0;
		opacity: .95;
		width: 100%;
	}

	.text-fg span {
		letter-spacing: 0px;
		-ms-text-size-adjust: 100%;
		-moz-text-size-adjust: 100%;
		-webkit-text-size-adjust: 100%;
		text-size-adjust: 100%;
		-webkit-font-smoothing: antialiased;
		vertical-align: baseline;
		transform: translate(0);
		margin-block-start: 1em;
		margin-block-end: 1em;
		margin-inline-start: 0px;
		margin-inline-end: 0px;
		font-variant-ligatures: normal;
	}

	.text-bg .text-inner {
		color: var(--color-bg);
		background-color: var(--color-bg);
		box-shadow: 15px 0 var(--color-bg), -15px 0 var(--color-bg);
	}

	.intro {
		height: 1200px;
		background-color: red;
	}
	.wrapper {
		position: relative;
		/* height: 300vh; */
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