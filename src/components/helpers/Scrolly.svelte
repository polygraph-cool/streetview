<script>
	/**
	 * This component manages which item is most in view for scroll triggering
	 * example:
	 * <Scrolly
	 * 	bind:value={scrollIndex}
	 * >
	 * **items here**
	 * </Scrolly>
	 *
	 * optional params with defaults
	 * <Scrolly root={null} top={0} bottom={0} increments={100}>
	 */
	
	let {
		root = null,
		top = 0,
		bottom = 0,
		increments = 100,
		value = $bindable(undefined),
		children
	} = $props();

	let steps = [];
	let threshold = [];
	let nodes = [];
	let intersectionObservers = [];
	let container = undefined;
	let debounceTimer = undefined;

	function mostInView () {
		let prevValue = value;
		let maxRatio = 0;
		let maxIndex = 0;
		
		// Additional safety check: verify elements are actually in viewport
		for (let i = 0; i < steps.length; i++) {
			if (steps[i] > maxRatio) {
				// Double-check the element is actually visible
				const element = nodes[i];
				if (element) {
					const rect = element.getBoundingClientRect();
					const isInViewport = rect.top < window.innerHeight && 
										rect.bottom > 0 && 
										rect.left < window.innerWidth && 
										rect.right > 0;
					
					if (isInViewport) {
						maxRatio = steps[i];
						maxIndex = i;
					} else {
						// Force reset if element is not actually in viewport
						steps[i] = 0;
						// console.warn(`Node ${i} had ratio ${steps[i]} but is not in viewport!`);
					}
				}
			}
		}
		
		if (maxRatio > 0) value = maxIndex;
		else value = prevValue; //undefined
	};

	function createObserver(node, index) {

		const handleIntersect = (e) => {
			const intersecting = e[0].isIntersecting;
			const ratio = e[0].intersectionRatio;
			const rect = e[0].boundingClientRect;
			
			// Only update if the element is actually intersecting
			if (intersecting) {
				steps[index] = ratio;
			} else {
				steps[index] = 0; // Force to 0 when not intersecting
			}
						
			mostInView();
		};

		const marginTop = top ? top * -1 : 0;
		const marginBottom = bottom ? bottom * -1 : 0;
		const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;
		const options = { root, rootMargin, threshold };

		if (intersectionObservers[index]) intersectionObservers[index].disconnect();

		const io = new IntersectionObserver(handleIntersect, options);
		io.observe(node);
		intersectionObservers[index] = io;
	}

	function update() {
		// Disconnect all existing observers first
		intersectionObservers.forEach(observer => {
			if (observer) observer.disconnect();
		});
		intersectionObservers = [];
		
		if (!nodes.length) return;
		nodes.forEach(createObserver);
	}

	$effect(() => {
		// Reset arrays to prevent accumulation
		threshold = [];
		steps = [];
		for (let i = 0; i < increments + 1; i++) {
			threshold.push(i / increments);
		}
		nodes = container.querySelectorAll(":scope > *:not(iframe)");
		update();
	});

	$effect(() => {
		top;
		bottom;
		update();
	});

	// Cleanup on unmount
	$effect(() => {
		return () => {
			intersectionObservers.forEach(observer => {
				if (observer) observer.disconnect();
			});
			intersectionObservers = [];
			steps = [];
			threshold = [];
		};
	});

</script>

<div bind:this={container}>
	{@render children?.()}
</div>
