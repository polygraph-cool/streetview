<script>
	import useWindowDimensions from "$runes/useWindowDimensions.svelte.js";
	import Scrolly from "$components/helpers/Scrolly.svelte";

    let { height, slide } = $props();

	let value = $state();
    let valueSet = $state(null);

    let _triggerArt = $state([]);
	let scrollY = $state(0);
	let dimensions = new useWindowDimensions();


    $effect(() => {
        console.log(value, valueSet)
    })


    let locations = [
        {
            lat: "https://www.google.com",
            long: "https://www.google.com",
            text: "59th and 60th"
        }
    ]

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
                // let trigger = el.getBoundingClientRect().top - dimensions.height;
                // document
                //     .querySelector(".g-immersive-text-positioner." + el.id)
                //     .getBoundingClientRect().top - $viewportHeight;
                const elementTop = el.getBoundingClientRect().top - dimensions.height + 300;
                // const elementHeight = el.getBoundingClientRect().height;
                
                let offset = scrollY - elementTop - (dimensions.height/2);
                // offset = constrain(offset, 0, sectionEnd - sectionStart);
                // if(i === 0 || i == 6){
                //     console.log(i,elementTop,scrollY,offset)
                // }
                if(elementTop < 0){
                    el.style.opacity = 1;
                }
                else {
                    el.style.opacity = 0;
                }
                // console.log(elementTop, elementHeight, scrollY)
                // if (i == 0 && trigger < 0) {
                // el.style.opacity = 1;
                // showLabels = true;
                // }
                // else if (i !== 0 && trigger <= 0) {
                // el.style.opacity = 1;
                // } else if (i !== 0 && trigger > 0) {
                // el.style.opacity = 0;
                // }
                // else if (i==0){
                // el.style.opacity = 1;
                // showLabels = false;
                // }
                // else {
                // el.style.opacity = 0;
                // }
            });

            // let sectionOutStart =
            //     container.offsetTop +
            //     container.getBoundingClientRect().height -
            //     $viewportHeight * 2;
            // let sectionOutEnd = sectionOutStart + $viewportHeight / 2;

            // if ($y > sectionOutStart) {
            //     container.style.opacity =
            //     1 - getPercentScrolled($y, sectionOutStart, sectionOutEnd);
            // } else if ($y > sectionOutEnd) {
            //     container.style.opacity = 0;
            // } else if ($y < sectionOutStart) {
            //     container.style.opacity = 1;
            // }
    }
})




</script>

<svelte:window bind:scrollY />


<div class="wrapper">
    <div class="container value-{valueSet} {value || value === 0 ? 'container-visible' : ''}">
        <div class="container-inner" style="height: {height}px;">
            <p>{slide.title}</p>
        </div>
    </div>
    <div class="text" style="">
        <Scrolly bind:value top={height/2} bottom={100} increments={10}>
            {#each [1] as grid, i}
                <div class="example-grid">
                    {#each slides as slide, i}
                        {@const count = i % 13}
                        <div class="example-grid-item item-{i}" bind:this={_triggerArt[i]}
                            style="grid-column-start: {slideStyles[count].gridColumnStart}; justify-content: {slideStyles[count].justifyContent}; justify-self: {slideStyles[count].justifySelf};"
                        >
                            <img style="max-width: 140px; height: auto;" alt="" class="" src="assets/images/sign.png">
                            <span class="grid-item-text"><a href="https://www.google.com/maps/@40.618176,-74.02476,3a,20y,270.04h,95.77t/data=!3m6!1e1!3m4!1sIMkbEoEa5gjovyj76pt06w!2e0!7i16384!8i8192" target="_blank">{locations[0].text}</a></span>
                        </div>
                    {/each}
                </div>
            {/each}
        </Scrolly>
    </div>
</div>



<style>
    .container {
        position: sticky;
		top: 0;
		height: 1px;
		width: 100%;
		pointer-events: none;
        opacity: .2;
        transition: opacity 0.5s ease-in-out;
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
        opacity: 1;
    }

    .grid-item-text {
        font-family: var(--mono);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-size: 12px;
        font-size: 12px;
        margin-top: 5px;
        opacity: .9;
    }

    .grid-item-text a {
        color: #74FCD0;
        text-decoration-color: currentColor;
        font-weight: 400;
    }

    .container p {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        color: #fff;
        text-align: center;
        transform: translate(0%, -50%);
        font-size: 100px;
        font-weight: 400;
        z-index: 100;
    }

	.example-grid {
		position: relative;
		display: grid;
        max-width: 740px;
		gap: 20px 20px;
		grid-template-columns: auto auto auto;
		grid-template-rows: 30vh 30vh 30vh 30vh 30vh 30vh 30vh;
		justify-items: center;
        margin: 0 auto 0;
		/* max-width: calc(100vw - 40px);	 */
	}

	.example-grid-item {
		display: flex;
		flex-direction: column;
		max-width: 200px;
		align-items: center;
		justify-content: center;
        opacity: 0;
		transition: opacity 0.3s ease-in-out;
	}

    .example-grid-item img {
        border-radius: 8px;
    }

</style>