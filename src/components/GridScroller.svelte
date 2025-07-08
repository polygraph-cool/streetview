<script>
	import useWindowDimensions from "$runes/useWindowDimensions.svelte.js";
	import Scrolly from "$components/helpers/Scrolly.svelte";
	// import ExternalLink from "lucide-svelte/icons/external-link";
	// import DollarSign from "lucide-svelte/icons/dollar";
    import ExternalLink from "@lucide/svelte/icons/external-link";
    import Grid from "$data/grid.csv";


    let { height, slide } = $props();

	let value = $state();
    let valueSet = $state(null);

    let _triggerArt = $state([]);
	let scrollY = $state(0);
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
    console.log(locations,slide.images);

    console.log(locations[slide.images].length);


    // let locations = {
    //     "fuhgeddaboudit": [
    //         {
    //             link: "https://maps.app.goo.gl/bYudE84yY6HNNbAy5",
    //             text: "BQE, Verrazzano bridge"
    //         },
    //         {
    //             link: "https://maps.app.goo.gl/fPHRL6mHCtoCftV56",
    //             text: "Belt Parkway, Bay Ridge"
    //         },
    //         {
    //             link: "https://maps.app.goo.gl/T1bsX9mAN8kWm9AX7",
    //             text: "104-9 109th St, Queens"
    //         },
    //         {
    //             link: "https://maps.app.goo.gl/UaEH9w7C2BDDvvQf8",
    //             text: "Belt Parkway, East New York"
    //         },
    //         {
    //             link: "https://maps.app.goo.gl/2ZPFZybdpGy3tY9W8",
    //             text: "11-12 44th Dr, Queens"
    //         },
    //         {
    //             link: "https://maps.app.goo.gl/xYZTVZk1ab8Mkhd26",
    //             text: "531 Atlantic Ave, Brooklyn"
    //         },
    //         {
    //             link: "https://maps.app.goo.gl/Ey7CNC7w4f21iEMw6",
    //             text: "808 3rd Ave, Brooklyn"
    //         }
    //     ],
    //     "loitering": [
    //         {
    //             link: "https://www.google.com/maps/@40.618176,-74.02476,3a,20y,270.04h,95.77t/data=!3m6!1e1!3m4!1sIMkbEoEa5gjovyj76pt06w!2e0!7i16384!8i8192?entry=ttu",
    //             text: "BQE, Verrazzano bridge"
    //         }
    //     ],
    //     "restrooms": [
    //         {
    //             link: "https://www.google.com/maps/@40.618176,-74.02476,3a,20y,270.04h,95.77t/data=!3m6!1e1!3m4!1sIMkbEoEa5gjovyj76pt06w!2e0!7i16384!8i8192?entry=ttu",
    //             text: "BQE, Verrazzano bridge"
    //         }
    //     ]
    // }

    let slides = [1,2,3,4,5,6,7,8,9,10,11,12,13];
    function constrain(n, low, high) {
		return Math.max(Math.min(n, high), low);
	}

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
        console.log(value, valueSet)
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

<svelte:window bind:scrollY />

{#if slide && locations}
    <div class="wrapper">
        <div class="container value-{valueSet} {value || value === 0 ? 'container-visible' : ''}">
            <div class="container-inner" style="height: {height}px;">
                <p>{slide.title}</p>
            </div>
        </div>
        <div class="text" style="">
            <Scrolly bind:value top={height/2} bottom={100} increments={10}>
                <div class="example-grid">
                    {#if Object.keys(locations).includes(slide.images)}
                        {#each locations[slide.images] as gridSlide, i}
                            {@const length = locations[slide.images].length}
                            {@const minLength = length > slides.length ? slides.length : length}
                            {@const count = i % minLength}
                            <div class="example-grid-item item-{i}" bind:this={_triggerArt[i]}
                                style="grid-column-start: {slideStyles[count].gridColumnStart}; justify-content: {slideStyles[count].justifyContent}; justify-self: {slideStyles[count].justifySelf};"
                            >
                                <a href="https://maps.app.goo.gl/{locations[slide.images][i].link}" target="_blank"><img style="height: auto;" alt="" class="" src="assets/images/{slide.images}_{i}.jpg"></a>
                                <span class="grid-item-text">{locations[slide.images][i].text}<a href="https://maps.app.goo.gl/{locations[slide.images][i].link}" target="_blank"><ExternalLink color="white" /></a></span>
                            </div>
                        {/each}
                    {/if}
                </div>
            </Scrolly>
        </div>
    </div>
{/if}



<style>
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

    .grid-item-text {
        font-family: var(--sans);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        margin-top: 5px;
        color: rgba(255, 255, 255, 0.4);
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
		height: 1.5em;
		border-radius: 50%;
		text-align: center;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		margin-left: 3px;
		padding: 2px;
    }


</style>