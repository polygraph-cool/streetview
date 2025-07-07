<script>
	import Scrolly from "$components/helpers/Scrolly.svelte";
    import ExternalLink from "@lucide/svelte/icons/external-link";
    import { flip } from 'svelte/animate';
    import rankData from "$data/rank.csv";

    let { height, props } = $props();
    let value = $state(undefined);
    let valueSet = $state(null);
    let _triggerArt = $state([]);
	let scrollY = $state(0);
	let percentScrolledValues = $state([]);

    let rankToShow = $derived.by(() => {
        if (valueSet === null || valueSet === undefined) {
            return null;
        } else {
            if(zoomIndex[valueSet] == 2){
                return triggerIndex[valueSet];
            }
            return null;
        }
        
    });

    $effect(() => {
        console.log(valueSet)
    })

    let triggerIndex = $derived.by(() => {
        return props.slides.map((slide,i) => {
            return slide.trigger;
        })
    })

    let zoomIndex = $derived.by(() => {
        return props.slides.map((slide,i) => {
            return slide.zoom;
        })
    })

    let streetsIndex = $derived.by(() => {
        return props.slides.map((slide,i) => {
            return slide.streetsOnly;
        })
    })
    
    function constrain(n, low, high) {
		return Math.max(Math.min(n, high), low);
	}

    let calculatedOffset = $derived.by(() => {
        let scaleValue = getScale(valueSet);
        if(rankToShow === null) {
            return offset;
        }
    
        let index = streetsOnlyTerms.findIndex(r => r === rankToShow);
        console.log(index)
        return (-1 * (((index - 1) * 24 * scaleValue) - (height * 0.5) + (24 * scaleValue) + offset));
	});

    let offset = $state(100);

    let masterRanking = $state(rankData.slice(0,1500).map(d => d));
    let streetsOnly = $state(rankData.filter(r => +r.street !== 1).slice(0,1500));
    let streetsOnlyTerms = $state(rankData.filter(r => +r.street !== 1).slice(0,1500).map(r => r.term));

    let ranking = $derived(masterRanking.map(r => r.term));
    
    function filterData(valueSet){
        if(valueSet == null || valueSet == undefined){
            return ranking;
        }
        else if (+streetsIndex[valueSet] == 1){
            return streetsOnlyTerms;
        }
        else {
            return ranking;
        }    
    }

    function getScale(valueSet){
        if(valueSet){
            return zoomIndex[valueSet];
        }
        else {
            return zoomIndex[0];
        }
    }
    
    let locations = {
        "fuhgeddaboudit": [
            {
                link: "https://maps.app.goo.gl/bYudE84yY6HNNbAy5",
                text: "BQE, Verrazzano bridge"
            },
            {
                link: "https://maps.app.goo.gl/fPHRL6mHCtoCftV56",
                text: "Belt Parkway, Bay Ridge"
            },
            {
                link: "https://maps.app.goo.gl/T1bsX9mAN8kWm9AX7",
                text: "104-9 109th St, Queens"
            },
            {
                link: "https://maps.app.goo.gl/UaEH9w7C2BDDvvQf8",
                text: "Belt Parkway, East New York"
            },
            {
                link: "https://maps.app.goo.gl/2ZPFZybdpGy3tY9W8",
                text: "11-12 44th Dr, Queens"
            },
            {
                link: "https://maps.app.goo.gl/xYZTVZk1ab8Mkhd26",
                text: "531 Atlantic Ave, Brooklyn"
            },
            {
                link: "https://maps.app.goo.gl/Ey7CNC7w4f21iEMw6",
                text: "808 3rd Ave, Brooklyn"
            }
        ],
        "loitering": [
            {
                link: "https://www.google.com/maps/@40.618176,-74.02476,3a,20y,270.04h,95.77t/data=!3m6!1e1!3m4!1sIMkbEoEa5gjovyj76pt06w!2e0!7i16384!8i8192?entry=ttu",
                text: "BQE, Verrazzano bridge"
            }
        ],
        "restrooms": [
            {
                link: "https://www.google.com/maps/@40.618176,-74.02476,3a,20y,270.04h,95.77t/data=!3m6!1e1!3m4!1sIMkbEoEa5gjovyj76pt06w!2e0!7i16384!8i8192?entry=ttu",
                text: "BQE, Verrazzano bridge"
            }
        ]
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

    // Use $derived to calculate offset reactively
    
    $effect(() => {
        if(value === undefined || value === null){
            if(valueSet === null || valueSet === undefined){
                valueSet = undefined;
            }
            else {
                valueSet = value;
            }
        }
        else {
            valueSet = value;
        }
    });

</script>

<svelte:window bind:scrollY />

<div class="wrapper">
    <div style="height: {height}px; --offset: {offset}px;" class="{Math.abs(calculatedOffset) > offset ? 'hideTitle' : ''} container value-{valueSet} {value || value === 0 ? 'container-visible' : ''}">
        <!-- <h3>Value: {value}, ValueSet: {valueSet}</h3> -->
         <div class="rank-wrapper"
         class:showStreet={triggerIndex[valueSet] === "color"}
         style="transform: translate3d(0px, {calculatedOffset}px, 0px) scale({getScale(valueSet)});"
         >
            {#each filterData(valueSet) as rank, i (rank)}
                {@const highlight = rank === rankToShow}

                <p 
                class:highlight
                class:street={+masterRanking[i].street === 1}
                animate:flip={{ duration: 600, delay: 0 }}
                style="transform: translate3d(0px, {i * 24}px, 0px);"
                >
                    {rank}
                    <span>#{i + 1}</span>
                </p>
            {/each}
         </div>
         
    </div>
    <div class="text" style="">
        <Scrolly bind:value top={height/2} bottom={100} increments={10}>
            {#each props.slides as slide, i}
                {@const active = valueSet === i}
                {@const isFirst = i === 0}
                <div 
                    style="--height: {height}px;"
                    class:active
                    class:isFirst
                    class="step-{i}"
                >
                    <div class="text-wrapper" bind:this={_triggerArt[i]}>
                        {#if zoomIndex[i] == 2}
                            <p>{slide.text} - {slide.trigger}</p>
                            <div class="example-grid">
                                {#each locations["fuhgeddaboudit"] as gridSlide, i}
                                    {@const count = i % locations["fuhgeddaboudit"].length}
                                    <div class="example-grid-item item-{i}"
                                        style="grid-column-start: {slideStyles[count].gridColumnStart}; justify-content: {slideStyles[count].justifyContent}; justify-self: {slideStyles[count].justifySelf};"
                                    >
                                        <a href="{locations['fuhgeddaboudit'][i].link}" target="_blank"><img style="height: auto;" alt="" class="" src="assets/images/fuhgeddaboudit_{i}.jpg"></a>
                                        <span class="grid-item-text">{locations["fuhgeddaboudit"][i].text}<a target="_blank"><ExternalLink color="white" /></a></span>
                                    </div>
                                {/each}
                            </div>
                        {:else}
                            <div class="slide-text-only-wrapper">
                                <p>{slide.text} - {slide.trigger}</p>
                            </div>
                        {/if}
                    </div>
                </div>
            {/each}
        </Scrolly>
    </div>
</div>


<style>
    .slide-text-only-wrapper {
        max-width: 900px;
        margin: 0 auto;
        min-height: 100vh;
    }

    .showStreet .street {
        color: #ff7373;
    }

    .container:before {
        content: "Most Common Words in NYC Streetview";
        position: absolute;
        left: auto;
        top: calc(var(--offset) - 10px);
        color: white;
        width: 300px;
        right: 10px;
        font-size: 14px;
        opacity: 1;
        font-family: var(--sans);
        transform: translateY(-100%);
        text-align: right;
    }

    .container.hideTitle:before {
        opacity: 0;
    }

    .container p {
        font-family: var(--mono);
        font-size: 18px;
        text-align: left;
        margin: 0;
        /* height: 24px; */
        /* line-height: 24px; */
        transition: color 1s ease-in-out;
        /* transition-delay: 1s; */
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        counter-increment: item-counter;
        position: relative;
        line-height: 100%;
        position: absolute;
        left: auto;
        right: 0;
        padding-left: 0px;
        display: flex;
        align-items: center;
        padding-right: 10px;
        /* height: 24px; */
    }
    .container .showStreet p {
        /* transition-delay: 0s; */
    }


    .container p span {
        /* content: "#"counter(item-counter); */
        position: relative;
        font-size: 11px;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        opacity: .4;
        font-family: var(--mono);
    }

    .container p span:before {
        content: "— ";
        padding-left: 5px;
        padding-right: 0px;
    }

    .container {
		position: sticky;
		top: 0;
		height: 100%;
		width: 100%;
		pointer-events: none;
        opacity: 1;
        transition: opacity 0.5s ease-in-out;
        counter-reset: item-counter;
        max-width: calc(100% - 100px);
        z-index: 100;
        pointer-events: none;
	}
    .rank-wrapper {
        position: absolute;
        top: 0%;
        width: 100%;
        transition: transform 2s ease-in-out;
        transform-origin: top right;
        /* transition-delay: 2s; */
    }

    .highlight {
        color: red;
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
        opacity: 1;
		transition: opacity 0.3s ease-in-out;
	}

    .example-grid-item img {
        border-radius: 8px;
        max-width: 200px;
        opacity: .5;
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
        max-width: 140px;
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