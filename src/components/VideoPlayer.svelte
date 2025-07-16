<script>
    import { onMount } from "svelte";
	let isMuted = $state(true);
	let fadeInterval;
	let videoDuration = $state(0);
	let currentTime = $state(0);
	const FADE_DURATION = 300; // ms
	const FADE_STEPS = 20;
	const UNMUTED_VOLUME = 0.2;
    
    let { scrollY, height } = $props();
    let videoEl = $state(null);

	onMount(() => {
		if (videoEl) {
			videoEl.volume = 0;
		}
	});

    $effect(() => {
        if (scrollY && videoEl) {
            const elementTop = videoEl.getBoundingClientRect().top + height;
            if(elementTop < 0){
                isMuted = true;
                videoEl.muted = true;
                fadeVolume(0);
            }
        }
    })
	// Use $derived rune for reactive progress calculation
	let progress = $derived(videoDuration > 0 ? currentTime / videoDuration : 0);

	function toggleMute() {
		isMuted = !isMuted;
		videoEl.muted = false; // Always control via volume
		fadeVolume(isMuted ? 0 : UNMUTED_VOLUME);
	}

	function fadeVolume(target) {
		if (!videoEl) return;
		if (fadeInterval) clearInterval(fadeInterval);
		const start = videoEl.volume !== 0 ? .2 : 0;
		const end = target;
		const step = (end - start) / FADE_STEPS;
		let currentStep = 0;
		fadeInterval = setInterval(() => {
			currentStep++;
			videoEl.volume = Math.max(0, Math.min(1, start + step * currentStep));
			if (currentStep >= FADE_STEPS) {
				videoEl.volume = end;
				clearInterval(fadeInterval);
			}
		}, FADE_DURATION / FADE_STEPS);
	}
</script>

<div class="video-container">
	<video
		bind:this={videoEl}
        bind:currentTime={currentTime}
        bind:duration={videoDuration}
		src="assets/images/NYCText.mp4"
        aria-label="Video of NYC streetscapes with text that appears in Google Street View, timed to the song 'Empire State of Mind' by Alicia Keys and Jay-Z"
        aria-describedby="video-caption"
		loop
		muted={isMuted}
		playsinline
		autoplay
	></video>
    <p id="video-caption">♬♫♩♪ New York...concrete jungle where dreams are made of...</p>
</div>
<div style="" class="button-wrapper">
    <button class="mute-btn" on:click={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
        <div class="progress-ring"
            style="background-image: conic-gradient(rgb(36, 213, 84) {progress*100}%, rgba(0,0,0,0) 1%);"
        >
        </div>
        <div class="mute-btn-icon">
            <span class="icon"
            style="background-position:{!isMuted ? 'bottom' : 'top'};"
            ></span>
        </div>
    </button>
    <p>&lsquo;Empire State of Mind&rsquo; by Alicia Keys & <span style="white-space: nowrap;">Jay-Z</span></p>  
</div>

<style>
    .button-wrapper {
        margin-top: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .button-wrapper p {
        font-size: 14px;
        color: #aaa;
        margin-left: 10px;
        -webkit-font-smoothing: antialiased;
    }
    .progress-ring, .mute-btn-icon {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
        right: 0;
        margin: 0 auto;
        border-radius: 100%;
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
    }
    #video-caption {
        font-family: var(--sans);
        font-size: 11px;
        color: #fff;
        margin-top: 10px;
        text-align: center;
        -webkit-font-smoothing: antialiased;
        font-weight: 600;
    }
    .mute-btn-icon {
        background-color: white;
        width: calc(100% - 6px);
        height: calc(100% - 6px);
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .video-container {
        max-width: 400px;
        margin: 0 auto;
        position: relative;
    }
    .mute-btn {
        background: none;
        position: relative;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        padding: 0;
        padding: 14px;
    }
    .icon {
        background-image: url('/assets/images/mute.gif');
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
        width: 100%;
        height: 100%;
        height: 15px;
        background-size: 20px;
        background-position: top;

    }
    video {
        display: block;
        width: 100%;
        border-radius: 10px;
    }

    @media only screen and (max-width: 500px) {
        .video-container {
            max-width: calc(100% - 0px);
        }
    }
</style>