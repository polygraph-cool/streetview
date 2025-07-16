<script>
	import Scrolly from "$components/helpers/Scrolly.svelte";
    import ExternalLink from "@lucide/svelte/icons/external-link";
    import { flip } from 'svelte/animate';
    import rankData from "$data/rank.csv";
    import Grid from "$data/grid.csv";

    let { height, props, width } = $props();
    let value = $state(undefined);    

    let lineHeight = $derived(width > 650 ? 24 : 16);

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

    function getOrdinal(n) {
        const s = ["th","st","nd","rd"],
              v = n%100;
        return (s[(v-20)%10] || s[v] || s[0]);
    }

    let rankToShow = $derived.by(() => {
        if (value === null || value === undefined) {
            return null;
        } else {
            if(zoomIndex[value] > 1){
                return triggerIndex[value];
            }
            return null;
        }
        
    });

    let triggerIndex = $derived.by(() => {
        return props.slides.map((slide,i) => {
            return slide.trigger;
        })
    })

    let zoomIndex = $derived.by(() => {
        return props.slides.map((slide,i) => {
            if(width < 650){
                if(slide.zoom > 1){ 
                    return 1.1;
                }
                else {
                    slide.zoom;
                }
            }
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
        let scaleValue = getScale(value);
        if(rankToShow === null) {
            return offset;
        }
    
        let index = streetsOnlyTerms.findIndex(r => r === rankToShow);
        return (-1 * (((index - 1) * lineHeight * scaleValue) - (height * 0.5) + (lineHeight * scaleValue) + offset));
	});

    let offset = $state(100);

    let masterRanking = $state(rankData.slice(0,1500).map(d => d));
    let streetsOnly = $state(rankData.filter(r => +r.street !== 1).slice(0,1500));
    let streetsOnlyTerms = $state(rankData.filter(r => +r.street !== 1).slice(0,1500).map(r => r.term));

    let ranking = $derived(masterRanking.map(r => r.term));
    
    function filterData(value){
        if(value == null || value == undefined){
            return ranking;
        }
        else if (+streetsIndex[value] == 1){
            return streetsOnlyTerms;
        }
        else {
            return ranking;
        }    
    }

    function getScale(value){
        if(value){
            return zoomIndex[value];
        }
        else {
            return zoomIndex[0];
        }
    }
    
    let locations2 = {
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
    
</script>

<div class="wrapper">
    <div style="height: {height}px; --offset: {offset}px;" class="{Math.abs(calculatedOffset) > offset ? 'hideTitle' : ''} container value-{value} {value || value === 0 ? 'container-visible' : ''}">
         <div class="rank-wrapper"
         class:showStreet={triggerIndex[value] === "color"}
         style="transform: translate3d(0px, {calculatedOffset}px, 0px) scale({getScale(value)});"
         >
            {#each filterData(value) as rank, i (rank)}
                {@const highlight = rank === rankToShow}

                <p 
                class:highlight
                class:street={+masterRanking[i].street === 1}
                animate:flip={{ duration: 600, delay: 0 }}
                style="transform: translate3d(0px, {i * lineHeight}px, 0px);"
                >
                    {rank}
                    <span>{i + 1}<sup style="font-size: 8px;">{getOrdinal(i + 1)}</sup></span>
                </p>
            {/each}
         </div>
         
    </div>
    <div class="text" style="">
        <Scrolly bind:value increments={100} top={100}>
            {#each props.slides as slide, i}
                {@const termTemp = slide.trigger}
                {@const active = value === i}
                {@const isFirst = i === 0}
                <div 
                    style="--height: {height}px; {isFirst ? `height: ${height/2}px;` : ["start","color","hold"].indexOf(slide.trigger) > -1 ? `height: inherit;` : ''}"
                    class:active
                    class:isFirst
                    class="step-{i} step {["start","color","hold"].indexOf(slide.trigger) > -1 ? 'text-only-step' : ''}"
                >
                    {#if ["start","color","hold"].indexOf(slide.trigger) === -1}

                        <div class="text-wrapper">
                            <p class="text-fg exposition exposition-grid" style="opacity: 1">
                                <span class="text-inner">{@html slide.text}</span>
                            </p>
                            <p aria-hidden="true" class="text-bg exposition exposition-grid" style="opacity: 1">
                                <span class="text-inner">{@html slide.text}</span>
                            </p>
                        </div>


                        <!-- <p class="exposition exposition-grid"></p> -->
                        <div class="example-grid">
                            {#each locations[termTemp] as gridSlide, i}
                                {@const count = i % locations[termTemp].length}
                                <div class="example-grid-item item-{i}"
                                    style="grid-column-start: {slideStyles[count].gridColumnStart}; justify-content: {slideStyles[count].justifyContent}; justify-self: {slideStyles[count].justifySelf};"
                                >
                                    <a class="example-grid-item-link" href="https://maps.app.goo.gl/{locations[termTemp][i].link}" target="_blank"><img style="height: auto;" alt="" class="" src="assets/images/{termTemp}_{i}.jpg"></a>
                                    <span class="grid-item-text">{locations[termTemp][i].text}<a href="https://maps.app.goo.gl/{locations[termTemp][i].link}" target="_blank"><ExternalLink color="white" /></a></span>
                                </div>
                            {/each}
                        </div>
                        {#if Object.keys(slide).indexOf("post") > -1}
                            <div class="text-wrapper" style="--height: {height}px; margin-top: 100px; margin-bottom: {height/2}px;">
                                <p class="text-fg exposition post" style="opacity: 1">
                                    <span class="text-inner">{@html slide.post}</span>
                                </p>
                                <p aria-hidden="true" class="text-bg exposition post" style="opacity: 1">
                                    <span class="text-inner">{@html slide.post}</span>
                                </p>
                            </div>

                            <!-- <p class="exposition post" >{@html slide.post}</p> -->
                        {/if}
                    {:else}
                        <div class="slide-text-only-wrapper" style="">

                            <div class="text-wrapper">
                                <p class="text-fg exposition" style="opacity: 1">
                                    <span class="text-inner">{@html slide.text}</span>
                                </p>
                                <p aria-hidden="true" class="text-bg exposition" style="opacity: 1">
                                    <span class="text-inner">{@html slide.text}</span>
                                </p>
                            </div>

                            <!-- <p class="exposition"></p> -->
                        </div>
                    {/if}
                </div>
            {/each}
        </Scrolly>
    </div>
</div>


<style>
    .slide-text-only-wrapper {
        margin: 0 auto;
        /* min-height: 100vh; */
    }

    .showStreet .street {
        color: #ff7373;
    }

    .container:before {
        content: "The Top 1,000 Words/Phrases in NYC Streetview";
        position: absolute;
        left: auto;
        top: calc(var(--offset) - 10px);
        color: white;
        width: 270px;
        right: 10px;
        font-size: 18px;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        opacity: 1;
        font-family: var(--sans);
        transform: translateY(-100%);
        text-align: right;

    }

    

    .container.hideTitle:before {
        opacity: 0;
    }

    .exposition {
        font-family: var(--sans);
        font-size: 24px;
        text-align: left;
        margin: 0;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        opacity: 1;
        max-width: 500px;
        margin: 0 auto;
        margin-left: 30px;
        /* padding-top: 300px; */
    }

    .post {
        font-size: 18px;
    }

    .container p {
        font-family: var(--mono);
        font-size: 18px;
        text-align: left;
        margin: 0;
        /* height: 24px; */
        /* line-height: 24px; */
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

    .step {
        opacity: .5;
    }
    .step.active {
        opacity: 1;
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
        content: "- ";
        padding-left: 5px;
        padding-right: 0px;
    }

    .container {
		position: sticky;
		top: 0;
		width: 100%;
		pointer-events: none;
        opacity: 1;
        transition: opacity 0.5s ease-in-out;
        counter-reset: item-counter;
        max-width: calc(100% - 20px);
        z-index: 100;
        pointer-events: none;
        overflow: hidden;
	}
    .rank-wrapper {
        position: absolute;
        top: 0%;
        width: 100%;
        transition: transform 2s ease-in-out;
        transform-origin: top right;
        /* transition-delay: 2s; */
    }

    .text {
        position: relative;
    }

    .text:before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        background: linear-gradient(90deg, rgba(17,17,17,0) 0%, rgba(17,17,17,1) 50%);
        width: 300px;
        z-index: 10;
    }

    .highlight {
        color: var(--rank-highlight);
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
        margin-left: 20px;
        padding-top: 100px;
        margin-bottom: 100px;
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
        z-index: 1;
    }


    .example-grid-item img {
        border-radius: 8px;
        max-width: 200px;
        opacity: 1;
    }

    .grid-item-text {
        font-family: var(--sans);
        margin-top: 5px;
        color: rgba(255, 255, 255, 0.6);
        text-decoration-color: currentColor;
        font-weight: 400;
        font-size: 12px;
        /* text-transform: uppercase; */
        max-width: 200px;
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

    .exposition-grid {
        padding-top: 100px;
    }

    .isFirst, .text-only-step {
        margin-bottom: calc(var(--height) / 2);
    }

    .text-wrapper {
        position: relative;
    }

    p.text-bg, p.text-fg {
		letter-spacing: 0px;
		-ms-text-size-adjust: 100%;
		-moz-text-size-adjust: 100%;
		-webkit-text-size-adjust: 100%;
		text-size-adjust: 100%;
        color: var(--color-fg);
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
		background-color: #111;
		box-shadow: 15px 0 #111, -15px 0 #111;
	}


    @media only screen and (max-width: 650px) {
        .container {
            max-width: 100%;
        }

        .container p {
            font-size: 13px;
            letter-spacing: -.2px;
            padding-right: 3px;
            text-shadow: -3px -3px 1px rgba(17, 17, 17, 0.3), -3px -2px 1px rgba(17, 17, 17, 0.3), -3px -1px 1px rgba(17, 17, 17, 0.3), -3px 0px 1px rgba(17, 17, 17, 0.3), -3px 1px 1px rgba(17, 17, 17, 0.3), -3px 2px 1px rgba(17, 17, 17, 0.3), -3px 3px 1px rgba(17, 17, 17, 0.3), -2px -3px 1px rgba(17, 17, 17, 0.3), -2px -2px 1px rgba(17, 17, 17, 0.3), -2px -1px 1px rgba(17, 17, 17, 0.3), -2px 0px 1px rgba(17, 17, 17, 0.3), -2px 1px 1px rgba(17, 17, 17, 0.3), -2px 2px 1px rgba(17, 17, 17, 0.3), -2px 3px 1px rgba(17, 17, 17, 0.3), -1px -3px 1px rgba(17, 17, 17, 0.3), -1px -2px 1px rgba(17, 17, 17, 0.3), -1px -1px 1px rgba(17, 17, 17, 0.3), -1px 0px 1px rgba(17, 17, 17, 0.3), -1px 1px 1px rgba(17, 17, 17, 0.3), -1px 2px 1px rgba(17, 17, 17, 0.3), -1px 3px 1px rgba(17, 17, 17, 0.3), 0px -3px 1px rgba(17, 17, 17, 0.3), 0px -2px 1px rgba(17, 17, 17, 0.3), 0px -1px 1px rgba(17, 17, 17, 0.3), 0px 1px 1px rgba(17, 17, 17, 0.3), 0px 2px 1px rgba(17, 17, 17, 0.3), 0px 3px 1px rgba(17, 17, 17, 0.3), 1px -3px 1px rgba(17, 17, 17, 0.3), 1px -2px 1px rgba(17, 17, 17, 0.3), 1px -1px 1px rgba(17, 17, 17, 0.3), 1px 0px 1px rgba(17, 17, 17, 0.3), 1px 1px 1px rgba(17, 17, 17, 0.3), 1px 2px 1px rgba(17, 17, 17, 0.3), 1px 3px 1px rgba(17, 17, 17, 0.3), 2px -3px 1px rgba(17, 17, 17, 0.3), 2px -2px 1px rgba(17, 17, 17, 0.3), 2px -1px 1px rgba(17, 17, 17, 0.3), 2px 0px 1px rgba(17, 17, 17, 0.3), 2px 1px 1px rgba(17, 17, 17, 0.3), 2px 2px 1px rgba(17, 17, 17, 0.3), 2px 3px 1px rgba(17, 17, 17, 0.3), 3px -3px 1px rgba(17, 17, 17, 0.3), 3px -2px 1px rgba(17, 17, 17, 0.3), 3px -1px 1px rgba(17, 17, 17, 0.3), 3px 0px 1px rgba(17, 17, 17, 0.3), 3px 1px 1px rgba(17, 17, 17, 0.3), 3px 2px 1px rgba(17, 17, 17, 0.3), 3px 3px 1px rgba(17, 17, 17, 0.3);
        }

        .container p span {
            text-shadow: none;
        }
        .exposition {
            font-size: 16px;
            margin-left: 10px;
            max-width: 150px;
        }

        .text:before {
            width: 100px;
        }

        .container p span:before {
            content: "-";
            padding-left: 2px;
            padding-right: 0px;
        }
        .container p span {
            font-size: 10px;
        }

        .example-grid {
            grid-auto-rows: 40vh;
            grid-template-columns: calc(50% - 10px) calc(50% - 10px);
            gap: 10px 10px;
            width: calc(100% - 100px);
            margin-left: 0;
        }
        .example-grid-item img {
            width: 100%;
        }

        .text-bg .text-inner {
		    color: rgba(255,255,255,0);
		    background-color: #222;
		    box-shadow: 15px 0 #222, -15px 0 #222;
		}

        p.text-bg, p.text-fg {
            font-size: 16px;
        }
    }

</style>