<script>
	import useWindowDimensions from "$runes/useWindowDimensions.svelte.js";
	import Scrolly from "$components/helpers/Scrolly.svelte";
	// import ExternalLink from "lucide-svelte/icons/external-link";
	// import DollarSign from "lucide-svelte/icons/dollar";
    import ExternalLink from "@lucide/svelte/icons/external-link";
    import Grid from "$data/grid.csv";


    let { height, slide, scrollY } = $props();

	let value = $state();
    let valueSet = $state(null);

    let _triggerArt = $state([]);
	let dimensions = new useWindowDimensions();

    let locations = $derived(Grid.reduce((acc, row) => {
        const term = row.term;
        if (!acc[term]) {
            acc[term] = [];
        }
        acc[term].push({
            link: row.link,
            text: row.text
        });
        return acc;
    }, {}));


    let slides = [1,2,3,4,5,6,7,8,9,10,11,12,13];

    let slideStyles = [
        {
            justifyContent: 'flex-start',
            justifySelf: 'start',
            gridColumnStart: "2",
        },
        {
            justifyContent: 'flex-end',
            justifySelf: 'start',
            gridColumnStart: "auto",
        }
        ,
        {
            justifyContent: 'flex-start',
            justifySelf: 'start',
            gridColumnStart: "auto",
        }
        ,
        {
            justifyContent: 'auto',
            justifySelf: 'auto',
            gridColumnStart: "auto",
        },
        {
            justifyContent: 'flex-end',
            justifySelf: 'start',
            gridColumnStart: "2",
        },
        {
            justifyContent: 'flex-start',
            justifySelf: 'center',
            gridColumnStart: "auto",
        },
        {
            justifyContent: 'flex-end',
            justifySelf: 'start',
            gridColumnStart: "auto",
        },
        {
            justifyContent: 'flex-start',
            justifySelf: 'end',
            gridColumnStart: "auto",
        },
        {
            justifyContent: 'flex-end',
            justifySelf: 'end',
            gridColumnStart: "auto",
        },
        {
            justifyContent: 'center',
            justifySelf: 'center',
            gridColumnStart: "auto",
        },
        {
            justifyContent: 'flex-end',
            justifySelf: 'end',
            gridColumnStart: "auto",
        },
        {
            justifyContent: 'flex-end',
            justifySelf: 'start',
            gridColumnStart: "2",
        },
        {
            justifyContent: 'flex-start',
            justifySelf: 'end',
            gridColumnStart: "auto",
        }
        
    ];

    $effect(() => {
        if(value === undefined || value === null){
            if(valueSet === null || valueSet === undefined){
                valueSet = undefined;
            }
            else if (valueSet === slides.length - 1){
                valueSet = slides.length - 1;
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
        if (scrollY && value == 0) {
            _triggerArt.forEach((el, i) => {
                const elementTop = el.getBoundingClientRect().top - dimensions.height + 300;
                if(elementTop < 0){
                    el.style.opacity = 1;
                }
                else {
                    el.style.opacity = 0;
                }
            });

    }
})




</script>

{#if slide && locations}
    <div class="wrapper" style="margin-bottom: {slide.title === 'Fuhgeddaboudit' ? '200px' : ''}">
        <div class="container value-{valueSet} {value || value === 0 ? 'container-visible' : ''}">
            <div class="container-inner" style="height: {height}px;">
                <p>{slide.title}</p>
            </div>
        </div>
        <div class="text" style="margin-top: {slide.title === 'Fuhgeddaboudit' ? '200px' : ''}">
            <Scrolly bind:value top={height/2} bottom={100} increments={10}>
                <div class="example-grid" style="grid-auto-rows: {height * (width < 650 ? .5 : .45)}px;">
                    {#if Object.keys(locations).includes(slide.images)}
                        {#each locations[slide.images] as gridSlide, i}
                            {@const length = locations[slide.images].length}
                            {@const minLength = length > slides.length ? slides.length : length}
                            {@const count = i % minLength}
                            <div class="example-grid-item item-{i}" bind:this={_triggerArt[i]}
                                style="grid-column-start: {slideStyles[count].gridColumnStart}; justify-content: {slideStyles[count].justifyContent}; justify-self: {slideStyles[count].justifySelf};"
                            >
                                <a class="example-grid-item-link" href="https://maps.app.goo.gl/{locations[slide.images][i].link}" target="_blank">
                                    <img style="height: auto;" alt="Google Street View image of streetscape from ground level, viewing an example of &ldquo;{slide.title}&rdquo; located at {locations[slide.images][i].text}, NYC" class="" src="assets/images/{slide.images}_{i}.jpg"></a>
                                <span class="grid-item-text">{locations[slide.images][i].text}<a href="https://maps.app.goo.gl/{locations[slide.images][i].link}" target="_blank"><ExternalLink color="white" /></a></span>
                            </div>
                        {/each}
                    {/if}
                </div>
                <a class="view-map-link" target="_blank" href="https://www.alltext.nyc/map?q={slide.images}"><button class="view-map">View the Map of &ldquo;{slide.title}&rdquo; <span><ExternalLink color="white" /></span></button></a>
            </Scrolly>
        </div>
    </div>
{/if}



<style>
    .view-map-link {
        display: block;
        margin-top: 20px;
    }
    .view-map {
        text-align: center;
        width: fit-content;
        margin: 0 auto;
        background: #3F3F3F;
        color: white;   
        border-radius: 8px;
        padding-left: 8px;
        padding-right: 8px;
        font-size: 14px;
        font-family: var(--sans);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        margin-top: 40px;
        display: block;

    }
    .view-map span {
        font-size: 14px;
        margin-left: 2px;
        width: 15px;
        display: inline-block;
    }
    .text {
        margin-top: 150px;
    }
    .wrapper {
        margin-bottom: 100px;
    }
    .container {
        position: sticky;
		top: 0;
		height: 1px;
		width: 100%;
		pointer-events: none;
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
        z-index: -1;
    }
    .container-inner {
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .container-visible {
        opacity: .8;
    }

    .container-inner p {
        position: absolute;
        top: 0%;
        left: 0;
        right: 0;
        color: #fff;
        text-align: center;
        transform: translate(0%, 0%);
        font-size: 100px;
        font-weight: 400;
        /* font-family: var(--serif); */
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-size: 96px;
        line-height: 1.2;
        font-family: var(--sans);
        font-weight: 400;
        text-transform: uppercase;
        letter-spacing: -7px;
    }

	.example-grid {
		position: relative;
		display: grid;
        max-width: 900px;
        width: calc(100vw - 50px);
		gap: 20px 20px;
		grid-template-columns: auto auto auto;
        grid-auto-rows: 45vh;
		justify-items: center;
        margin: 0 auto 0;
	}

	.example-grid-item {
		display: flex;
		flex-direction: column;
		max-width: 500px;
		align-items: center;
		justify-content: center;
        opacity: 0;
		transition: opacity 0.3s ease-in-out;
	}

    .example-grid-item img {
        border-radius: 8px;
        max-width: 200px;
    }
    .example-grid-item .example-grid-item-link {
        position: relative;
    }
    .example-grid-item .example-grid-item-link:before {
        content: 'Source: Google';
        position: absolute;
        right: 0;
        font-family: var(--sans);
        font-size: 10px;
        font-weight: 400;
        text-align: center;
        right: 0;
        padding: 0 3px 2px;
        width: fit-content;
        border-bottom-right-radius: 8px;
        bottom: 0;
        color: rgba(0,0,0,.9);
        background-color: #a7a7a7;
        z-index: 100000000000000000;
    }

    .grid-item-text {
        font-family: var(--sans);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        margin-top: 5px;
        color: rgba(255, 255, 255, 0.6);
        text-decoration-color: currentColor;
        font-weight: 400;
        font-size: 10px;
        /* text-transform: uppercase; */
        /* max-width: 140px; */
        line-height: 1.2;
        width: calc(100% - 10px);
        text-align: center;
    }

    .grid-item-text a {
        color: white;
        text-decoration-color: currentColor;
        width: 1.5em;
        display: inline-block;
		height: 0;
		border-radius: 50%;
		text-align: center;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		margin-left: 3px;
		padding: 2px;
        transform: translate(0, 50%);
    }
	@media only screen and (max-width: 600px) {
        .example-grid {
            grid-auto-rows: 50vh;
            grid-template-columns: calc(50% - 10px) calc(50% - 10px);
            gap: 10px 10px;
            width: calc(100% - 50px);
        }

        .container-inner p {
            font-size: 64px;
            letter-spacing: -5px;
            width: calc(100% - 20px);
            margin: 0 auto;
            text-align: center;
        }
        .example-grid-item img {
            width: 100%;
        }


    }


</style>