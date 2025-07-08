<script>
    import { onMount } from "svelte";
	let videoEl;
	let isMuted = $state(true);
	let fadeInterval;
	let videoDuration = $state(0);
	let currentTime = $state(0);
	const FADE_DURATION = 300; // ms
	const FADE_STEPS = 20;


	// Use $derived rune for reactive progress calculation
	let progress = $derived(videoDuration > 0 ? currentTime / videoDuration : 0);

	function toggleMute() {
		isMuted = !isMuted;
		videoEl.muted = false; // Always control via volume
		fadeVolume(isMuted ? 0 : 0.5);
	}

	function fadeVolume(target) {
		if (!videoEl) return;
		if (fadeInterval) clearInterval(fadeInterval);
		const start = videoEl.volume;
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
		loop
		muted={isMuted}
		playsinline
		autoplay
	></video>
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
    <p>&lsquo;Empire State of Mind&rsquo; by Alicia Keys & Jay-Z</p>  
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
</style>