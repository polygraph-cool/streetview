<script>
	import StreetView from "./StreetView.svelte";
    import debounce from "lodash.debounce";
	import { easeCubicInOut } from 'd3-ease';
    import { onMount } from "svelte";
	import Scrolly from "$components/helpers/Scrolly.svelte";
	import { isPageLoading } from "$utils/appState.svelte.js";

	let { props, markers, count, height, type, scrollY, width } = $props();

    let waypoints = {};
    let waysSet = $state(false);
    let zoom = $state(50);
    let zoomLevels = {};
    let panoramaHasLoaded = $state(false);

	$effect(() => {
		if(count === 'first' && panoramaHasLoaded){
			isPageLoading.set(false);
		}
	});

    onMount(() => {
        props.slides.forEach((slide, i) => {
			if(width < 600){
				waypoints[i] = slide.coordsMobile.split(",").map(d => +d);
			}
			else {
				waypoints[i] = slide.coords.split(",").map(d => +d);
			}
            
            zoomLevels[i] = +slide.zoom;
        });
        waysSet = true;
    });

	
	let _triggerArt = $state([]);
	let value = $state();
    let valueSet = $state(null);
	let percentScrolledValues = $state([]);

	let position = $state([0, 0]);

    $effect(() => {
        if(value === undefined || value === null){
            if(valueSet === null || valueSet === undefined){
                valueSet = undefined;
            }
            else if (valueSet === props.slides.length - 1){
                valueSet = props.slides.length - 1;
            }
            else {
                valueSet = value;
            }
        }
        else {
            valueSet = value;
        }
    });

	const debouncedSetPosition = debounce((newPosition, newZoom) => {
			if(newPosition !== undefined && newPosition !== null){
				position = newPosition.map(d => +d.toFixed(6));
			}
			if(newZoom !== undefined && newZoom !== null){
				zoom = +newZoom.toFixed(6);
			}
    }, 10);

	$effect(() => {
		if (waysSet) {
			if (valueSet === undefined || valueSet === null) {
				debouncedSetPosition(
					props.default_coords.split(",").map((d) => +d),
					50
				);
				return;
			}

			const currentZoom = zoomLevels[valueSet] ? zoomLevels[valueSet] : 50;
			const currentWaypoint = waypoints[valueSet] ?? waypoints[0];

			if (width < 600) {
				// On mobile, jump directly to the end state of the current slide
				debouncedSetPosition(currentWaypoint, currentZoom);
			} else {
				// On desktop, tween between the previous and current slide states
				const prevZoom = zoomLevels[valueSet - 1] ?? 50;
				const prevWaypoint = waypoints[valueSet - 1] ?? props.default_coords.split(",").map((d) => +d);
				const rawProgress = percentScrolledValues[valueSet] ?? 0;

				// Apply easing to the progress
				const easedProgress = easeCubicInOut(rawProgress);

				// Interpolate both coordinates using eased progress
				const x = prevWaypoint[0] + (currentWaypoint[0] - prevWaypoint[0]) * easedProgress;
				const y = prevWaypoint[1] + (currentWaypoint[1] - prevWaypoint[1]) * easedProgress;
				const zoomed = Math.round(prevZoom + (currentZoom - prevZoom) * easedProgress);

				// Use debounced function instead of direct assignment
				debouncedSetPosition([x, y], zoomed);
			}
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

			// Check if element has isLast class
			const isLast = el.classList.contains('isLast');
			const isFirstIntro = el.classList.contains('isFirstIntro');
            let sectionStart = elementTop - (elementHeight*1.5);//dimensions.height;
            if(isLast){
                sectionStart = elementTop - (elementHeight);//dimensions.height;
            }
			if(isFirstIntro){
				sectionStart = elementTop - (elementHeight);//dimensions.height;
			}
			// const sectionStart = elementTop - (elementHeight*1.5);//dimensions.height;
			const sectionEnd = elementTop - 200;
			
			// Calculate how far we've scrolled through this section
			let offset = scrollY - sectionStart;
			offset = constrain(offset, 0, sectionEnd - sectionStart);
			
			// Calculate the percentage through the section
			// Round to nearest 200th (0.005)
			let percentScrolled = Math.round((offset / (sectionEnd - sectionStart)) * 200) / 200;
			// let percentScrolled = offset / (sectionEnd - sectionStart);
			return constrain(percentScrolled, 0, 1);
		});
	});

	// Example panorama URL - you should replace this with your actual Google Street View panorama URL
	const panoramaUrl = width > 600 ? `assets/images/${props.panorama_id}.jpg` : `assets/images/${props.panorama_id}_mobile.jpg`;

</script>

<svelte:boundary onerror={(e) => console.error(e)}>
	{#if waysSet}
        <div class="wrapper" id={type}>
            <div class="container value-{valueSet} {value || value === 0 ? 'container-visible' : ''}" style="height: {height}px;">
				{#if count === "first"}
	
					<div class="opener" style="height:{height}px; opacity:{percentScrolledValues[0] ? (1-percentScrolledValues[0]) : 1};">
						<p class="text-fg" style="opacity: 1">
							<span class="text-inner">{props.slides[0].text}</span>
						</p>
						<p aria-hidden="true" class="text-bg" style="opacity: 1">
							<span class="text-inner">{props.slides[0].text}</span>
						</p>
						{#if !panoramaHasLoaded}
							<p class="loading"><span>Loading...Pls Wait!</span></p>
						{/if}
					</div>

					<div class="screen" style="height:{height}px; opacity:{percentScrolledValues[0] ? (1-percentScrolledValues[0]) : 1};">

					</div>
				{/if}

                <!-- <p class="moving" style="left: {position[0]}%; background:black;color:white; font-family: monospace; z-index: 10000000000000;">
                    Value: {value}, Progress: {percentScrolledValues[value] ? percentScrolledValues[value].toFixed(6) : '0.00'}, Position: {position.map(x => x.toFixed(6)).join(', ')}
                </p> -->
                {#if position}
                    <StreetView 
                        panoramaUrl={panoramaUrl}
                        coords={position}
                        zoom={zoom ? zoom : 50}
                        value={valueSet}
                        markersRaw={markers}
                        type={type}
						width={width}
						height={height}
						defaultCoords={props.default_coords.split(",").map(d => +d)}
                        bind:isPanoramaLoaded={panoramaHasLoaded}
                    />
                {/if}
				<p class="source">Source: Google Street View, {props.source}</p>
            </div>
            <div class="text" style="">
                <Scrolly 
                    bind:value 
                    top={height/2} 
                    bottom={-100}
                    increments={10}
                >
                    {#each props.slides as step, i}
                        {@const active = valueSet === i}
                        {@const isFirst = i === 0}
                        {@const isFirstIntro = i === 0 && count === "first"}
                        {@const isLast = i === props.slides.length - 1}
                        <div style="--height: {height}px;" class:active class:isLast class:isFirstIntro class:isFirst class="step-{i} scrolly-block" bind:this={_triggerArt[i]}>
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
        opacity: .2;
        transition: opacity 0.5s ease-in-out;
	}

    .container-visible {
        opacity: 1;
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
		font-family: 'Atlas Grotesk';
		/* font-weight: 600; */
	}

	p.text-bg, p.text-fg {
		margin: 0 auto 30px;
		letter-spacing: 0px;
		-ms-text-size-adjust: 100%;
		-moz-text-size-adjust: 100%;
		-webkit-text-size-adjust: 100%;
		text-size-adjust: 100%;
        font-size: 20px;
        color: var(--color-bg);
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
		pointer-events: none;
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
		color: rgba(0,0,0,0);
		background-color: var(--color-fg);
		box-shadow: 15px 0 var(--color-fg), -15px 0 var(--color-fg);
		pointer-events: none;
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

	p {
		margin: 0;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		overflow-x: hidden;
	}

	.openerNew {
		font-family: var(--sans);
		font-size: 64px;
		top: 50%;
		transform: translate(0,-50%);
		width: calc(100% - 200px);
		margin: 0 auto;
		left: 0;
		line-height: 1.1;
		right: 0;
		text-align: center;
	}

	.screen {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0,0,0,.5);
		z-index: 10000;
		height: 100vh;
		width: 100%;
	}

	.opener {
		height: 100vh;
		width: 100%;
		max-width: 500px;
		position: absolute;
		left: 0;
		right: 0;
		margin: 0 auto;
		z-index: 10000000000;
	}

	.opener .text-fg {
		opacity: 1;
		z-index: 10000000000;
		color: white;
	}
	
	.opener .text-bg span {
		background: #000;
		box-shadow: 15px 0 #000, -15px 0 #000;
		pointer-events: none;
	}

	.opener .text-fg, .opener .text-bg {
		font-family: var(--sans);
		text-align: center;
		font-size: 48px;
	}

	.opener p {
		top: 50%;
		transform: translate(0,-50%);
	}

	.opener p.loading {
		font-size:24px;
		position: absolute;
		bottom: 100px;
		left: 0;
		right: 0;
		font-family: var(--sans);
		top: auto;
		text-align: center;
		color: #000;
		z-index: 10000000000;
	}

	.opener p.loading span {
		background: rgb(116, 252, 208);
	}

	p.source {
		position: absolute;
		bottom: 0;
		right: 0;
		font-size: 10px;
		font-family: var(--sans);
		color: rgba(255,255,255,.8);
		background-color: #000;
		z-index: 10000000000;
		top: auto;
		padding: 0 3px 2px;
		z-index: 100000000000000000;

	}

	@media only screen and (max-width: 700px) {
		.text-wrapper {
			max-width: calc(100% - 200px);
			margin: 0 auto;
		}
	}

	@media only screen and (max-width: 500px) {
		.opener {
			max-width: calc(100% - 100px);
		}
		.opener .text-fg, .opener .text-bg {
			font-size: 32px;
		}

		.text-wrapper {
			max-width: calc(100% - 100px);
			margin: 0 auto;
		}

	}
	
</style>