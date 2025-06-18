<script>
	import StreetView from "./StreetView.svelte";
	import useWindowDimensions from "$runes/useWindowDimensions.svelte.js";
    import debounce from "lodash.debounce";
	import { easeCubicInOut } from 'd3-ease';
    import { onMount } from "svelte";
	import Scrolly from "$components/helpers/Scrolly.svelte";

	let { props, markers, count, height, type } = $props();
	let dimensions = new useWindowDimensions();

    let waypoints = {};
    let waysSet = $state(false);
    let zoom = $state(50);
    let zoomLevels = {};

    onMount(() => {
        props.slides.forEach((slide, i) => {
            waypoints[i] = slide.coords.split(",").map(d => +d);
            zoomLevels[i] = +slide.zoom;
        });
        waysSet = true;
    });

	
	let _triggerArt = $state([]);
	let scrollY = $state(0);
	let value = $state();
    let valueSet = $state(null);
	let percentScrolledValues = $state([]);

	let position = $state([0, 0]);

    // Create a debounced function for setting position


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

	$effect(() => {

        const debouncedSetPosition = debounce((newPosition, newZoom) => {
			if(newPosition !== undefined && newPosition !== null){
				position = newPosition.map(d => +d.toFixed(6));
			}
			if(newZoom !== undefined && newZoom !== null){
				zoom = +newZoom.toFixed(6);
			}
        }, 70);

        if(waysSet) {
            if (valueSet === undefined || valueSet === null) {
                debouncedSetPosition(props.default_coords.split(",").map(d => +d),50);
                return;
            }
            
            const currentZoom = zoomLevels[valueSet] ? zoomLevels[valueSet] : 50;
            const prevZoom = zoomLevels[valueSet - 1] ?? 50;

            const currentWaypoint = waypoints[valueSet] ?? waypoints[0];
            const prevWaypoint = waypoints[valueSet - 1] ?? props.default_coords.split(",").map(d => +d);
            const rawProgress = percentScrolledValues[valueSet] ?? 0;
            
            // Apply easing to the progress
            const easedProgress = easeCubicInOut(rawProgress);
            
            // Interpolate both coordinates using eased progress
            const x = prevWaypoint[0] + (currentWaypoint[0] - prevWaypoint[0]) * easedProgress;
            const y = prevWaypoint[1] + (currentWaypoint[1] - prevWaypoint[1]) * easedProgress;
            const zoomed = Math.round(prevZoom + (currentZoom - prevZoom) * easedProgress);

            // Use debounced function instead of direct assignment
            debouncedSetPosition([x, y],zoomed);
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

            // console.log(el,i)
			// Check if element has isLast class
			const isLast = el.classList.contains('isLast');
            let sectionStart = elementTop - (elementHeight*1.5);//dimensions.height;
            if(isLast){
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
            // console.log(percentScrolled, type)
			return constrain(percentScrolled, 0, 1);
		});
	});

	// Example panorama URL - you should replace this with your actual Google Street View panorama URL
	const panoramaUrl = `assets/images/${props.panorama_id}.jpg`;

</script>

<svelte:window bind:scrollY />

<svelte:boundary onerror={(e) => console.error(e)}>
	{#if waysSet}
        <div class="wrapper" id={type}>
            <div class="container value-{valueSet} {value || value === 0 ? 'container-visible' : ''}" style="height: {height}px;">
                <!-- <p class="moving" style="left: {position[0]}%; background:black;color:white; font-family: monospace;">
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
                    />
                {/if}
            </div>
            <div class="text">
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

    .isFirstIntro {
        /* height: var(--height); */
    }
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
</style>